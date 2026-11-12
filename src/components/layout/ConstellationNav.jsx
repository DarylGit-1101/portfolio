import React, { useState, useEffect } from 'react';
import { DiceIcon } from '../DiceIcon.jsx';
import { ShurikenStar } from '../ShurikenStar.jsx';
import { getModuleIcon, CloseIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';

function getModuleTelemetryLabel(mod) {
  if (mod.items) return `${String(mod.items.length).padStart(2, '0')} RECORDS`;
  if (mod.specs) return `${String(mod.specs.length).padStart(2, '0')} SPECS`;
  if (mod.categories) return `${String(mod.categories.length).padStart(2, '0')} SECTORS`;
  if (mod.quests) return `${String(mod.quests.length).padStart(2, '0')} LOGS`;
  if (mod.gear) return `${String(mod.gear.length).padStart(2, '0')} SLOTS`;
  if (mod.channels) return `${String(mod.channels.length).padStart(2, '0')} UPLINKS`;
  return 'READY';
}

function getViewportSize() {
  if (typeof window === 'undefined') return { width: 1280, height: 800 };
  return {
    width: document.documentElement.clientWidth || window.innerWidth,
    height: document.documentElement.clientHeight || window.innerHeight
  };
}

function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window)
  );
}

export function ConstellationNav({
  modules,
  mode,
  isSplitMode = false,
  activeModuleId,
  onSelectModule,
  onResetToCore,
  onCloseSplit
}) {
  const [hoveredModuleId, setHoveredModuleId] = useState(null);
  const [isHoveringDice, setIsHoveringDice] = useState(false);
  const [viewport, setViewport] = useState(getViewportSize);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportSize());
    };
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const isMobile = viewport.width <= 768;
  const isSmallMobile = viewport.width <= 420;

  // Responsive orbital circle radius so stars & labels fit comfortably on phones
  const circleRadius = isSmallMobile
    ? Math.min(108, Math.floor(viewport.width * 0.28))
    : isMobile
    ? 130
    : 180;
  const innerRingRadius = Math.round(circleRadius * 0.34);

  // Desktop uses a single top bar row (Dice in center, 3 stars left, 3 stars right).
  // Mobile uses a clean 2-row dock: Dice centered on row 1, 6 stars evenly spaced on row 2.
  const desktopTopY = Math.round(-viewport.height / 2 + 80);
  const mobileDiceTopY = Math.round(-viewport.height / 2 + 64);
  const mobileStarsTopY = Math.round(-viewport.height / 2 + 112);

  const desktopStep = Math.min(108, Math.max(72, Math.floor((viewport.width - 140) / 7)));
  const desktopXOffsets = [
    -desktopStep * 3,
    -desktopStep * 2,
    -desktopStep,
    desktopStep,
    desktopStep * 2,
    desktopStep * 3
  ];

  const mobileStep = Math.min(64, Math.max(48, Math.floor((viewport.width - 28) / 6)));
  const mobileXOffsets = [
    Math.round(-mobileStep * 2.5),
    Math.round(-mobileStep * 1.5),
    Math.round(-mobileStep * 0.5),
    Math.round(mobileStep * 0.5),
    Math.round(mobileStep * 1.5),
    Math.round(mobileStep * 2.5)
  ];

  // Split Mode (Archive project inspection):
  // Exact horizontal midpoint between the Left Detail Frame and the Right Archive List:
  // CSS uses: sidePad (36px desktop, 20px <=960px), rightArchiveWidth = clamp(320px, 28vw, 400px), splitGap = 108px
  const sidePad = viewport.width <= 960 ? 20 : 36;
  const splitGap = 108;
  const rightArchiveWidth = Math.min(400, Math.max(320, Math.round(viewport.width * 0.28)));
  const splitSpineX = Math.round(
    viewport.width / 2 - sidePad - rightArchiveWidth - splitGap / 2
  );

  // Topmost position for the Close (X) button (aligned with the top of the split panels, right below the header)
  const closeTopY = Math.round(-viewport.height / 2 + 82);

  // Vertical spacing for the 6 stars (3 above center Dice, 3 below), ensuring Star 0 stays below the topmost X button
  const maxSafeStep = Math.floor((Math.abs(closeTopY) - 48) / 3);
  const verticalStep = Math.min(54, Math.max(36, maxSafeStep));
  const verticalYOffsets = [
    -verticalStep * 3,
    -verticalStep * 2,
    -verticalStep,
    verticalStep,
    verticalStep * 2,
    verticalStep * 3
  ];

  // Slight upward shift in mobile circle mode so bottom labels & Diceu have breathing room
  const circleCenterOffsetY = isMobile ? -18 : 0;

  const getShurikenTransform = (index, total = 6) => {
    if (mode === 'circle') {
      const angleDeg = index * (360 / total) - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.round(Math.cos(angleRad) * circleRadius);
      const y = Math.round(Math.sin(angleRad) * circleRadius) + circleCenterOffsetY;
      return `translate3d(${x}px, ${y}px, 0)`;
    }
    if (isSplitMode && !isMobile) {
      const y = verticalYOffsets[index] ?? 0;
      return `translate3d(${splitSpineX}px, ${y}px, 0)`;
    }
    if (isMobile) {
      const x = mobileXOffsets[index] ?? 0;
      return `translate3d(${x}px, ${mobileStarsTopY}px, 0)`;
    }
    const x = desktopXOffsets[index] ?? 0;
    return `translate3d(${x}px, ${desktopTopY}px, 0)`;
  };

  const diceTransform =
    mode === 'circle'
      ? `translate3d(0px, ${circleCenterOffsetY}px, 0)`
      : isSplitMode && !isMobile
      ? `translate3d(${splitSpineX}px, 0px, 0)`
      : `translate3d(0px, ${isMobile ? mobileDiceTopY : desktopTopY}px, 0)`;

  const closeNodeTransform =
    isSplitMode && !isMobile
      ? `translate3d(${splitSpineX}px, ${closeTopY}px, 0)`
      : isMobile
      ? `translate3d(${Math.round(viewport.width / 2 - 34)}px, ${mobileDiceTopY}px, 0)`
      : `translate3d(${splitSpineX}px, ${closeTopY}px, 0)`;

  return (
    <div
      className="constellation-anchor"
      style={{
        left: `${Math.round(viewport.width / 2)}px`,
        top: `${Math.round(viewport.height / 2)}px`
      }}
    >
      {/* Circular Close (X) Node above highest star in Split Mode */}
      <div
        className={`split-close-node ${isSplitMode ? 'is-visible' : ''}`}
        style={{ transform: closeNodeTransform }}
        onMouseEnter={() => {
          if (!isTouchDevice() && isSplitMode) sound.playHover();
        }}
        onClick={() => {
          if (isSplitMode && onCloseSplit) {
            sound.playSelect();
            onCloseSplit();
          }
        }}
        title="Close Project View"
      >
        <CloseIcon size={14} />
      </div>

      {/* Outer & Inner Orbital Rings (Visible in Circle Mode) */}
      <div
        className="orbital-ring"
        style={{
          width: circleRadius * 2,
          height: circleRadius * 2,
          top: -circleRadius + circleCenterOffsetY,
          left: -circleRadius,
          opacity: mode === 'circle' ? 0.48 : 0,
          transform: mode === 'circle' ? 'scale(1)' : 'scale(0.45)'
        }}
      />
      <div
        className="orbital-ring-inner"
        style={{
          width: innerRingRadius * 2,
          height: innerRingRadius * 2,
          top: -innerRingRadius + circleCenterOffsetY,
          left: -innerRingRadius,
          opacity: mode === 'circle' ? 0.55 : 0,
          transform: mode === 'circle' ? 'scale(1)' : 'scale(0.4)'
        }}
      />

      {/* Center Dice (Anchor & Core Reset Button) */}
      <div
        className="dice-node"
        style={{ transform: diceTransform }}
        onMouseEnter={() => {
          if (!isTouchDevice()) {
            setIsHoveringDice(true);
            sound.playHover();
          }
        }}
        onMouseLeave={() => setIsHoveringDice(false)}
      >
        <DiceIcon
          size={isMobile && mode === 'top' ? 36 : isMobile ? 48 : 56}
          isHovered={isHoveringDice}
          onClick={onResetToCore}
          isTopMode={mode === 'top'}
        />

        {mode === 'top' && isMobile && (
          <div className="dice-mobile-return-pill" onClick={onResetToCore}>
            <span>CORE // RESET</span>
          </div>
        )}

        {mode === 'top' && isHoveringDice && !isMobile && (
          <div className="dice-reset-tooltip">
            [ CLICK TO DE-ACTIVATE // RETURN TO CORE ]
          </div>
        )}
      </div>

      {/* 6 Orbiting / Top-Bar / Vertical-Spine Shurikens */}
      {modules.map((mod, index) => {
        const isHovered = hoveredModuleId === mod.id;
        const isDimmed =
          (mode === 'circle' || isSplitMode) && hoveredModuleId !== null && !isHovered;
        const isActive = activeModuleId === mod.id;
        const isRightSide = index <= 2;
        const shortTitle = mod.title.split(' ')[0];

        return (
          <div
            key={mod.id}
            className={`shuriken-node ${isHovered ? 'is-hovered' : ''} ${
              isDimmed ? 'is-dimmed' : ''
            }`}
            style={{ transform: getShurikenTransform(index, modules.length) }}
            onMouseEnter={() => {
              if (!isTouchDevice() && !isMobile) {
                setHoveredModuleId(mod.id);
                sound.playHover();
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) setHoveredModuleId(null);
            }}
            onClick={() => onSelectModule(mod.id)}
          >
            <ShurikenStar
              isHovered={isHovered}
              isActive={isActive}
              size={isMobile ? (mode === 'top' ? 22 : 26) : 28}
            />

            {/* Mobile Circle Mode Label Badge (Positioned radially so it never overlaps) */}
            {mode === 'circle' && isMobile && (
              <div className={`shuriken-orbit-mobile-label orbit-pos-${index}`}>
                <span className="shuriken-orbit-mobile-code">{mod.code}</span>
                <span className="shuriken-orbit-mobile-title">{shortTitle}</span>
              </div>
            )}

            {/* Top Navigation Bar Module Label (Hidden when stars line vertically in Split Mode) */}
            {mode === 'top' && (!isSplitMode || isMobile) && (
              <div className={`shuriken-top-label ${isActive ? 'is-active' : ''}`}>
                {!isMobile && (
                  <span className="shuriken-top-label-icon">
                    {getModuleIcon(mod.id, { size: 12 })}
                  </span>
                )}
                <span className="shuriken-top-label-text">
                  {isMobile ? shortTitle : mod.title}
                </span>
              </div>
            )}

            {/* Hover Preview Card in Circle Mode AND Vertical Split Mode */}
            {(mode === 'circle' || isSplitMode) && isHovered && !isMobile && (
              <div
                className={`shuriken-preview-card ${
                  isSplitMode ? 'pos-left' : isRightSide ? 'pos-right' : 'pos-left'
                }`}
              >
                {/* Tactical Leader Line connecting star to readout */}
                <span className="shuriken-preview-connector" />

                {/* High-Contrast YoRHa Top Telemetry Banner */}
                <div className="shuriken-preview-banner">
                  <span className="shuriken-preview-banner-left">
                    <span className="shuriken-preview-pip" />
                    <span>MODULE [{mod.code}]</span>
                  </span>
                  <span className="shuriken-preview-banner-right">
                    {getModuleTelemetryLabel(mod)}
                  </span>
                </div>

                {/* Main Dossier Readout Body */}
                <div className="shuriken-preview-body">
                  <div className="shuriken-preview-grid-bg" />

                  <div className="shuriken-preview-top-row">
                    <div className="shuriken-preview-icon-box">
                      {getModuleIcon(mod.id, { size: 18 })}
                    </div>
                    <div className="shuriken-preview-title-wrap">
                      <h3 className="shuriken-preview-title">{mod.title}</h3>
                      <div className="shuriken-preview-subtitle">{mod.subtitle}</div>
                    </div>
                  </div>

                  <p className="shuriken-preview-tagline">{mod.tagline}</p>

                  <div className="shuriken-preview-cta">
                    <span className="shuriken-preview-status">STATUS: ONLINE</span>
                    <span className="shuriken-preview-engage">
                      <span>ENGAGE</span>
                      <span>↗</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
