import { PointerEvent, useState } from 'react';

import { checkTrueEndingEligibility } from '../engine/game';
import { GameState, Language } from '../engine/types';
import { translate } from '../content/locales';

interface TicketStatusProps {
  state: GameState;
  language: Language;
  reducedMotion: boolean;
}

export default function TicketStatus({
  state,
  language,
  reducedMotion
}: TicketStatusProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasPenghuRoute = checkTrueEndingEligibility(state)
    || state.currentRegionId === 'penghu'
    || state.history.includes('penghu');
  const metrics = [
    {
      symbol: 'T',
      label: translate('label_time', language),
      value: `${state.time} ${translate('label_hours', language)}`,
      urgent: state.time <= 3
    },
    {
      symbol: '$',
      label: translate('label_fare', language),
      value: `NT$ ${state.fare}`,
      urgent: state.fare === 0
    },
    {
      symbol: 'M',
      label: translate('label_memories', language),
      value: `${state.memoryFragments} / 6`
    },
    {
      symbol: 'S',
      label: translate('label_stamps', language),
      value: `${state.ticketStamps.length} / 6`
    }
  ];

  const resetTilt = (element: HTMLDivElement) => {
    element.style.setProperty('--ticket-tilt-x', '0deg');
    element.style.setProperty('--ticket-tilt-y', '0deg');
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch' || isFlipped) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--ticket-tilt-x', `${y * -3}deg`);
    event.currentTarget.style.setProperty('--ticket-tilt-y', `${x * 5}deg`);
  };

  return (
    <section
      className={`ticket-status-shell ${isFlipped ? 'is-flipped' : ''} ${hasPenghuRoute ? 'has-hidden-route' : ''}`}
      role="status"
      aria-label={translate('label_journey_status', language)}
    >
      <div
        className="ticket-3d"
        onPointerMove={handlePointerMove}
        onPointerLeave={(event) => resetTilt(event.currentTarget)}
      >
        <div className="ticket-status ticket-face ticket-front" aria-hidden={isFlipped}>
          <div className="ticket-heading">
            <span className="ticket-kicker">{translate('label_active_ticket', language)}</span>
            <strong>{translate('game_title', language)}</strong>
            <small>NO. {state.seed.toUpperCase()}</small>
          </div>
          <div className="ticket-metrics">
            {metrics.map((metric) => (
              <div className={`ticket-metric ${metric.urgent ? 'is-urgent' : ''}`} key={metric.label}>
                <span className="metric-symbol" aria-hidden="true">{metric.symbol}</span>
                <span>
                  <small>{metric.label}</small>
                  <strong>{metric.value}</strong>
                </span>
              </div>
            ))}
          </div>
          {hasPenghuRoute && <span className="ticket-gold-route" aria-hidden="true" />}
        </div>

        <div className="ticket-status ticket-face ticket-back" aria-hidden={!isFlipped}>
          <div className="ticket-back-copy">
            <small>{translate('ticket_reverse_kicker', language)}</small>
            <strong>{translate(
              hasPenghuRoute ? 'ticket_reverse_unlocked' : 'ticket_reverse_locked',
              language
            )}</strong>
            <span>NO. {state.seed.toUpperCase()}</span>
          </div>
          <div className="ticket-route-line" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => (
              <i
                className={index < state.ticketStamps.length || (index === 6 && hasPenghuRoute) ? 'is-lit' : ''}
                key={index}
              />
            ))}
          </div>
          <p>{translate('ticket_reverse_desc', language)}</p>
        </div>
      </div>

      <button
        className="ticket-flip-button"
        type="button"
        onClick={() => setIsFlipped((current) => !current)}
        aria-label={translate('ticket_flip_label', language)}
        title={translate('ticket_flip_label', language)}
      >
        ↻
      </button>
    </section>
  );
}
