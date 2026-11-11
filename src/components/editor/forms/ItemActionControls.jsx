import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from '../../Icons.jsx';

/**
 * Reusable reorder (Up / Down) and Delete button bar for editor list items.
 */
export function ItemActionControls({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  deleteLabel = ''
}) {
  return (
    <div className="editor-item-actions">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="editor-btn editor-btn-icon"
        title="Move up"
      >
        <ArrowUpIcon size={12} />
      </button>

      <button
        type="button"
        onClick={onMoveDown}
        disabled={index >= total - 1}
        className="editor-btn editor-btn-icon"
        title="Move down"
      >
        <ArrowDownIcon size={12} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="editor-btn editor-btn-danger"
        title="Delete item"
      >
        <TrashIcon size={11} color="currentColor" />
        {deleteLabel && <span>{deleteLabel}</span>}
      </button>
    </div>
  );
}
