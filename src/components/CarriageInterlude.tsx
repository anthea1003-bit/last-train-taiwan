import { translate } from '../content/locales';
import { ChoiceRewardSummary, Language } from '../engine/types';

interface CarriageInterludeProps {
  consequenceTextId: string | null;
  destinationImage: string;
  destinationName: string;
  isJourneyComplete: boolean;
  language: Language;
  onContinue: () => void;
  reducedMotion: boolean;
  reward: ChoiceRewardSummary | null;
  destinationRegionId: string;
}

export default function CarriageInterlude({
  consequenceTextId,
  destinationImage,
  destinationName,
  isJourneyComplete,
  language,
  onContinue,
  reducedMotion,
  reward,
  destinationRegionId
}: CarriageInterludeProps) {
  const rewardItems = reward
    ? [
        reward.stamp && {
          type: 'stamp',
          label: `${translate(`region_${reward.completedRegionId}_name`, language)} · ${translate('reward_stamp', language)}`
        },
        reward.memory && {
          type: 'memory',
          label: translate('reward_memory', language)
        },
        reward.memoryMissed && {
          type: 'memory-missed',
          label: translate('reward_memory_missed', language)
        },
        reward.secretTicket && {
          type: 'secret-ticket',
          label: translate('reward_secret_ticket', language)
        },
        reward.penghuUnlocked && {
          type: 'penghu',
          label: translate('reward_penghu_route', language)
        }
      ].filter((item): item is { type: string; label: string } => Boolean(item))
    : [];

  return (
    <section
      className={`arrival-transition arrival-${destinationRegionId} ${reducedMotion ? 'is-reduced-motion' : ''}`}
      role="dialog"
      aria-labelledby="interlude-title"
    >
      <div className="arrival-scene">
        <img src={destinationImage} alt="" aria-hidden="true" />
        <div className="arrival-depth arrival-depth-back" aria-hidden="true" />
        <div className="arrival-depth arrival-depth-front" aria-hidden="true" />
        <div className="rail-speed-lines" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <span key={index} />)}
        </div>
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

        {rewardItems.length > 0 && (
          <div className="reward-reveal" aria-label={translate('reward_title', language)}>
            <small>{translate('reward_title', language)}</small>
            <div className="reward-items">
              {rewardItems.map((item) => (
                <div className={`reward-item reward-${item.type}`} key={`${item.type}-${language}`}>
                  <span className="reward-icon" aria-hidden="true">
                    {item.type === 'stamp' && '印'}
                    {item.type === 'memory' && '◇'}
                    {item.type === 'memory-missed' && '缺'}
                    {item.type === 'secret-ticket' && '券'}
                    {item.type === 'penghu' && '七'}
                  </span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
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
