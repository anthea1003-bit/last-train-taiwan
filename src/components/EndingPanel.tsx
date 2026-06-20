import { GameState, Language } from '../engine/types';
import { translate } from '../content/locales';
import { getSceneImage } from '../content/scene-images';
import { determineAvailableEndings } from '../engine/game';

interface EndingPanelProps {
  state: GameState;
  language: Language;
  onSelectEnding: (endingId: string) => void;
  onRestart: () => void;
}

export default function EndingPanel({
  state,
  language,
  onSelectEnding,
  onRestart
}: EndingPanelProps) {
  const availableEndings = determineAvailableEndings(state);
  const penghuRequirements = [
    {
      label: translate('secret_ticket_active', language),
      value: state.secretTicket
        ? translate('ending_requirement_met', language)
        : translate('ending_requirement_missing', language),
      met: state.secretTicket
    },
    {
      label: translate('label_stamps', language),
      value: `${state.ticketStamps.length} / 6`,
      met: state.ticketStamps.length === 6
    },
    {
      label: translate('label_memories', language),
      value: `${state.memoryFragments} / 6`,
      met: state.memoryFragments === 6
    }
  ];

  return (
    <div
      className="ending-panel"
      role="main"
      aria-label="Ending Chapter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backgroundColor: '#FCFAF2',
        border: '3px solid var(--color-lamp-gold)',
        borderRadius: '8px',
        padding: '2rem',
        fontFamily: 'var(--font-main)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}
    >
      <h2
        style={{
          margin: 0,
          color: 'var(--color-railway-green)',
          textAlign: 'center',
          borderBottom: '2px dashed var(--color-railway-green)',
          paddingBottom: '0.75rem',
          fontSize: '1.6rem'
        }}
      >
        🌅 {translate('ending_selection_title', language)}
      </h2>

      {/* 結局列表選擇 */}
      {!state.selectedEnding ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ lineHeight: '1.6', color: 'var(--color-text-dark)', textAlign: 'center' }}>
            {translate('ending_selection_desc', language)}
          </p>

          {!state.history.includes('penghu') && (
            <section
              aria-label={translate('ending_penghu_locked_title', language)}
              style={{
                border: '1px solid rgba(15, 76, 68, 0.35)',
                backgroundColor: 'rgba(15, 76, 68, 0.06)',
                padding: '1rem',
                borderRadius: '6px'
              }}
            >
              <strong style={{ color: 'var(--color-railway-green)' }}>
                {translate('ending_penghu_locked_title', language)}
              </strong>
              <p style={{ margin: '0.45rem 0 0.8rem', lineHeight: '1.5', color: '#445' }}>
                {translate('ending_penghu_locked_desc', language)}
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.5rem'
                }}
              >
                {penghuRequirements.map((requirement) => (
                  <div
                    key={requirement.label}
                    style={{
                      backgroundColor: '#FFF',
                      border: `1px solid ${requirement.met ? 'var(--color-railway-green)' : 'var(--color-coral)'}`,
                      borderRadius: '4px',
                      padding: '0.65rem'
                    }}
                  >
                    <small style={{ display: 'block', color: '#667' }}>{requirement.label}</small>
                    <strong style={{ color: requirement.met ? 'var(--color-railway-green)' : 'var(--color-coral)' }}>
                      {requirement.value}
                    </strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {availableEndings.map((ending) => (
              <button
                key={ending.id}
                onClick={() => onSelectEnding(ending.id)}
                className="ending-choice-button"
                style={{
                  padding: '1.25rem',
                  border: '2px solid var(--color-railway-green)',
                  borderRadius: '6px',
                  backgroundColor: '#FFF',
                  color: 'var(--color-text-dark)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1.05rem',
                  transition: 'background-color 0.2s',
                  minHeight: '48px'
                }}
              >
                <strong style={{ color: 'var(--color-railway-green)', display: 'block', marginBottom: '0.25rem' }}>
                  {translate(ending.titleId, language)}
                </strong>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>
                  {translate(ending.descriptionId, language).substring(0, 50)}...
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 展示已選結局 */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* 結局大圖與優雅 Fallback */}
          <div
            style={{
              width: '100%',
              height: '220px',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={
                state.selectedEnding === 'penghu-true'
                  ? getSceneImage('penghu')
                  : getSceneImage('hero')
              }
              alt="Ending Scene"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.backgroundImage = 'linear-gradient(135deg, var(--color-railway-green), var(--color-indigo-night))';
                  const textNode = document.createElement('div');
                  textNode.innerText = '🌅 [JOURNEY END] 🌅';
                  textNode.style.color = 'var(--color-lamp-gold)';
                  textNode.style.fontSize = '1.25rem';
                  textNode.style.fontWeight = 'bold';
                  parent.appendChild(textNode);
                }
              }}
            />
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-coral)',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            ✦ {translate('label_ending_achieved', language).toUpperCase()} ✦
          </div>

          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-railway-green)', fontSize: '1.4rem' }}>
            {translate(
              state.selectedEnding === 'penghu-true'
                ? 'ending_penghu_true_title'
                : `ending_${state.selectedEnding.replace('-', '_')}_title`,
              language
            )}
          </h3>

          <p
            style={{
              lineHeight: '1.7',
              color: 'var(--color-text-dark)',
              maxWidth: '600px',
              fontSize: '1.05rem',
              margin: '0 0 1.5rem 0',
              textAlign: 'left',
              backgroundColor: '#FFF',
              padding: '1.25rem',
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            {translate(
              state.selectedEnding === 'penghu-true'
                ? 'ending_penghu_true_desc'
                : `ending_${state.selectedEnding.replace('-', '_')}_desc`,
              language
            )}
          </p>

          <button
            onClick={onRestart}
            className="btn-action"
            style={{
              backgroundColor: 'var(--color-railway-green)',
              color: '#FFF',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 2rem',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              minHeight: '44px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            ↩ {translate('btn_restart', language)}
          </button>
        </div>
      )}
    </div>
  );
}
