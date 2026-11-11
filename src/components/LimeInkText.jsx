import React, { useMemo } from 'react';

function getThermalClass(state) {
  if (state === 'drying') return 'thermal-dissolve';
  if (state === 'revealing') return 'thermal-blooming';
  return 'thermal-hidden';
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * LimeInkText — Simulates invisible lime juice on parchment exposed to flame.
 * Breaks sentences into individual word particles, each scorching into visibility
 * at unpredictable, randomized timings across the surface.
 *
 * Visual progression:
 * 1. Invisible on damp parchment
 * 2. Flame touches: Citric acid scorches with fiery amber/citrus halo bloom
 * 3. Caramelizes to rich toasted sienna
 * 4. Cools and settles into crisp dark carbon ink (#3a362e)
 *
 * When drying/vanished:
 * Dissolves back into paper with a delicate heat shimmer.
 */
export function LimeInkText({
  children,
  as: Tag = 'span',
  state = 'revealing', // 'hidden' | 'revealing' | 'drying'
  delayMin = 150,
  delayMax = 1100,
  style = {},
  className = ''
}) {
  // If children is plain text, split into short chunks (or animate as a single block for long paragraphs)
  const isString = typeof children === 'string';
  const isLongText = isString && children.length > 64;

  const words = useMemo(() => {
    if (!isString || isLongText) return null;
    return children.split(/(\s+)/); // Preserves whitespace for short headings/titles
  }, [children, isString, isLongText]);

  // Pre-generate stable random delays for each word
  const delays = useMemo(() => {
    if (!words) return [];
    return words.map((chunk) => (/^\s+$/.test(chunk) ? 0 : randomBetween(delayMin, delayMax)));
  }, [words, delayMin, delayMax]);

  if (!isString || isLongText) {
    return (
      <LimeInkBlock
        as={Tag}
        state={state}
        delayMin={delayMin}
        delayMax={Math.min(delayMax, 650)}
        style={style}
        className={className}
      >
        {children}
      </LimeInkBlock>
    );
  }

  const animClass = getThermalClass(state);

  return (
    <Tag className={`lime-ink-text-wrapper ${className}`} style={{ ...style, display: 'inline' }}>
      {words.map((word, idx) => {
        // Render whitespace verbatim without animation wrappers
        if (/^\s+$/.test(word)) {
          return <span key={idx}>{word}</span>;
        }

        const delay = delays[idx];

        return (
          <span
            key={idx}
            className={`lime-ink-word ${animClass}`}
            style={{
              display: 'inline-block',
              animationDelay: state === 'drying' ? `${(idx % 6) * 40}ms` : `${delay}ms`
            }}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * LimeInkBlock — Convenience wrapper for non-text blocks (cards, chips, metric items)
 */
export function LimeInkBlock({
  children,
  as: Tag = 'div',
  state = 'revealing',
  delayMin = 200,
  delayMax = 900,
  style = {},
  className = ''
}) {
  const { revealDelay, dryDelay } = useMemo(
    () => ({
      revealDelay: randomBetween(delayMin, delayMax),
      dryDelay: randomBetween(0, 200)
    }),
    [delayMin, delayMax]
  );

  const animClass = getThermalClass(state);

  return (
    <Tag
      className={`lime-ink-block ${animClass} ${className}`}
      style={{
        ...style,
        animationDelay: state === 'drying' ? `${dryDelay}ms` : `${revealDelay}ms`
      }}
    >
      {children}
    </Tag>
  );
}
