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

function getMobileShortLabel(mod) {
  const map = {
    archive: 'ARCHIVE',
    unit_data: 'UNIT',
    chip_config: 'CHIPS',
    chronicles: 'JOURNEY',
    arsenal: 'ARSENAL',
    transmissions: 'COMMS'
  };
  if (map[mod.id]) return map[mod.id];
  const firstWord = (mod.title || '').split(' ')[0];
  return firstWord.length > 7 ? firstWord.slice(0, 7) : firstWord;
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
  profile,
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

  const anchorX = Math.round(viewport.width / 2);
  const anchorY = Math.round(viewport.height / 2);

  // Responsive orbital circle radius so stars & labels fit comfortably on phones
  const circleRadius = isSmallMobile
    ? Math.min(104, Math.floor(viewport.width * 0.265))
    : isMobile
    ? 122
    : 180;
  const innerRingRadius = Math.round(circleRadius * 0.34);

  // Desktop uses a single top bar row (Dice in center, 3 stars left, 3 stars right).
  const desktopTopY = 80 - anchorY;
  const desktopStep = Math.min(108, Math.max(72, Math.floor((viewport.width - 140) / 7)));
  const desktopXOffsets = [
    -desktopStep * 3,
    -desktopStep * 2,
    -desktopStep,
    desktopStep,
    desktopStep * 2,
    desktopStep * 3
  ];

  // Mobile uses a framed 2-tier Tactical HUD Dock aligned flush with the 10px dossier margins
  const mobileSidePad = 10;
  const mobileDockWidth = Math.max(280, viewport.width - mobileSidePad * 2);
  const mobileDockLeft = mobileSidePad - anchorX;
  const mobileDockTop = 40 - anchorY;
  const mobileDockCenterX = Number((mobileDockLeft + mobileDockWidth / 2).toFixed(2));

  // Row 1 (38px tall) center & Row 2 (48px tall) star center inside the 86px dock
  const mobileDiceTopY = mobileDockTop + 19;
  const mobileStarsTopY = mobileDockTop + 56;

  // Inner width of the 6-column CSS grid (accounting for 1px left/right dock border)
  const mobileInnerWidth = mobileDockWidth - 2;
  const mobileSlotWidth = mobileInnerWidth / 6;
  const mobileXOffsets = [0, 1, 2, 3, 4, 5].map((i) =>
    Number((mobileDockLeft + 1 + (i + 0.5) * mobileSlotWidth).toFixed(2))
  );

  // Split Mode (Archive project inspection on Desktop):
  // Exact horizontal midpoint between the Left Detail Frame and the Right Archive List:
  const sidePad = viewport.width <= 960 ? 20 : 36;
  const splitGap = 108;
  const rightArchiveWidth = Math.min(400, Math.max(320, Math.round(viewport.width * 0.28)));
  const splitSpineX = Math.round(
    viewport.width - sidePad - rightArchiveWidth - splitGap / 2 - anchorX
  );

  // Uniform edge-to-edge vertical spine spacing on Desktop Split Mode:
  // Panels span top: 64px to bottom: 52px (midpoint = +6px relative to anchorY).
  // Accounts for Dice radius (28px), Star radius (14px), and Close button radius (17px).
  const spineCenterY = 6;
  const maxTopSpan = anchorY + spineCenterY - 81;
  const spineGap = Math.min(20, Math.max(8, Math.floor((maxTopSpan - 129) / 4)));
  const closeTopY = spineCenterY - 129 - 4 * spineGap;
  const verticalYOffsets = [
    spineCenterY - 98 - 3 * spineGap,
    spineCenterY - 70 - 2 * spineGap,
    spineCenterY - 42 - spineGap,
    spineCenterY + 42 + spineGap,
    spineCenterY + 70 + 2 * spineGap,
    spineCenterY + 98 + 3 * spineGap
  ];

  // Shift mobile orbital circle slightly downward to center between top briefing card and Diceu
  const circleCenterOffsetY = isMobile ? 14 : 0;

  const getShurikenTransform = (index, total = 6) => {
    if (mode === 'circle') {
      const angleDeg = index * (360 / total) - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Number((Math.cos(angleRad) * circleRadius + (isMobile ? mobileDockCenterX : 0)).toFixed(2));
      const y = Number((Math.sin(angleRad) * circleRadius + circleCenterOffsetY).toFixed(2));
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
      ? `translate3d(${isMobile ? mobileDockCenterX : 0}px, ${circleCenterOffsetY}px, 0)`
      : isSplitMode && !isMobile
      ? `translate3d(${splitSpineX}px, ${spineCenterY}px, 0)`
      : isMobile
      ? `translate3d(${mobileDockCenterX}px, ${mobileDiceTopY}px, 0)`
      : `translate3d(0px, ${desktopTopY}px, 0)`;

  const closeNodeTransform = `translate3d(${splitSpineX}px, ${closeTopY}px, 0)`;
  const activeMod = modules.find((m) => m.id === activeModuleId);

  return (
    <div
      className="constellation-anchor"
      style={{
        left: `${anchorX}px`,
        top: `${anchorY}px`
      }}
    >
      {/* Mobile Core Briefing Banner (Visible in Circle Mode on Mobile) */}
      {isMobile && mode === 'circle' && (
        <div
          className="mobile-core-briefing"
          style={{
            top: `${48 - anchorY}px`,
            width: `${mobileDockWidth}px`,
            left: `${mobileDockLeft}px`
          }}
        >
          <div className="mobile-core-briefing-top">
            <span className="mobile-core-briefing-pip" />
            <span>UNIT // {profile?.codename || 'DICEU'} CORE</span>
            <span className="mobile-core-briefing-status">6 NODES ONLINE</span>
          </div>
          <div className="mobile-core-briefing-body">
            <div className="mobile-core-briefing-name">
              {profile?.name || 'DARYL LUNDU MALSON'}
            </div>
            <div className="mobile-core-briefing-role">
              {profile?.role || 'FULL-STACK DEVELOPER & SOFTWARE ENGINEER'}
            </div>
            <div className="mobile-core-briefing-hint">
              ◆ TAP ANY ORBITAL SHURIKEN NODE TO SCAN DOSSIER
            </div>
          </div>
        </div>
      )}

      {/* Mobile Framed Tactical HUD Dock (Visible in Top Mode on Mobile) */}
      {isMobile && mode === 'top' && (
        <div
          className="mobile-top-hud-dock"
          style={{
            top: `${mobileDockTop}px`,
            width: `${mobileDockWidth}px`,
            left: `${mobileDockLeft}px`
          }}
        >
          <div className="mobile-hud-core-row">
            <div className="mobile-hud-active-readout">
              <span className="mobile-hud-pip" />
              <span className="mobile-hud-active-code">
                {activeMod ? `[${activeMod.code}]` : '[--]'}
              </span>
              <span className="mobile-hud-active-title">
                {activeMod ? activeMod.title : 'SELECT MODULE'}
              </span>
            </div>

            <div className="mobile-hud-dice-bay" aria-hidden="true" />

            <button
              type="button"
              className="mobile-hud-return-btn"
              onClick={onResetToCore}
            >
              <span>◄ CORE ORBIT</span>
            </button>
          </div>

          <div className="mobile-hud-tabs-row">
            {modules.map((mod) => {
              const isActive = activeModuleId === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  className={`mobile-hud-tab-slot ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectModule(mod.id)}
                  aria-label={mod.title}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Circular Close (X) Node above highest star in Split Mode (Desktop Spine) */}
      <div
        className={`split-close-node ${isSplitMode && !isMobile ? 'is-visible' : ''}`}
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
          left: -circleRadius + (isMobile ? mobileDockCenterX : 0),
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
          left: -innerRingRadius + (isMobile ? mobileDockCenterX : 0),
          opacity: mode === 'circle' ? 0.55 : 0,
          transform: mode === 'circle' ? 'scale(1)' : 'scale(0.4)'
        }}
      />

      {/* Center Dice (Anchor & Core Reset Button) */}
      {(() => {
        const diceSize = isMobile && mode === 'top' ? 30 : isMobile ? 48 : 56;
        return (
          <div
            className="dice-node"
            style={{
              transform: diceTransform,
              width: `${diceSize}px`,
              height: `${diceSize}px`,
              top: `${-diceSize / 2}px`,
              left: `${-diceSize / 2}px`
            }}
            onMouseEnter={() => {
              if (!isTouchDevice()) {
                setIsHoveringDice(true);
                sound.playHover();
              }
            }}
            onMouseLeave={() => setIsHoveringDice(false)}
          >
            <DiceIcon
              size={diceSize}
              isHovered={isHoveringDice}
              onClick={onResetToCore}
              isTopMode={mode === 'top'}
            />

            {mode === 'top' && isHoveringDice && !isMobile && (
              <div className="dice-reset-tooltip">
                [ CLICK TO DE-ACTIVATE // RETURN TO CORE ]
              </div>
            )}
          </div>
        );
      })()}

      {/* 6 Orbiting / Top-Bar / Vertical-Spine Shurikens */}
      {modules.map((mod, index) => {
        const isHovered = hoveredModuleId === mod.id;
        const isDimmed =
          (mode === 'circle' || isSplitMode) && hoveredModuleId !== null && !isHovered;
        const isActive = activeModuleId === mod.id;
        const isRightSide = index <= 2;
        const mobileShortLabel = getMobileShortLabel(mod);
        const starSize = isMobile ? (mode === 'top' ? 20 : 26) : 28;

        return (
          <div
            key={mod.id}
            className={`shuriken-node ${isHovered ? 'is-hovered' : ''} ${
              isDimmed ? 'is-dimmed' : ''
            }`}
            style={{
              transform: getShurikenTransform(index, modules.length),
              width: `${starSize}px`,
              height: `${starSize}px`,
              top: `${-starSize / 2}px`,
              left: `${-starSize / 2}px`
            }}
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
              size={starSize}
            />

            {/* Mobile Circle Mode Label Badge (Positioned radially so it never overlaps) */}
            {mode === 'circle' && isMobile && (
              <div className={`shuriken-orbit-mobile-label orbit-pos-${index}`}>
                <span className="shuriken-orbit-mobile-code">{mod.code}</span>
                <span className="shuriken-orbit-mobile-title">{mobileShortLabel}</span>
              </div>
            )}

            {/* Top Navigation Bar Module Label (Hidden when stars line vertically in Desktop Split Mode) */}
            {mode === 'top' && (!isSplitMode || isMobile) && (
              <div className={`shuriken-top-label ${isActive ? 'is-active' : ''}`}>
                {!isMobile && (
                  <span className="shuriken-top-label-icon">
                    {getModuleIcon(mod.id, { size: 12 })}
                  </span>
                )}
                <span className="shuriken-top-label-text">
                  {isMobile ? mobileShortLabel : mod.title}
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
