import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { translate } from './content/locales';
import { REGIONS } from './content/regions';
import { getSceneImage } from './content/scene-images';
import TicketStatus from './components/TicketStatus';
import RouteMap from './components/RouteMap';
import TravelJournal from './components/TravelJournal';
import ChallengePanel from './components/ChallengePanel';
import CarriageInterlude from './components/CarriageInterlude';
import EndingPanel from './components/EndingPanel';
import SaveCorruptedPanel from './components/SaveCorruptedPanel';
import SceneStage from './components/SceneStage';
import CapstonePanel from './components/CapstonePanel';

export default function App() {
  const [isCapstonePanelOpen, setIsCapstonePanelOpen] = useState(false);
  const {
    state,
    phase,
    language,
    reducedMotion,
    wrongConsequence,
    successConsequence,
    successReward,
    setLanguage,
    setReducedMotion,
    startNewGame,
    resumeGame,
    hasSave,
    handleChoice,
    dismissInterlude,
    selectEnding,
    restartGame,
    freshStart,
    clearWrongConsequence
  } = useGameState();

  const currentRegion = state
    ? REGIONS.find((region) => region.id === state.currentRegionId)
    : null;
  const currentEvent = currentRegion && state?.currentEventId
    ? currentRegion.events.find((event) => event.id === state.currentEventId)
    : null;
  const currentScene = state
    ? getSceneImage(state.currentRegionId)
    : getSceneImage('hero');

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={restartGame} aria-label={translate('label_home', language)}>
          <span className="brand-mark" aria-hidden="true">LT</span>
          <span>
            <strong>{translate('game_title', language)}</strong>
            <small>TAIWAN · ROUND ISLAND · 15 MIN</small>
          </span>
        </button>

        <div className="topbar-actions">
          <button
            className="utility-button capstone-button"
            onClick={() => setIsCapstonePanelOpen(true)}
            aria-label={translate('capstone_open_label', language)}
          >
            <span aria-hidden="true">票</span>
            <span className="utility-label">{translate('capstone_button', language)}</span>
          </button>
          <button
            className="utility-button"
            onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
            aria-label={`Switch to ${language === 'zh-TW' ? 'English' : '繁體中文'}`}
          >
            <span aria-hidden="true">A / 文</span>
            {language === 'zh-TW' ? 'English' : '繁體中文'}
          </button>
          <button
            className={`utility-button ${reducedMotion ? 'is-active' : ''}`}
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-label={translate(
              reducedMotion ? 'reduced_motion_active' : 'reduced_motion_inactive',
              language
            )}
          >
            <span aria-hidden="true">◐</span>
            <span className="utility-label">
              {translate(reducedMotion ? 'reduced_motion_active' : 'reduced_motion_inactive', language)}
            </span>
          </button>
        </div>
      </header>

      {isCapstonePanelOpen && (
        <CapstonePanel
          language={language}
          onClose={() => setIsCapstonePanelOpen(false)}
        />
      )}

      <main className="main-content">
        {phase === 'title' && (
          <section className="title-hero">
            <img
              className="title-hero-image"
              src={getSceneImage('hero')}
              alt={language === 'zh-TW' ? '雨霧中行駛的阿里山森林列車' : 'A forest railway train traveling through rain and mist'}
            />
            <div className="title-hero-wash" />
            <div className="title-copy">
              <p className="eyebrow">{translate('hero_eyebrow', language)}</p>
              <h1>{translate('game_title', language)}</h1>
              <p className="hero-subtitle">{translate('game_subtitle', language)}</p>
              <p className="hero-prologue">{translate('prologue_text', language)}</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => startNewGame()}>
                  {translate('btn_new_game', language)}
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  className="secondary-button"
                  onClick={() => hasSave() && resumeGame()}
                  disabled={!hasSave()}
                >
                  {translate('btn_resume_game', language)}
                </button>
              </div>
              <div className="journey-facts" aria-label={translate('label_journey_facts', language)}>
                <span>07 {translate('label_stations_short', language)}</span>
                <span>15 {translate('label_minutes', language)}</span>
                <span>00 {translate('label_public_tokens', language)}</span>
              </div>
            </div>
          </section>
        )}

        {phase === 'corrupted' && (
          <SaveCorruptedPanel language={language} onFreshStart={freshStart} />
        )}

        {phase === 'playing' && state && currentEvent && (
          <SceneStage
            image={currentScene}
            regionId={state.currentRegionId}
            reducedMotion={reducedMotion}
          >
            <div className="game-layout">
              <TicketStatus
                state={state}
                language={language}
                reducedMotion={reducedMotion}
              />
              <div className="game-grid">
                <aside className="journey-sidebar">
                  <RouteMap state={state} language={language} />
                  <TravelJournal state={state} language={language} />
                </aside>
                <ChallengePanel
                  state={state}
                  challenge={currentEvent.challenge}
                  eventDescId={currentEvent.textId}
                  language={language}
                  onChoiceSelected={handleChoice}
                  wrongConsequence={wrongConsequence}
                  onRetry={clearWrongConsequence}
                />
              </div>
            </div>
          </SceneStage>
        )}

        {phase === 'interlude' && state && (
          <CarriageInterlude
            consequenceTextId={successConsequence}
            destinationImage={currentScene}
            destinationName={
              state.isCompleted
                ? translate('arrival_final_destination', language)
                : translate(`region_${state.currentRegionId}_name`, language)
            }
            isJourneyComplete={state.isCompleted}
            language={language}
            onContinue={dismissInterlude}
            reducedMotion={reducedMotion}
            reward={successReward}
            destinationRegionId={state.currentRegionId}
          />
        )}

        {phase === 'ending' && state && (
          <div
            className="centered-stage ending-stage"
            style={{
              backgroundImage: `linear-gradient(rgba(5, 14, 20, 0.56), rgba(5, 14, 20, 0.8)), url("${getSceneImage(
                state.selectedEnding === 'penghu-true' ? 'penghu' : 'hero'
              )}")`
            }}
          >
            <EndingPanel
              state={state}
              language={language}
              onSelectEnding={selectEnding}
              onRestart={restartGame}
            />
          </div>
        )}
      </main>
    </div>
  );
}
