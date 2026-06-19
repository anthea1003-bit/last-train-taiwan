import { translate } from '../content/locales';
import { Language } from '../engine/types';

interface CarriageInterludeProps {
  consequenceTextId: string | null;
  destinationImage: string;
  destinationName: string;
  isJourneyComplete: boolean;
  language: Language;
  onContinue: () => void;
  reducedMotion: boolean;
}

export default function CarriageInterlude({
  consequenceTextId,
  destinationImage,
  destinationName,
  isJourneyComplete,
  language,
  onContinue,
  reducedMotion
}: CarriageInterludeProps) {
  return (
    <section
      className={`arrival-transition ${reducedMotion ? 'is-reduced-motion' : ''}`}
      role="dialog"
      aria-labelledby="interlude-title"
    >
      <div className="arrival-scene">
        <img src={destinationImage} alt="" aria-hidden="true" />
        <div className="arrival-depth arrival-depth-back" aria-hidden="true" />
        <div className="arrival-depth arrival-depth-front" aria-hidden="true" />
        <div className="carriage-window-frame" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="arrival-copy">
        <p className="arrival-kicker">
          {translate(
            isJourneyComplete ? 'arrival_final_kicker' : 'arrival_next_kicker',
            language
          )}
        </p>
        <h2 id="interlude-title">{destinationName}</h2>
        <p className="arrival-description">{translate('interlude_desc', language)}</p>

        {consequenceTextId && (
          <div className="arrival-result">
            <small>{translate('arrival_previous_result', language)}</small>
            <p>{translate(consequenceTextId, language)}</p>
          </div>
        )}

        <button className="arrival-button" onClick={onContinue}>
          <span>{translate(
            isJourneyComplete ? 'arrival_view_ending' : 'btn_continue',
            language
          )}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="arrival-progress" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
