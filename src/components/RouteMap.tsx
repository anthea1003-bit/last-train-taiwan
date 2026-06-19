import { translate } from '../content/locales';
import { GameState, Language } from '../engine/types';

interface RouteMapProps {
  state: GameState;
  language: Language;
}

const STATIONS = [
  ['north', 'region_north_name'],
  ['hsinchu_miaoli', 'region_hsinchu_miaoli_name'],
  ['central', 'region_central_name'],
  ['south_west', 'region_south_west_name'],
  ['kaohsiung_pingtung', 'region_kaohsiung_pingtung_name'],
  ['east', 'region_east_name']
] as const;

export default function RouteMap({ state, language }: RouteMapProps) {
  const isPenghuUnlocked = state.currentRegionId === 'penghu'
    || state.history.includes('penghu');

  return (
    <section className="route-map" aria-label={translate('map_title', language)}>
      <div className="section-heading">
        <span className="section-number">01</span>
        <div>
          <small>{translate('label_route_record', language)}</small>
          <h2>{translate('map_title', language)}</h2>
        </div>
        <strong className="stamp-count">{state.ticketStamps.length}/6</strong>
      </div>

      <ol className="station-list">
        {STATIONS.map(([stationId, nameKey], index) => {
          const isCurrent = state.currentRegionId === stationId;
          const isStamped = state.ticketStamps.includes(stationId);
          return (
            <li className={`${isCurrent ? 'is-current' : ''} ${isStamped ? 'is-stamped' : ''}`} key={stationId}>
              <span className="station-node">{isStamped ? '✓' : index + 1}</span>
              <span className="station-name">{translate(nameKey, language)}</span>
              {isCurrent && <span className="current-label">{translate('label_now', language)}</span>}
            </li>
          );
        })}
        <li className={`secret-station ${isPenghuUnlocked ? 'is-unlocked' : ''}`}>
          <span className="station-node">{isPenghuUnlocked ? '7' : '?'}</span>
          <span className="station-name">
            {isPenghuUnlocked
              ? translate('region_penghu_name', language)
              : translate('label_hidden_station', language)}
          </span>
          {state.currentRegionId === 'penghu' && (
            <span className="current-label">{translate('label_now', language)}</span>
          )}
        </li>
      </ol>
    </section>
  );
}
