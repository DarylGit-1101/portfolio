import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';

/**
 * Tactical Full-Resolution Optical Lightbox Modal.
 * Rendered via React Portal directly to `document.body` so it escapes
 * nested stacking contexts and cleanly overlays the Constellation HUD and Diceu.
 */
export function ArchiveLightboxModal({
  projectTitle,
  imageBlocks,
  activeLightboxIdx,
  onClose,
  onStep
}) {
  const activeItem =
    activeLightboxIdx >= 0 && activeLightboxIdx < imageBlocks.length
      ? imageBlocks[activeLightboxIdx]
      : null;

  useEffect(() => {
    if (!activeItem) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && imageBlocks.length > 1) {
        e.preventDefault();
        onStep(1);
      } else if (e.key === 'ArrowLeft' && imageBlocks.length > 1) {
        e.preventDefault();
        onStep(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, imageBlocks.length, onClose, onStep]);

  if (!activeItem || typeof document === 'undefined') {
    return null;
  }

  const figNumber = String(activeItem.blockIndex + 1).padStart(2, '0');

  return createPortal(
    <div
      className="archive-lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full-resolution image inspection"
    >
      <div
        className="archive-lightbox-frame"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dossier-corner tl">┌</div>
        <div className="dossier-corner tr">┐</div>
        <div className="dossier-corner bl">└</div>
        <div className="dossier-corner br">┘</div>

        <div className="archive-lightbox-header">
          <div className="archive-lightbox-meta">
            <span className="archive-detail-block-pip" />
            <span className="archive-lightbox-code">
              {`OPTICAL INSPECTION // FIG [${figNumber}]`}
            </span>
            <span className="archive-lightbox-divider">//</span>
            <span className="archive-lightbox-title">
              {activeItem.heading || activeItem.caption || projectTitle}
            </span>
          </div>

          <div className="archive-lightbox-controls">
            {imageBlocks.length > 1 && (
              <div className="archive-lightbox-stepper">
                <button
                  type="button"
                  className="archive-lightbox-step-btn"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => onStep(-1)}
                  aria-label="Previous image"
                >
                  ◄
                </button>
                <span className="archive-lightbox-step-count">
                  {`${String(activeLightboxIdx + 1).padStart(2, '0')} / ${String(
                    imageBlocks.length
                  ).padStart(2, '0')}`}
                </span>
                <button
                  type="button"
                  className="archive-lightbox-step-btn"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => onStep(1)}
                  aria-label="Next image"
                >
                  ►
                </button>
              </div>
            )}

            <button
              type="button"
              className="archive-lightbox-close-btn"
              onMouseEnter={() => sound.playHover()}
              onClick={onClose}
            >
              <CloseIcon size={12} />
              <span>CLOSE [ESC]</span>
            </button>
          </div>
        </div>

        <div className="archive-lightbox-stage">
          <img
            src={activeItem.imageUrl}
            alt={activeItem.caption || activeItem.heading || projectTitle}
            className="archive-lightbox-img"
          />
        </div>

        {(activeItem.caption || activeItem.content) && (
          <div className="archive-lightbox-footer">
            {activeItem.caption && (
              <div className="archive-lightbox-caption">
                <span className="archive-lightbox-caption-tag">
                  {`FIG [${figNumber}]`}
                </span>
                <span>{activeItem.caption}</span>
              </div>
            )}
            {activeItem.content && (
              <p className="archive-lightbox-desc">{activeItem.content}</p>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
