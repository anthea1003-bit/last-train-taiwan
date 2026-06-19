import { GameState, Language } from '../engine/types';
import { translate } from '../content/locales';

interface TravelJournalProps {
  state: GameState;
  language: Language;
}

export default function TravelJournal({ state, language }: TravelJournalProps) {
  return (
    <section className="journal-panel" aria-label={translate('journal_title', language)}>
      <div className="section-heading">
        <span className="section-number">02</span>
        <div>
          <small>{translate('label_personal_log', language)}</small>
          <h2>{translate('journal_title', language)}</h2>
        </div>
      </div>

      <div className="journal-flags">
        <div className={state.secretTicket ? 'is-found' : ''}>
          <small>{translate('secret_ticket_active', language)}</small>
          <strong>{translate(state.secretTicket ? 'label_yes' : 'label_no', language)}</strong>
        </div>
        <div className={state.helpedPassengers.length > 0 ? 'is-found' : ''}>
          <small>{translate('help_passenger_active', language)}</small>
          <strong>{state.helpedPassengers.length}</strong>
        </div>
      </div>

      <div className="clue-list">
        <h3>{translate('clues_title', language)}</h3>
        {state.clues.length === 0 ? (
          <p>{translate('no_clues', language)}</p>
        ) : (
          <ul>
            {state.clues.map((clueId) => <li key={clueId}>{translate(clueId, language)}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
