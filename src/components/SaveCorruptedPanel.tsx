import { Language } from '../engine/types';
import { translate } from '../content/locales';

interface SaveCorruptedPanelProps {
  language: Language;
  onFreshStart: () => void;
}

export default function SaveCorruptedPanel({
  language,
  onFreshStart
}: SaveCorruptedPanelProps) {
  return (
    <div
      className="save-corrupted-panel"
      role="alertdialog"
      aria-labelledby="corrupted-title"
      aria-describedby="corrupted-desc"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backgroundColor: '#FFF',
        border: '3px solid var(--color-coral)',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px',
        margin: '2rem auto',
        fontFamily: 'var(--font-main)',
        boxShadow: '0 8px 24px rgba(225,29,72,0.15)',
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: '3rem', color: 'var(--color-coral)' }} aria-hidden="true">
        ⚠️
      </div>

      <h2 id="corrupted-title" style={{ margin: 0, color: 'var(--color-coral)' }}>
        {translate('save_corrupted_title', language)}
      </h2>

      <p
        id="corrupted-desc"
        style={{
          lineHeight: '1.6',
          color: 'var(--color-text-dark)',
          fontSize: '1rem',
          margin: 0
        }}
      >
        {translate('save_corrupted_desc', language)}
      </p>

      <button
        onClick={onFreshStart}
        className="btn-action"
        style={{
          backgroundColor: 'var(--color-coral)',
          color: '#FFF',
          border: 'none',
          borderRadius: '4px',
          padding: '0.85rem 2rem',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          minHeight: '44px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        💥 {translate('btn_fresh_start', language)}
      </button>
    </div>
  );
}
