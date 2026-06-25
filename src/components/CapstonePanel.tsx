import { translate } from '../content/locales';
import { Language } from '../engine/types';

interface CapstonePanelProps {
  language: Language;
  onClose: () => void;
}

const repositoryUrl = 'https://github.com/anthea1003-bit/last-train-taiwan';

export default function CapstonePanel({ language, onClose }: CapstonePanelProps) {
  const cards = [
    {
      number: '01',
      title: translate('capstone_card_track_title', language),
      body: translate('capstone_card_track_body', language)
    },
    {
      number: '02',
      title: translate('capstone_card_agent_title', language),
      body: translate('capstone_card_agent_body', language)
    },
    {
      number: '03',
      title: translate('capstone_card_security_title', language),
      body: translate('capstone_card_security_body', language)
    },
    {
      number: '04',
      title: translate('capstone_card_delivery_title', language),
      body: translate('capstone_card_delivery_body', language)
    }
  ];

  return (
    <div
      className="capstone-panel-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="capstone-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capstone-panel-title"
      >
        <div className="capstone-ticket-edge" aria-hidden="true" />
        <button
          className="capstone-close"
          onClick={onClose}
          aria-label={translate('capstone_close_label', language)}
        >
          ×
        </button>

        <p className="capstone-kicker">{translate('capstone_kicker', language)}</p>
        <h2 id="capstone-panel-title">{translate('capstone_title', language)}</h2>
        <p className="capstone-summary">{translate('capstone_summary', language)}</p>

        <div className="capstone-proof-strip" aria-label={translate('capstone_proof_label', language)}>
          <span>{translate('capstone_proof_runtime', language)}</span>
          <span>{translate('capstone_proof_skills', language)}</span>
          <span>{translate('capstone_proof_security', language)}</span>
          <span>{translate('capstone_proof_deploy', language)}</span>
        </div>

        <div className="capstone-card-grid">
          {cards.map((card) => (
            <article className="capstone-card" key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="capstone-submission-row">
          <div>
            <strong>{translate('capstone_submission_title', language)}</strong>
            <p>{translate('capstone_submission_body', language)}</p>
          </div>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            {translate('capstone_repo_link', language)}
          </a>
        </div>
      </section>
    </div>
  );
}
