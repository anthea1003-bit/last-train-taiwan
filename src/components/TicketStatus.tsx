import { GameState, Language } from '../engine/types';
import { translate } from '../content/locales';

interface TicketStatusProps {
  state: GameState;
  language: Language;
}

export default function TicketStatus({ state, language }: TicketStatusProps) {
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

  return (
    <section className="ticket-status" role="status" aria-label={translate('label_journey_status', language)}>
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
    </section>
  );
}
