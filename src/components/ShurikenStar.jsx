import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

const STAR_POINTS = '14,1 17.5,10.5 27,14 17.5,17.5 14,27 10.5,17.5 1,14 10.5,10.5';

/**
 * 4-Point Precision Shuriken Star with 1:1 28x28 coordinate grid,
 * top-layer non-scaling stroke (so shadow facets never overlap the outline),
 * and uniform orientation.
 */
export function ShurikenStar({ isHovered = false, isActive = false, size = 28 }) {
  const shurikenRef = useRef(null);
  const reticleRef = useRef(null);

  useEffect(() => {
    if (!shurikenRef.current) return;

    if (isHovered) {
      // Snap-rotate cleanly to exact 90deg (never relative +=90deg which drifts on interrupted hovers)
      animate(shurikenRef.current, {
        rotate: 90,
        scale: 1.25,
        duration: 360,
        ease: 'outCubic'
      });

      if (reticleRef.current) {
        animate(reticleRef.current, {
          scale: [0.75, 1.9],
          opacity: [0.9, 0],
          rotate: [0, 45],
          duration: 460,
          ease: 'outQuad'
        });
      }
    } else {
      // Always settle back to exact 0deg upright orientation
      animate(shurikenRef.current, {
        rotate: 0,
        scale: isActive ? 1.15 : 1,
        duration: 300,
        ease: 'outQuad'
      });
    }
  }, [isHovered, isActive]);

  const isHighlighted = isActive || isHovered;
  const primaryFill = isHighlighted ? 'var(--text-main)' : 'var(--bg-surface-light)';

  const shadowFacetFill = isActive
    ? 'rgba(0, 0, 0, 0.25)'
    : isHovered
    ? 'rgba(0, 0, 0, 0.2)'
    : 'rgba(58, 54, 46, 0.09)';

  return (
    <div className="shuriken-star-wrap" style={{ width: size, height: size }}>
      {/* Expanding Targeting Diamond Reticle on Hover */}
      <div
        ref={reticleRef}
        className="shuriken-reticle-svg"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 28 28" width={size} height={size}>
          <polygon
            points="14,1.5 26.5,14 14,26.5 1.5,14"
            fill="none"
            stroke="var(--text-main)"
            strokeWidth="1.2"
            strokeDasharray="2, 2"
            vectorEffect="non-scaling-stroke"
          />
          <line x1="14" y1="0" x2="14" y2="3" stroke="var(--text-main)" strokeWidth="1.4" />
          <line x1="14" y1="25" x2="14" y2="28" stroke="var(--text-main)" strokeWidth="1.4" />
          <line x1="0" y1="14" x2="3" y2="14" stroke="var(--text-main)" strokeWidth="1.4" />
          <line x1="25" y1="14" x2="28" y2="14" stroke="var(--text-main)" strokeWidth="1.4" />
        </svg>
      </div>

      {/* Main Uniform 4-Point Shuriken Star (Exact 1:1 28x28 symmetry around 14,14) */}
      <div
        ref={shurikenRef}
        className={`shuriken-blade-svg ${isHighlighted ? 'is-highlighted' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 28 28"
          width={size}
          height={size}
          shapeRendering="geometricPrecision"
        >
          {/* 1. Base Fill Layer (No stroke here so shadow facets don't overlap half the border) */}
          <polygon points={STAR_POINTS} fill={primaryFill} />

          {/* 2. Symmetric Faceted Shadow Blades */}
          <polygon points="14,1 17.5,10.5 14,14" fill={shadowFacetFill} />
          <polygon points="27,14 17.5,17.5 14,14" fill={shadowFacetFill} />
          <polygon points="14,27 10.5,17.5 14,14" fill={shadowFacetFill} />
          <polygon points="1,14 10.5,10.5 14,14" fill={shadowFacetFill} />

          {/* 3. Crisp Uniform Outer Border Drawn ON TOP of Fill & Shadows */}
          <polygon
            points={STAR_POINTS}
            fill="none"
            stroke="var(--text-main)"
            strokeWidth="1.5"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            vectorEffect="non-scaling-stroke"
          />

          {/* 4. Inner Diamond Core Bevel */}
          <polygon
            points="14,9.5 18.5,14 14,18.5 9.5,14"
            fill={isHighlighted ? 'var(--bg-primary)' : 'var(--bg-surface)'}
            stroke="var(--text-main)"
            strokeWidth="1.2"
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
          />

          {/* 5. Center Pivot Core Pip */}
          <circle
            cx="14"
            cy="14"
            r="1.8"
            fill={isHighlighted ? 'var(--text-main)' : 'var(--accent-gold)'}
          />
        </svg>
      </div>
    </div>
  );
}
