import { FormEvent, useEffect, useRef, useState } from 'react';

import { createConductorReplyAsync, detectAgentMode, AgentMode } from '../agent/conductor';
import { translate } from '../content/locales';
import { Challenge, GameState, Language } from '../engine/types';

interface ConductorAgentProps {
  state: GameState;
  challenge: Challenge;
  language: Language;
}

interface ChatMessage {
  id: number;
  role: 'agent' | 'player';
  text: string;
}

export default function ConductorAgent({
  state,
  challenge,
  language
}: ConductorAgentProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [agentMode, setAgentMode] = useState<AgentMode>('local');
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const savedKey = localStorage.getItem('user_gemini_api_key') || '';
    setApiKey(savedKey);
    detectAgentMode(savedKey).then(setAgentMode);

    setMessages([{
      id: 0,
      role: 'agent',
      text: translate('agent_station_intro', language)
    }]);
    setInput('');
    setIsTyping(false);
  }, [challenge.id, language]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { id: messages.length, role: 'player', text: trimmed }
    ];

    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await createConductorReplyAsync({
        input: trimmed,
        state,
        challenge,
        language,
        turnIndex: updatedMessages.filter((message) => message.role === 'player').length,
        userApiKey: apiKey || null
      });

      setMessages((current) => [
        ...current,
        { id: current.length, role: 'agent', text: reply.text }
      ]);
    } catch (error) {
      console.error('[ConductorAgent UI Error]:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleSaveKey = (key: string) => {
    const cleanKey = key.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('user_gemini_api_key', cleanKey);
    } else {
      localStorage.removeItem('user_gemini_api_key');
    }
    detectAgentMode(cleanKey).then(setAgentMode);
    setShowSettings(false);
  };

  const getModeLabel = () => {
    if (agentMode === 'nano') return translate('agent_mode_nano', language);
    if (agentMode === 'cloud') return translate('agent_mode_cloud', language);
    return translate('agent_mode_local', language);
  };

  const quickPrompts = [
    translate('agent_prompt_hint', language),
    translate('agent_prompt_resources', language),
    translate('agent_prompt_ticket', language)
  ];

  return (
    <section className="agent-console" aria-label={translate('agent_title', language)}>
      <div className="agent-header">
        <div className="agent-avatar" aria-hidden="true">車</div>
        <div>
          <small>{translate('agent_status', language)}</small>
          <h3>{translate('agent_title', language)}</h3>
        </div>
        <div className="agent-header-badges">
          <span className={`local-agent-badge mode-${agentMode}`}>{getModeLabel()}</span>
          <button
            type="button"
            className={`agent-settings-btn ${showSettings ? 'is-active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="agent-settings-panel">
          <label htmlFor="api-key-input">{translate('settings_api_key_label', language)}</label>
          <div className="settings-input-group">
            <input
              id="api-key-input"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder={translate('settings_api_key_placeholder', language)}
            />
            <button type="button" className="settings-btn-save" onClick={() => handleSaveKey(apiKey)}>
              {translate('settings_save_btn', language)}
            </button>
            <button type="button" className="settings-btn-clear" onClick={() => handleSaveKey('')}>
              {translate('settings_clear_btn', language)}
            </button>
          </div>
          <p className="settings-desc">{translate('settings_api_key_desc', language)}</p>
        </div>
      )}

      <div className="agent-messages" aria-live="polite">
        {messages.map((message) => (
          <div className={`agent-message is-${message.role}`} key={message.id}>
            <span>{message.role === 'agent' ? translate('agent_name', language) : translate('label_you', language)}</span>
            <p>{message.text}</p>
          </div>
        ))}
        {isTyping && (
          <div className="agent-message is-agent is-typing" aria-live="assertive">
            <span>{translate('agent_name', language)}</span>
            <p className="typing-dots">
              {translate('agent_typing', language)}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="agent-quick-prompts">
        {quickPrompts.map((prompt) => (
          <button
            type="button"
            onClick={() => sendMessage(prompt)}
            key={prompt}
            disabled={isTyping}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="agent-input-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="agent-question">
          {translate('agent_input_label', language)}
        </label>
        <input
          id="agent-question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={translate('agent_input_placeholder', language)}
          maxLength={180}
          disabled={isTyping}
        />
        <button type="submit" disabled={!input.trim() || isTyping}>
          {translate('agent_send', language)}
        </button>
      </form>
    </section>
  );
}

