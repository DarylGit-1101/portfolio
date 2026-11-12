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
 * Splits a string into word tokens (or 2-word phrases for long paragraphs to keep DOM light)
 * while preserving whitespace and newline characters.
 */
function tokenizeForInk(text) {
  const rawTokens = text.split(/(\s+)/);
  if (text.length <= 160) {
    return rawTokens;
  }

  // Group into 2-word phrases for longer paragraphs so the staggered word-reveal effect
  // works consistently on long descriptions without excessive DOM spans.
  const grouped = [];
  let buffer = '';
  let wordCount = 0;

  for (const token of rawTokens) {
    if (token.includes('\n')) {
      if (buffer) {
        grouped.push(buffer);
        buffer = '';
        wordCount = 0;
      }
      grouped.push(token);
    } else if (/^\s+$/.test(token)) {
      if (wordCount > 0 && wordCount < 2) {
        buffer += token;
      } else {
        if (buffer) {
          grouped.push(buffer);
          buffer = '';
          wordCount = 0;
        }
        grouped.push(token);
      }
    } else {
      buffer += token;
      wordCount += 1;
      if (wordCount >= 2) {
        grouped.push(buffer);
        buffer = '';
        wordCount = 0;
      }
    }
  }

  if (buffer) {
    grouped.push(buffer);
  }
  return grouped;
}

/**
 * LimeInkText — Simulates invisible lime juice on parchment exposed to flame.
 * Breaks sentences into word/phrase particles, each scorching into visibility
 * at randomized timings across the surface, and dissolving when drying.
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
  const isString = typeof children === 'string';

  const tokens = useMemo(() => {
    if (!isString) return null;
    return tokenizeForInk(children);
  }, [children, isString]);

  // Pre-generate stable random delays for each token
  const delays = useMemo(() => {
    if (!tokens) return [];
    return tokens.map((chunk) => (/^\s+$/.test(chunk) ? 0 : randomBetween(delayMin, delayMax)));
  }, [tokens, delayMin, delayMax]);

  if (!isString) {
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
      {tokens.map((token, idx) => {
        if (/^\s+$/.test(token)) {
          return <span key={idx}>{token}</span>;
        }

        const delay = delays[idx];

        return (
          <span
            key={idx}
            className={`lime-ink-word ${animClass}`}
            style={{
              display: 'inline-block',
              animationDelay: state === 'drying' ? `${(idx % 6) * 35}ms` : `${delay}ms`
            }}
          >
            {token}
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
      dryDelay: randomBetween(0, 180)
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
