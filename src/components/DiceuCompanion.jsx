import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio.js';
import { subscribeToPortfolioData } from '../data/portfolioStorage.js';

const IDLE_QUOTES = [
  'UNIT DICEU // PATROLLING ARCHIVE',
  'ALL CIRCUITS NOMINAL ~ u ~',
  'CLICK A SHURIKEN TO SCAN DOSSIER!',
  'POD 042 TELEMETRY LINKED',
  'ROLLING FOR INITIATIVE... [20]!',
  'SABAH SECTOR // 60.0 FPS STABLE',
  'BEEP BOOP // DICE CORE ONLINE'
];

const CLICK_QUOTES = [
  'YAAAY! // +100 MORALE',
  'CRITICAL ROLL! [6 // 1]',
  'SYSTEM OVERCLOCKED! ~ ^ u ^ ~',
  'READY FOR DEPLOYMENT, OPERATOR!',
  'TACTICAL HOP ENGAGED!'
];

/**
 * Pure-code SVG Limb matching `public/diceu/limb.png`:
 * Capsule-shaped black stick with a thick warm-grey outer border.
 */
const DiceuLimb = React.forwardRef(function DiceuLimb({ x, y, scaleY = 1 }, ref) {
  return (
    <g ref={ref} transform={`translate(${x}, ${y}) rotate(0) scale(1, ${scaleY})`}>
      {/* Outer warm-grey capsule outline */}
      <rect
        x="-7.5"
        y="-4"
        width="15"
        height="48"
        rx="7.5"
        ry="7.5"
        fill="#a39d92"
      />
      {/* Inner ink-black limb core */}
      <rect
        x="-5.2"
        y="-1.8"
        width="10.4"
        height="43.6"
        rx="5.2"
        ry="5.2"
        fill="#070707"
      />
    </g>
  );
});

/**
 * Pure-code SVG Cube Head matching `public/diceu/head_left.png` and `head_right.png`:
 * - Facing Left: Front face on left, 5 black pips on right side face
 * - Facing Right: 1 large sienna-brown pip on left side face, Front face on right
 */
const DiceuHeadSvg = React.memo(function DiceuHeadSvg({
  facing = 'left',
  expression = 'neutral', // 'neutral' | 'happy' | 'scan' | 'surprised' | 'blink'
  pupilsRef
}) {
  const isLeft = facing === 'left';

  // Eye centers on the 200x170 canvas depending on whether facing left or right
  const leftEye = isLeft ? { cx: 42, cy: 86, rx: 15.5, ry: 18.5 } : { cx: 112, cy: 86, rx: 16.5, ry: 19 };
  const rightEye = isLeft ? { cx: 92, cy: 88, rx: 16.5, ry: 19 } : { cx: 161, cy: 84, rx: 15.5, ry: 18.5 };
  const mouthCenter = isLeft ? { x: 64, y: 105 } : { x: 138, y: 105 };

  const renderEyeBase = (eye, isSecondEye) => {
    if (expression === 'blink') {
      return (
        <path
          key={isSecondEye ? 'r' : 'l'}
          d={`M ${eye.cx - 13} ${eye.cy + 2} Q ${eye.cx} ${eye.cy + 9} ${eye.cx + 13} ${eye.cy + 2}`}
          fill="none"
          stroke="#080808"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    }

    if (expression === 'happy') {
      return (
        <path
          key={isSecondEye ? 'r' : 'l'}
          d={`M ${eye.cx - 13} ${eye.cy + 4} Q ${eye.cx} ${eye.cy - 14} ${eye.cx + 13} ${eye.cy + 4}`}
          fill="none"
          stroke="#080808"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      );
    }

    return (
      <g key={isSecondEye ? 'r' : 'l'}>
        {/* Soft under-eye ambient shadow */}
        <ellipse
          cx={eye.cx}
          cy={eye.cy + 6}
          rx={eye.rx + 1.5}
          ry={eye.ry - 1}
          fill="rgba(0, 0, 0, 0.14)"
        />

        {/* Sketchy upper lash / crease lines */}
        <path
          d={`M ${eye.cx - eye.rx + 2} ${eye.cy - 6} A ${eye.rx + 2} ${eye.ry + 2} 0 0 1 ${
            eye.cx + eye.rx - 1
          } ${eye.cy - 4}`}
          fill="none"
          stroke="#080808"
          strokeWidth="1.6"
          strokeDasharray="6 3"
        />
      </g>
    );
  };

  const renderMovablePupil = (eye, isSecondEye) => {
    if (expression === 'blink' || expression === 'happy') return null;

    const glintX = isLeft ? eye.cx + 8 : eye.cx - 8;
    const glintY = eye.cy - 4;

    return (
      <g key={isSecondEye ? 'pr' : 'pl'}>
        {/* Main glossy black eye oval */}
        <ellipse
          cx={eye.cx}
          cy={eye.cy}
          rx={expression === 'surprised' ? eye.rx * 1.08 : eye.rx}
          ry={expression === 'surprised' ? eye.ry * 1.08 : eye.ry}
          fill="#060606"
        />

        {/* Tactical Amber Reticle Ring when scanning */}
        {expression === 'scan' && (
          <ellipse
            cx={eye.cx}
            cy={eye.cy}
            rx={eye.rx - 4}
            ry={eye.ry - 5}
            fill="none"
            stroke="#f39c12"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />
        )}

        {/* Signature crescent white specular glint from original PNG */}
        <ellipse
          cx={glintX}
          cy={glintY}
          rx="2.3"
          ry="5.2"
          transform={`rotate(${isLeft ? -14 : 14} ${glintX} ${glintY})`}
          fill="#ffffff"
        />
        <circle
          cx={glintX + (isLeft ? 0.5 : -0.5)}
          cy={glintY + 7.5}
          r="1.3"
          fill="#ffffff"
        />
      </g>
    );
  };

  // Eyebrow tilt for expressions
  const browYOffset = expression === 'surprised' || expression === 'happy' ? -5 : expression === 'scan' ? 2 : 0;
  const browTilt = expression === 'scan' ? 8 : 0;

  return (
    <svg viewBox="0 0 200 170" className="diceu-head-svg">
      <defs>
        <radialGradient id="diceuCubeShade" cx="48%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#f7f4ec" />
          <stop offset="75%" stopColor="#ebe5d8" />
          <stop offset="100%" stopColor="#d8d0c0" />
        </radialGradient>
      </defs>

      {/* ======================================================= */}
      {/* CUBE SHELL GEOMETRY (Mirrors cleanly for Left vs Right) */}
      {/* ======================================================= */}
      <g transform={isLeft ? undefined : 'translate(200, 0) scale(-1, 1)'}>
        {/* Outer Warm Halo Stroke */}
        <path
          d="M 22 16 Q 70 10 116 12 Q 152 20 184 35 Q 192 42 190 88 Q 189 132 182 142 Q 150 153 112 158 Q 60 157 18 144 Q 9 138 10 82 Q 11 22 22 16 Z"
          fill="none"
          stroke="#a39d92"
          strokeWidth="9"
          strokeLinejoin="round"
        />

        {/* Main 2.5D Cube Body with Bold Ink Outline */}
        <path
          d="M 22 16 Q 70 10 116 12 Q 152 20 184 35 Q 192 42 190 88 Q 189 132 182 142 Q 150 153 112 158 Q 60 157 18 144 Q 9 138 10 82 Q 11 22 22 16 Z"
          fill="url(#diceuCubeShade)"
          stroke="#070707"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Subtle side-face depth shading so 3D perspective pops */}
        <path
          d="M 116 15 Q 152 22 183 36 Q 190 43 188 88 Q 187 131 180 140 Q 149 151 113 155 Z"
          fill="rgba(58, 54, 46, 0.07)"
        />

        {/* Hand-drawn sketchy inner rim highlight along top & bottom */}
        <path
          d="M 32 15 Q 75 12 112 14 M 26 144 Q 68 154 108 155"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeDasharray="10 6"
          opacity="0.75"
        />

        {/* Vertical Perspective Edge Crease Separating Front & Side Faces */}
        <path
          d="M 118 24 Q 116 86 113 148"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 119.5 38 Q 118 88 115 136"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="1"
          opacity="0.55"
        />
      </g>

      {/* ======================================================= */}
      {/* SIDE FACE PIPS (5 Black Pips Left, 1 Brown Pip Right)   */}
      {/* ======================================================= */}
      {isLeft ? (
        <g fill="#060606">
          {/* 5-pip pattern on the right-hand side face */}
          <ellipse cx="139" cy="59" rx="9.5" ry="13.5" />
          <ellipse cx="174" cy="65" rx="8.8" ry="13" />
          <ellipse cx="157" cy="94" rx="9.5" ry="13.8" />
          <ellipse cx="139" cy="126" rx="9.5" ry="13.5" />
          <ellipse cx="173" cy="122" rx="8.8" ry="13" />
        </g>
      ) : (
        <g>
          {/* 1 large sienna-brown center pip on the left-hand side face */}
          <ellipse
            cx="43"
            cy="92"
            rx="12.5"
            ry="22.5"
            fill="#562c1e"
            stroke="#3b1d13"
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* ======================================================= */}
      {/* FRONT FACE FEATURES (EYEBROWS, EYES, 'u' MOUTH)         */}
      {/* ======================================================= */}
      {/* Eyebrows */}
      <line
        x1={leftEye.cx - 5}
        y1={leftEye.cy - 28 + browYOffset - browTilt}
        x2={leftEye.cx + 4}
        y2={leftEye.cy - 28 + browYOffset + browTilt}
        stroke="#080808"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1={rightEye.cx - 4}
        y1={rightEye.cy - 28 + browYOffset + browTilt}
        x2={rightEye.cx + 5}
        y2={rightEye.cy - 28 + browYOffset - browTilt}
        stroke="#080808"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Eyes (Base Socket + Ref-Translated Pupils for Zero React Re-renders) */}
      {renderEyeBase(leftEye, false)}
      {renderEyeBase(rightEye, true)}
      <g ref={pupilsRef}>
        {renderMovablePupil(leftEye, false)}
        {renderMovablePupil(rightEye, true)}
      </g>

      {/* Cute 'u' Smile / Dynamic Mouth */}
      {expression === 'surprised' ? (
        <ellipse
          cx={mouthCenter.x}
          cy={mouthCenter.y + 3}
          rx="3.8"
          ry="4.8"
          fill="none"
          stroke="#080808"
          strokeWidth="2.4"
        />
      ) : expression === 'happy' ? (
        <path
          d={`M ${mouthCenter.x - 6} ${mouthCenter.y - 1} C ${mouthCenter.x - 5} ${
            mouthCenter.y + 11
          }, ${mouthCenter.x + 5} ${mouthCenter.y + 11}, ${mouthCenter.x + 6} ${
            mouthCenter.y - 1
          }`}
          fill="none"
          stroke="#080808"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M ${mouthCenter.x - 3.5} ${mouthCenter.y} C ${mouthCenter.x - 3} ${
            mouthCenter.y + 9
          }, ${mouthCenter.x + 3} ${mouthCenter.y + 9}, ${mouthCenter.x + 3.8} ${
            mouthCenter.y - 1
          }`}
          fill="none"
          stroke="#080808"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
});

/**
 * Interactive, code-rendered Diceu character companion.
 * Roams the HUD floor, tracks the cursor with his eyes, jumps/spins on click,
 * can be dragged & dropped with gravity physics, and reacts to portfolio events.
 */
export function DiceuCompanion({ mode, activeModule, laserState }) {
  const containerRef = useRef(null);
  const rigRef = useRef(null);
  const shadowRef = useRef(null);
  const bubbleRef = useRef(null);
  const bubbleHalfWidthRef = useRef(90);
  const pupilsRef = useRef(null);
  const leftArmRef = useRef(null);
  const leftLegRef = useRef(null);
  const rightLegRef = useRef(null);
  const rightArmRef = useRef(null);

  // Render state for visual expression & speech bubble (only updates on discrete events, never 60fps)
  const [facing, setFacing] = useState('right');
  const facingRef = useRef('right');
  const [expression, setExpression] = useState('neutral');
  const [speech, setSpeech] = useState('UNIT DICEU // ONLINE');
  const isHoveredRef = useRef(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSaluting, setIsSaluting] = useState(false);

  // Measure speech bubble width once when speech text changes (avoids forced layout in RAF)
  useEffect(() => {
    if (speech && bubbleRef.current) {
      bubbleHalfWidthRef.current = bubbleRef.current.offsetWidth / 2 + 10;
    }
  }, [speech]);

  const updateFacing = useCallback((dir) => {
    if (facingRef.current !== dir) {
      facingRef.current = dir;
      setFacing(dir);
    }
  }, []);

  // Mutable physics & AI state in a ref for smooth 60fps requestAnimationFrame loop
  const physRef = useRef({
    x: typeof window !== 'undefined' ? Math.max(40, window.innerWidth * 0.18) : 180,
    y: 0, // vertical height above floor (0 = standing on floor)
    vx: 1.15,
    vy: 0,
    targetX: 320,
    state: 'walk', // 'walk' | 'idle' | 'jump' | 'salute' | 'drag'
    stateTimer: 180,
    walkPhase: 0,
    clickCombo: 0,
    lastClickTime: 0,
    mouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 640,
    mouseY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    pointerDown: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    movedDuringDrag: false
  });

  const speechTimerRef = useRef(null);

  const showSpeech = useCallback((text, duration = 3200) => {
    setSpeech(text);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeech(null);
    }, duration);
  }, []);

  // Initial greeting timeout cleanup
  useEffect(() => {
    const initTimer = setTimeout(() => setSpeech(null), 4000);
    return () => {
      clearTimeout(initTimer);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, []);

  // Periodic natural eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setExpression((prev) => {
        if (prev !== 'neutral') return prev;
        setTimeout(() => {
          setExpression((curr) => (curr === 'blink' ? 'neutral' : curr));
        }, 150);
        return 'blink';
      });
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // React to Portfolio Module Selection & Laser Scan Events
  useEffect(() => {
    const p = physRef.current;
    if (laserState === 'scanning' && activeModule) {
      p.state = 'salute';
      p.stateTimer = 95;
      p.vy = 6.5; // Little alert hop
      setIsSaluting(true);
      setExpression('scan');
      const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
      updateFacing(p.x < centerX ? 'right' : 'left');
      showSpeech(`SCANNING [${activeModule.code}] // ${activeModule.title}`, 3400);

      const timer = setTimeout(() => {
        setIsSaluting(false);
        setExpression('neutral');
      }, 1600);
      return () => clearTimeout(timer);
    }

    if (mode === 'circle' && laserState === 'idle') {
      setExpression('happy');
      const timer = setTimeout(() => setExpression('neutral'), 900);
      return () => clearTimeout(timer);
    }
  }, [mode, activeModule, laserState, showSpeech, updateFacing]);

  // React to Portfolio Data Save Events
  useEffect(() => {
    return subscribeToPortfolioData(() => {
      const p = physRef.current;
      p.vy = 11;
      p.state = 'jump';
      setExpression('happy');
      sound.playDiceuChirp();
      showSpeech('ARCHIVE SYNCHRONIZED! // GOOD JOB!', 3500);
      setTimeout(() => setExpression('neutral'), 1800);
    });
  }, [showSpeech]);

  // Track pointer / touch position for eye tracking & drag support
  useEffect(() => {
    const updatePointer = (clientX, clientY) => {
      const p = physRef.current;
      p.mouseX = clientX;
      p.mouseY = clientY;

      if (p.pointerDown) {
        const dx = clientX - p.dragStartX;
        const dy = clientY - p.dragStartY;
        if (!p.isDragging && Math.hypot(dx, dy) > 8) {
          p.isDragging = true;
          p.movedDuringDrag = true;
          setExpression('surprised');
        }
      }

      if (p.isDragging) {
        const maxW = window.innerWidth - 76;
        p.x = Math.max(12, Math.min(maxW, clientX - 38));
        const floorY = window.innerHeight - 36 - 84;
        p.y = Math.max(0, floorY - (clientY - 40));
        p.vy = 0;
      }

      // Compute pupil offset toward cursor/touch directly via SVG ref (Zero React re-renders!)
      if (pupilsRef.current) {
        const floorScreenY = window.innerHeight - 36 - 60 - p.y;
        const charCenterX = p.x + 42;
        const angle = Math.atan2(clientY - floorScreenY, clientX - charCenterX);
        const dist = Math.min(1, Math.hypot(clientX - charCenterX, clientY - floorScreenY) / 180);
        const px = (Math.cos(angle) * 3.2 * dist).toFixed(1);
        const py = (Math.sin(angle) * 2.2 * dist).toFixed(1);
        pupilsRef.current.setAttribute('transform', `translate(${px}, ${py})`);
      }
    };

    const handleMouseMove = (e) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    };

    const endDrag = () => {
      const p = physRef.current;
      p.pointerDown = false;
      if (p.isDragging) {
        p.isDragging = false;
        p.state = p.y > 5 ? 'jump' : 'idle';
        p.stateTimer = 60;
        setExpression('neutral');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', endDrag);
      window.removeEventListener('touchcancel', endDrag);
    };
  }, []);

  // Main 60fps kinematics & autonomous wandering loop (Direct DOM transforms, zero React re-renders!)
  useEffect(() => {
    let rafId;

    const tick = () => {
      const p = physRef.current;
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const isMobile = vw <= 768;
      const minX = isMobile ? 16 : 48;
      const maxX = Math.max(minX + 40, vw - (isMobile ? 84 : 130));
      if (p.x > maxX) p.x = maxX;

      if (!p.isDragging) {
        // Gravity & vertical jump physics
        if (p.y > 0 || p.vy !== 0) {
          p.y += p.vy;
          p.vy -= 0.58; // Gravity
          if (p.y <= 0) {
            p.y = 0;
            if (p.vy < -4) {
              // Subtle landing bounce
              p.vy = -p.vy * 0.25;
            } else {
              p.vy = 0;
              if (p.state === 'jump') {
                p.state = 'idle';
                p.stateTimer = 70;
              }
            }
          }
        }

        // State machine on the ground
        p.stateTimer -= 1;

        if (p.state === 'walk' && p.y === 0) {
          const dir = p.targetX > p.x ? 1 : -1;
          p.x += dir * (isMobile ? 1.05 : 1.35);
          p.walkPhase += 0.21;
          updateFacing(dir > 0 ? 'right' : 'left');

          if (Math.abs(p.targetX - p.x) < 12 || p.stateTimer <= 0) {
            p.state = 'idle';
            p.stateTimer = Math.floor(90 + Math.random() * 140);
          }
        } else if (p.state === 'idle' && p.y === 0) {
          p.walkPhase += 0.05;
          // Face the mouse cursor if it's nearby
          const charCenterX = p.x + 42;
          if (!isMobile && Math.abs(p.mouseX - charCenterX) < 260) {
            updateFacing(p.mouseX >= charCenterX ? 'right' : 'left');
          }

          if (p.stateTimer <= 0) {
            if (Math.random() < 0.22) {
              const randomQuote = IDLE_QUOTES[Math.floor(Math.random() * IDLE_QUOTES.length)];
              showSpeech(randomQuote, 2800);
            }
            p.targetX = Math.floor(minX + Math.random() * (maxX - minX));
            p.state = 'walk';
            p.stateTimer = 260;
          }
        } else if (p.state === 'salute' && p.y === 0) {
          if (p.stateTimer <= 0) {
            p.state = 'idle';
            p.stateTimer = 90;
          }
        }
      }

      // Compute limb swing angles directly for DOM refs
      let leftLeg = 0;
      let rightLeg = 0;
      let leftArm = -12;
      let rightArm = 12;
      let bobY = 0;
      let tilt = 0;

      if (p.isDragging || p.y > 4) {
        const kick = Math.sin(Date.now() * 0.02) * 18;
        leftLeg = -22 + kick;
        rightLeg = 22 - kick;
        leftArm = -135 + kick * 0.5;
        rightArm = 135 - kick * 0.5;
        tilt = p.vx * 2;
      } else if (p.state === 'salute') {
        leftArm = -15;
        rightArm = -145;
        bobY = -2;
      } else if (p.state === 'walk') {
        const swing = Math.sin(p.walkPhase) * 32;
        bobY = Math.abs(Math.sin(p.walkPhase)) * -5.5;
        tilt = Math.cos(p.walkPhase) * 2.5;
        leftLeg = swing;
        rightLeg = -swing;
        leftArm = -swing * 0.85 - 10;
        rightArm = swing * 0.85 + 10;
      } else {
        bobY = Math.sin(p.walkPhase) * 1.8;
        leftArm = isHoveredRef.current ? -115 + Math.sin(Date.now() * 0.015) * 22 : -12;
        tilt = isHoveredRef.current ? (facingRef.current === 'right' ? -3 : 3) : 0;
      }

      const isLeft = facingRef.current === 'left';
      if (leftArmRef.current) {
        leftArmRef.current.setAttribute(
          'transform',
          `translate(${isLeft ? 42 : 158}, 108) rotate(${leftArm.toFixed(1)}) scale(1, 0.82)`
        );
      }
      if (leftLegRef.current) {
        leftLegRef.current.setAttribute(
          'transform',
          `translate(${isLeft ? 76 : 124}, 144) rotate(${leftLeg.toFixed(1)}) scale(1, 0.95)`
        );
      }
      if (rightLegRef.current) {
        rightLegRef.current.setAttribute(
          'transform',
          `translate(${isLeft ? 116 : 84}, 146) rotate(${rightLeg.toFixed(1)}) scale(1, 1)`
        );
      }
      if (rightArmRef.current) {
        rightArmRef.current.setAttribute(
          'transform',
          `translate(${isLeft ? 148 : 52}, 112) rotate(${rightArm.toFixed(1)}) scale(1, 0.86)`
        );
      }

      if (rigRef.current && !rigRef.current.classList.contains('is-spinning')) {
        rigRef.current.style.transform = `translateY(${bobY.toFixed(1)}px) rotate(${tilt.toFixed(
          1
        )}deg)`;
      }

      if (shadowRef.current) {
        const sScale = Math.max(0.45, 1 - p.y / 180).toFixed(2);
        const sOp = Math.max(0.12, 0.32 - p.y / 300).toFixed(2);
        shadowRef.current.style.transform = `translateX(-50%) scale(${sScale})`;
        shadowRef.current.style.opacity = sOp;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${Math.round(p.x)}px, ${Math.round(
          -p.y
        )}px, 0)`;
      }

      // Clamp speech bubble using cached width (Zero layout thrashing!)
      if (bubbleRef.current) {
        const charWidth = isMobile ? 64 : 84;
        const charCenter = p.x + charWidth / 2;
        const halfBubble = bubbleHalfWidthRef.current;
        let shiftX = 0;
        if (charCenter - halfBubble < 8) {
          shiftX = 8 - (charCenter - halfBubble);
        } else if (charCenter + halfBubble > vw - 8) {
          shiftX = vw - 8 - (charCenter + halfBubble);
        }
        bubbleRef.current.style.transform = `translate3d(calc(-50% + ${Math.round(
          shiftX
        )}px), 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [showSpeech, updateFacing]);

  const startDrag = (clientX, clientY) => {
    const p = physRef.current;
    p.pointerDown = true;
    p.isDragging = false;
    p.movedDuringDrag = false;
    p.dragStartX = clientX;
    p.dragStartY = clientY;
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches?.[0];
    if (touch) startDrag(touch.clientX, touch.clientY);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const p = physRef.current;
    p.pointerDown = false;
    if (p.movedDuringDrag) {
      p.movedDuringDrag = false;
      return;
    }

    const now = Date.now();
    if (now - p.lastClickTime < 650) {
      p.clickCombo += 1;
    } else {
      p.clickCombo = 1;
    }
    p.lastClickTime = now;

    // Jump & chirp!
    p.vy = p.clickCombo >= 3 ? 13.5 : 10.2;
    p.state = 'jump';
    setExpression('happy');

    if (p.clickCombo >= 3) {
      sound.playDiceuChirp();
      setIsSpinning(true);
      showSpeech('OVERDRIVE FLIP // COMBO x' + p.clickCombo + '!', 3000);
      setTimeout(() => setIsSpinning(false), 650);
    } else {
      sound.playDiceuJump();
      const quote = CLICK_QUOTES[Math.floor(Math.random() * CLICK_QUOTES.length)];
      showSpeech(quote, 2800);
    }

    setTimeout(() => {
      setExpression('neutral');
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className="diceu-companion-anchor"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        sound.playHover();
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      title="Diceu Companion — Tap/click to jump or drag to move!"
    >
      {/* Tactical NieR Speech Bubble */}
      {speech && (
        <div ref={bubbleRef} className="diceu-speech-bubble">
          <span className="diceu-speech-pip" />
          <span>{speech}</span>
        </div>
      )}

      {/* Ground Shadow */}
      <div ref={shadowRef} className="diceu-ground-shadow" />

      {/* Character Rig (Head + 4 Articulated Limbs) */}
      <div
        ref={rigRef}
        className={`diceu-rig ${isSpinning ? 'is-spinning' : ''} ${
          isSaluting ? 'is-saluting' : ''
        }`}
      >
        {/* Back Arm & Back Leg (Behind Cube Body) */}
        <svg viewBox="0 0 200 220" className="diceu-limbs-layer">
          <DiceuLimb
            ref={leftArmRef}
            x={facing === 'left' ? 42 : 158}
            y={108}
            scaleY={0.82}
          />
          <DiceuLimb
            ref={leftLegRef}
            x={facing === 'left' ? 76 : 124}
            y={144}
            scaleY={0.95}
          />
        </svg>

        {/* Main 2.5D Cube Head */}
        <div className="diceu-head-layer">
          <DiceuHeadSvg
            facing={facing}
            expression={expression}
            pupilsRef={pupilsRef}
          />
        </div>

        {/* Front Leg & Front Arm (In Front of Cube Body) */}
        <svg viewBox="0 0 200 220" className="diceu-limbs-layer">
          <DiceuLimb
            ref={rightLegRef}
            x={facing === 'left' ? 116 : 84}
            y={146}
            scaleY={1}
          />
          <DiceuLimb
            ref={rightArmRef}
            x={facing === 'left' ? 148 : 52}
            y={112}
            scaleY={0.86}
          />
        </svg>
      </div>
    </div>
  );
}
