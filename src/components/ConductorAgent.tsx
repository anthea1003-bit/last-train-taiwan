import { FormEvent, useEffect, useState } from 'react';

import { createConductorReply } from '../agent/conductor';
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

  useEffect(() => {
    setMessages([{
      id: 0,
      role: 'agent',
      text: translate('agent_station_intro', language)
    }]);
    setInput('');
  }, [challenge.id, language]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const reply = createConductorReply({
      input: trimmed,
      state,
      challenge,
      language,
      turnIndex: messages.filter((message) => message.role === 'player').length
    });

    setMessages((current) => [
      ...current,
      { id: current.length, role: 'player', text: trimmed },
      { id: current.length + 1, role: 'agent', text: reply.text }
    ]);
    setInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
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
        <span className="local-agent-badge">{translate('agent_zero_token', language)}</span>
      </div>

      <div className="agent-messages" aria-live="polite">
        {messages.map((message) => (
          <div className={`agent-message is-${message.role}`} key={message.id}>
            <span>{message.role === 'agent' ? translate('agent_name', language) : translate('label_you', language)}</span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="agent-quick-prompts">
        {quickPrompts.map((prompt) => (
          <button type="button" onClick={() => sendMessage(prompt)} key={prompt}>
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
        />
        <button type="submit" disabled={!input.trim()}>
          {translate('agent_send', language)}
        </button>
      </form>
    </section>
  );
}
