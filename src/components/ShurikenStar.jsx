import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * 4-Point Precision Shuriken Star with strict 4-fold symmetry and uniform orientation.
 * Always settles to an exact axis-aligned 0deg / 90deg state so blades are never crooked.
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
    : 'rgba(58, 54, 46, 0.08)';

  return (
    <div className="shuriken-star-wrap" style={{ width: size, height: size }}>
      {/* Expanding Targeting Diamond Reticle on Hover */}
      <svg
        ref={reticleRef}
        viewBox="0 0 36 36"
        className="shuriken-reticle-svg"
        style={{ width: size, height: size }}
      >
        <polygon
          points="18,2 34,18 18,34 2,18"
          fill="none"
          stroke="var(--text-main)"
          strokeWidth="1.2"
          strokeDasharray="2, 2"
        />
        <line x1="18" y1="0" x2="18" y2="4" stroke="var(--text-main)" strokeWidth="1.5" />
        <line x1="18" y1="32" x2="18" y2="36" stroke="var(--text-main)" strokeWidth="1.5" />
        <line x1="0" y1="18" x2="4" y2="18" stroke="var(--text-main)" strokeWidth="1.5" />
        <line x1="32" y1="18" x2="36" y2="18" stroke="var(--text-main)" strokeWidth="1.5" />
      </svg>

      {/* Main Uniform 4-Point Shuriken Star (Exact 4-fold symmetry around 18,18) */}
      <svg
        ref={shurikenRef}
        viewBox="0 0 36 36"
        className={`shuriken-blade-svg ${isHighlighted ? 'is-highlighted' : ''}`}
        style={{ width: size, height: size }}
      >
        {/* Symmetric 4-Point Shuriken Blades (18±16.5 tips, 18±4.5 inner valleys) */}
        <polygon
          points="18,1.5 22.5,13.5 34.5,18 22.5,22.5 18,34.5 13.5,22.5 1.5,18 13.5,13.5"
          fill={primaryFill}
          stroke="var(--text-main)"
          strokeWidth="1.6"
          strokeLinejoin="miter"
        />

        {/* Symmetric Faceted Shadow Blades */}
        <polygon points="18,1.5 22.5,13.5 18,18" fill={shadowFacetFill} />
        <polygon points="34.5,18 22.5,22.5 18,18" fill={shadowFacetFill} />
        <polygon points="18,34.5 13.5,22.5 18,18" fill={shadowFacetFill} />
        <polygon points="1.5,18 13.5,13.5 18,18" fill={shadowFacetFill} />

        {/* Inner Diamond Core Bevel */}
        <polygon
          points="18,12 24,18 18,24 12,18"
          fill={isActive || isHovered ? 'var(--bg-primary)' : 'var(--bg-surface)'}
          stroke="var(--text-main)"
          strokeWidth="1.2"
        />

        {/* Center Pivot Core Pip */}
        <circle
          cx="18"
          cy="18"
          r="2.2"
          fill={isActive || isHovered ? 'var(--text-main)' : 'var(--accent-gold)'}
        />
      </svg>
    </div>
  );
}
