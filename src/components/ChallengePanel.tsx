import { useMemo, useState } from 'react';

import { translate } from '../content/locales';
import {
  getOrderedChoices,
  getScenarioModifier,
  isChoiceAccepted
} from '../engine/game';
import { Choice, Challenge, GameState, Language } from '../engine/types';
import ConductorAgent from './ConductorAgent';

interface ChallengePanelProps {
  state: GameState;
  challenge: Challenge;
  eventDescId: string;
  language: Language;
  onChoiceSelected: (choice: Choice, isCorrect: boolean) => void;
  wrongConsequence: {
    consequenceTextId: string;
    hintTextId: string;
  } | null;
  onRetry: () => void;
}

export default function ChallengePanel({
  state,
  challenge,
  eventDescId,
  language,
  onChoiceSelected,
  wrongConsequence,
  onRetry
}: ChallengePanelProps) {
  const [showHint, setShowHint] = useState(false);
  const orderedChoices = useMemo(
    () => getOrderedChoices(challenge, state),
    [challenge, state.seed, state.stepIndex]
  );
  const modifier = getScenarioModifier(state, challenge);
  const regionName = translate(`region_${state.currentRegionId}_name`, language);

  const handleChoiceClick = (choice: Choice) => {
    onChoiceSelected(choice, isChoiceAccepted(challenge, choice.id));
    setShowHint(false);
  };

  return (
    <section className="challenge-panel" aria-label={translate('label_current_challenge', language)}>
      <div className="challenge-story">
        <p className="station-code">
          {String(state.stepIndex + 1).padStart(2, '0')} / 07 · {regionName}
        </p>
        <p className="event-description">{translate(eventDescId, language)}</p>
        <h1>{translate(challenge.textId, language)}</h1>
        <div className={`scenario-cue cue-${modifier}`}>
          <small>{translate('scenario_current_rule', language)}</small>
          <strong>{translate(`scenario_${modifier.replace('-', '_')}`, language)}</strong>
          <p>{translate(`scenario_${modifier.replace('-', '_')}_desc`, language)}</p>
        </div>
      </div>

      {wrongConsequence ? (
        <div className="wrong-answer-panel" role="alert">
          <span className="wrong-label">{translate('label_route_rejected', language)}</span>
          <p>{translate(wrongConsequence.consequenceTextId, language)}</p>
          {showHint ? (
            <div className="revealed-hint">
              <strong>{translate('label_hint', language)}</strong>
              <span>{translate(wrongConsequence.hintTextId, language)}</span>
            </div>
          ) : (
            <button className="text-button" onClick={() => setShowHint(true)}>
              {translate('btn_show_hint', language)}
            </button>
          )}
          <button className="primary-button" onClick={onRetry}>
            {translate('btn_retry', language)}
          </button>
        </div>
      ) : (
        <div className="choice-list">
          <div className="choice-heading">
            <small>{translate('label_choose_route', language)}</small>
            <span>
              {translate(
                challenge.correctChoiceId
                  ? 'label_order_changes'
                  : 'label_story_routes',
                language
              )}
            </span>
          </div>
          {orderedChoices.map((choice, index) => {
            const isLocked = Boolean(
              choice.requiresClueId && !state.clues.includes(choice.requiresClueId)
            );
            const timeCost = Math.abs(choice.cost.time ?? 0);
            const fareCost = Math.abs(choice.cost.fare ?? 0);

            return (
              <button
                className="choice-button"
                key={choice.id}
                onClick={() => !isLocked && handleChoiceClick(choice)}
                disabled={isLocked}
              >
                <span className="choice-index">{String.fromCharCode(65 + index)}</span>
                <span className="choice-copy">
                  <strong>
                    {isLocked
                      ? translate('label_requires_clue', language)
                      : translate(choice.textId, language)}
                  </strong>
                  {!isLocked && (
                    <small>
                      {translate('label_cost_time', language)} {timeCost}
                      <span>·</span>
                      {translate('label_cost_fare', language)} NT$ {fareCost}
                    </small>
                  )}
                </span>
                <span className="choice-arrow" aria-hidden="true">↗</span>
              </button>
            );
          })}
        </div>
      )}

      <ConductorAgent state={state} challenge={challenge} language={language} />
    </section>
  );
}
