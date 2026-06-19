import { PointerEvent, ReactNode } from 'react';

interface SceneStageProps {
  image: string;
  reducedMotion: boolean;
  children: ReactNode;
}

export default function SceneStage({
  image,
  reducedMotion,
  children
}: SceneStageProps) {
  const resetDepth = (element: HTMLDivElement) => {
    element.style.setProperty('--scene-bg-x', '0px');
    element.style.setProperty('--scene-bg-y', '0px');
    element.style.setProperty('--scene-ui-x', '0px');
    element.style.setProperty('--scene-ui-y', '0px');
    element.style.setProperty('--scene-rotate-x', '0deg');
    element.style.setProperty('--scene-rotate-y', '0deg');
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    event.currentTarget.style.setProperty('--scene-bg-x', `${x * -15}px`);
    event.currentTarget.style.setProperty('--scene-bg-y', `${y * -10}px`);
    event.currentTarget.style.setProperty('--scene-ui-x', `${x * 4}px`);
    event.currentTarget.style.setProperty('--scene-ui-y', `${y * 3}px`);
    event.currentTarget.style.setProperty('--scene-rotate-x', `${y * -0.35}deg`);
    event.currentTarget.style.setProperty('--scene-rotate-y', `${x * 0.55}deg`);
  };

  return (
    <div
      className={`scene-stage ${reducedMotion ? 'is-reduced-motion' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetDepth(event.currentTarget)}
    >
      <img className="scene-stage-art" src={image} alt="" aria-hidden="true" />
      <div className="scene-atmosphere scene-atmosphere-back" aria-hidden="true" />
      <div className="scene-atmosphere scene-atmosphere-front" aria-hidden="true" />
      <div className="scene-stage-content">{children}</div>
    </div>
  );
}
