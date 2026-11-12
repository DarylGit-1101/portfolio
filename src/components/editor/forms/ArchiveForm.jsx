import React, { useState } from 'react';
import {
  CloseIcon,
  PlusIcon,
  UploadIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentIcon
} from '../../Icons.jsx';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import {
  createModuleListHandlers,
  removeArrayItem,
  moveArrayItem,
  updateArrayItem,
  getNormalizedProjectBlocks
} from '../../../utils/arrayUtils.js';
import { sound } from '../../../utils/audio.js';

async function uploadProjectImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      try {
        const res = await fetch('/api/upload-project-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, dataUrl })
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.url) {
            resolve(json.url);
            return;
          }
        }
      } catch {
        // Fallback to inline dataUrl if static/offline
      }
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function ArchiveForm({ module, onUpdateModule }) {
  // Default to first project (0) if projects exist, otherwise 'meta'
  const [selectedView, setSelectedView] = useState(() =>
    module.items && module.items.length > 0 ? 0 : 'meta'
  );
  const [uploadingBlockIdx, setUploadingBlockIdx] = useState(null);

  const projects = createModuleListHandlers(module, 'items', onUpdateModule, { prepend: false });

  const addProject = () => {
    sound.playSelect();
    const newIndex = module.items.length;
    projects.add({
      title: 'NEW PROJECT TITLE',
      category: 'WEB APPLICATION // SYSTEM',
      tech: ['React', 'JavaScript'],
      description: 'Short summary shown on the archive list card.',
      stats: 'PRODUCTION // LIVE',
      blocks: [
        {
          type: 'text',
          heading: 'OVERVIEW & ARCHITECTURE',
          content:
            'Write a long text breakdown here, or add Image + Text blocks below to build your full project showcase.'
        }
      ],
      links: []
    });
    setSelectedView(newIndex);
  };

  const moveProject = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= module.items.length) return;
    sound.playHover();
    projects.move(fromIdx, toIdx);
    if (selectedView === fromIdx) {
      setSelectedView(toIdx);
    } else if (selectedView === toIdx) {
      setSelectedView(fromIdx);
    }
  };

  const deleteProject = (idx) => {
    projects.remove(idx);
    if (selectedView === idx) {
      const remaining = module.items.length - 1;
      setSelectedView(remaining > 0 ? Math.max(0, idx - 1) : 'meta');
    } else if (typeof selectedView === 'number' && selectedView > idx) {
      setSelectedView(selectedView - 1);
    }
  };

  const addTechTag = (projIndex, tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const currentTech = module.items[projIndex].tech || [];
    projects.updateField(projIndex, 'tech', [...currentTech, trimmed]);
  };

  const removeTechTag = (projIndex, tagIndex) => {
    const currentTech = module.items[projIndex].tech || [];
    projects.updateField(projIndex, 'tech', removeArrayItem(currentTech, tagIndex));
  };

  // =========================================================================
  // MODULAR CONTENT BLOCKS (LONG TEXT OR IMAGE + TEXT)
  // =========================================================================
  const getBlocks = (projIndex) => getNormalizedProjectBlocks(module.items[projIndex]);

  const commitBlocks = (projIndex, nextBlocks) => {
    const currentProj = module.items[projIndex];
    const updatedProj = {
      ...currentProj,
      blocks: nextBlocks,
      details: '',
      images: []
    };
    projects.replace(projIndex, updatedProj);
  };

  const addTextBlock = (projIndex) => {
    sound.playSelect();
    const current = getBlocks(projIndex);
    commitBlocks(projIndex, [
      ...current,
      {
        type: 'text',
        heading: '',
        content: ''
      }
    ]);
  };

  const addImageTextBlock = (projIndex) => {
    sound.playSelect();
    const current = getBlocks(projIndex);
    commitBlocks(projIndex, [
      ...current,
      {
        type: 'image_text',
        layout: 'stack',
        imageUrl: '',
        caption: '',
        heading: '',
        content: ''
      }
    ]);
  };

  const updateBlock = (projIndex, blockIdx, partial) => {
    const current = getBlocks(projIndex);
    commitBlocks(projIndex, updateArrayItem(current, blockIdx, partial));
  };

  const moveBlock = (projIndex, fromIdx, toIdx) => {
    sound.playHover();
    const current = getBlocks(projIndex);
    commitBlocks(projIndex, moveArrayItem(current, fromIdx, toIdx));
  };

  const removeBlock = (projIndex, blockIdx) => {
    sound.playHover();
    const current = getBlocks(projIndex);
    commitBlocks(projIndex, removeArrayItem(current, blockIdx));
  };

  const handleBlockImageUpload = async (projIndex, blockIdx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBlockIdx(blockIdx);
    try {
      const uploadedUrl = await uploadProjectImageFile(file);
      const currentBlock = getBlocks(projIndex)[blockIdx];
      const defaultCaption =
        currentBlock?.caption ||
        file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      updateBlock(projIndex, blockIdx, {
        imageUrl: uploadedUrl,
        caption: defaultCaption
      });
      sound.playSelect();
    } finally {
      setUploadingBlockIdx(null);
      e.target.value = '';
    }
  };

  // =========================================================================
  // EXTERNAL ACTION LINKS
  // =========================================================================
  const getProjectLinks = (projIndex) => module.items[projIndex]?.links || [];

  const addProjectLink = (projIndex) => {
    const current = getProjectLinks(projIndex);
    projects.updateField(projIndex, 'links', [
      ...current,
      { label: 'LIVE DEMO', url: 'https://' }
    ]);
  };

  const updateProjectLink = (projIndex, linkIndex, field, value) => {
    const current = getProjectLinks(projIndex);
    projects.updateField(
      projIndex,
      'links',
      updateArrayItem(current, linkIndex, { [field]: value })
    );
  };

  const removeProjectLink = (projIndex, linkIndex) => {
    const current = getProjectLinks(projIndex);
    projects.updateField(projIndex, 'links', removeArrayItem(current, linkIndex));
  };

  const activeProject =
    typeof selectedView === 'number' ? module.items[selectedView] : null;
  const activeBlocks =
    typeof selectedView === 'number' && activeProject ? getBlocks(selectedView) : [];

  return (
    <div className="editor-form-container editor-archive-wide">
      <ModuleSectionHeader
        module={module}
        suffix="PROJECTS"
        actionLabel="ADD NEW PROJECT"
        onAction={addProject}
      />

      {/* =================================================================
          ZERO-SIDESCROLL 2-COLUMN ARCHIVE WORKSPACE
          Left Rail: Instant vertical project directory & order controls
          Right Pane: Active project editor (or Module Header settings)
          ================================================================= */}
      <div className="editor-archive-split">
        {/* LEFT COLUMN: Vertical Project Navigator (All visible at once, no horizontal scroll) */}
        <aside className="editor-archive-roster">
          <div className="editor-archive-roster-top">
            <span className="editor-archive-roster-title">
              ARCHIVE DIRECTORY ({module.items.length})
            </span>
            <button
              type="button"
              onClick={addProject}
              className="editor-btn editor-btn-primary editor-roster-add-btn"
            >
              <PlusIcon size={12} />
              <span>NEW PROJECT</span>
            </button>
          </div>

          {/* Module Header Settings Item */}
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setSelectedView('meta');
            }}
            className={`editor-roster-item editor-roster-meta-item ${
              selectedView === 'meta' ? 'is-active' : ''
            }`}
          >
            <div className="editor-roster-item-main">
              <span className="editor-roster-code">[HEADER]</span>
              <span className="editor-roster-name">SECTION TITLE &amp; TAGLINE</span>
            </div>
          </button>

          <div className="editor-roster-divider">PROJECTS LIST</div>

          {/* Vertical Stack of All Projects */}
          <div className="editor-roster-list">
            {module.items.map((proj, pIdx) => {
              const isSelected = selectedView === pIdx;
              const blockCount = getNormalizedProjectBlocks(proj).length;

              return (
                <div
                  key={pIdx}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedView(pIdx);
                  }}
                  className={`editor-roster-item ${isSelected ? 'is-active' : ''}`}
                >
                  <div className="editor-roster-item-main">
                    <div className="editor-roster-row-top">
                      <span className="editor-roster-code">
                        [{String(pIdx + 1).padStart(2, '0')}]
                      </span>
                      <span className="editor-roster-stats">{proj.stats}</span>
                    </div>
                    <div className="editor-roster-name">
                      {proj.title || 'UNTITLED PROJECT'}
                    </div>
                    <div className="editor-roster-sub">
                      <span>{blockCount} BLOCKS</span>
                      <span>•</span>
                      <span>{(proj.tech || []).length} TAGS</span>
                    </div>
                  </div>

                  {/* Quick Up/Down Reorder Buttons right on the directory item */}
                  <div
                    className="editor-roster-Order-btns"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={pIdx === 0}
                      onClick={() => moveProject(pIdx, pIdx - 1)}
                      className="editor-roster-order-btn"
                      title="Move Up"
                    >
                      <ArrowUpIcon size={10} />
                    </button>
                    <button
                      type="button"
                      disabled={pIdx === module.items.length - 1}
                      onClick={() => moveProject(pIdx, pIdx + 1)}
                      className="editor-roster-order-btn"
                      title="Move Down"
                    >
                      <ArrowDownIcon size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: Active Editor Detail Pane */}
        <div className="editor-archive-detail-pane">
          {selectedView === 'meta' && (
            <div className="editor-project-workspace">
              <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

              <div className="editor-card">
                <div className="editor-card-header">
                  <span className="editor-card-badge">
                    QUICK PROJECT OVERVIEW ({module.items.length} TOTAL)
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  Select any project in the left directory to edit its summary, add <b>Long Text</b> or <b>Image + Text</b> blocks, upload screenshots, and manage tech tags.
                </p>
              </div>
            </div>
          )}

          {typeof selectedView === 'number' && activeProject && (
            <div className="editor-project-workspace">
              {/* Top Active Project Banner */}
              <div className="editor-project-Banner">
                <div>
                  <div className="editor-section-code">
                    EDITING PROJECT RECORD [{String(selectedView + 1).padStart(2, '0')} OF{' '}
                    {String(module.items.length).padStart(2, '0')}]
                  </div>
                  <div className="editor-active-proj-heading">
                    {activeProject.title || 'UNTITLED PROJECT'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteProject(selectedView)}
                  className="editor-btn editor-btn-danger"
                >
                  <TrashIcon size={12} />
                  <span>DELETE PROJECT</span>
                </button>
              </div>

              {/* 1. Core Card & Header Identity */}
              <div className="editor-card">
                <div className="editor-card-header">
                  <span className="editor-card-badge">
                    01 // CORE IDENTITY &amp; CARD SUMMARY
                  </span>
                </div>

                <div className="editor-grid-3">
                  <div>
                    <label className="editor-label">Project Title</label>
                    <input
                      type="text"
                      value={activeProject.title}
                      onChange={(e) =>
                        projects.updateField(selectedView, 'title', e.target.value)
                      }
                      className="editor-input"
                    />
                  </div>
                  <div>
                    <label className="editor-label">Category</label>
                    <input
                      type="text"
                      value={activeProject.category}
                      onChange={(e) =>
                        projects.updateField(selectedView, 'category', e.target.value)
                      }
                      className="editor-input"
                    />
                  </div>
                  <div>
                    <label className="editor-label">Stats / Year Badge</label>
                    <input
                      type="text"
                      value={activeProject.stats}
                      onChange={(e) =>
                        projects.updateField(selectedView, 'stats', e.target.value)
                      }
                      className="editor-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="editor-label">
                    Short Summary (Shown on Archive Card &amp; Lead Intro)
                  </label>
                  <textarea
                    rows={3}
                    value={activeProject.description}
                    onChange={(e) =>
                      projects.updateField(selectedView, 'description', e.target.value)
                    }
                    className="editor-textarea"
                  />
                </div>
              </div>

              {/* 2. Modular Content Blocks Builder (Long Text OR Image + Text) */}
              <div className="editor-card">
                <div className="editor-card-header">
                  <div>
                    <span className="editor-card-badge">
                      02 // LEFT PANEL CONTENT BLOCKS ({activeBlocks.length})
                    </span>
                    <div className="editor-block-helper-text">
                      Add and reorder as many <b>Long Text</b> or <b>Image + Text</b> sections as you want.
                    </div>
                  </div>

                  <div className="editor-block-add-group">
                    <button
                      type="button"
                      onClick={() => addTextBlock(selectedView)}
                      className="editor-btn editor-btn-primary"
                    >
                      <PlusIcon size={12} />
                      <span>ADD LONG TEXT</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addImageTextBlock(selectedView)}
                      className="editor-btn editor-btn-primary"
                    >
                      <PlusIcon size={12} />
                      <span>ADD IMAGE + TEXT</span>
                    </button>
                  </div>
                </div>

                {activeBlocks.length === 0 ? (
                  <div className="editor-empty-blocks">
                    <div>No content blocks added yet for the left inspection panel.</div>
                    <div className="editor-block-add-group" style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => addTextBlock(selectedView)}
                        className="editor-btn"
                      >
                        <PlusIcon size={12} />
                        <span>+ ADD LONG TEXT BLOCK</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addImageTextBlock(selectedView)}
                        className="editor-btn"
                      >
                        <PlusIcon size={12} />
                        <span>+ ADD IMAGE + TEXT BLOCK</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="editor-blocks-list">
                    {activeBlocks.map((block, bIdx) => {
                      const isImageBlock = block.type === 'image_text';

                      return (
                        <div
                          key={bIdx}
                          className={`editor-content-block ${
                            isImageBlock ? 'is-image-text-block' : 'is-text-block'
                          }`}
                        >
                          {/* Block Header Bar */}
                          <div className="editor-content-block-header">
                            <div className="editor-content-block-type">
                              <DocumentIcon size={13} />
                              <span>
                                BLOCK [{String(bIdx + 1).padStart(2, '0')}] //{' '}
                                {isImageBlock
                                  ? 'IMAGE + TEXT SECTION'
                                  : 'LONG TEXT SECTION'}
                              </span>
                            </div>

                            <div className="editor-item-actions">
                              <button
                                type="button"
                                onClick={() =>
                                  updateBlock(selectedView, bIdx, {
                                    type: isImageBlock ? 'text' : 'image_text',
                                    layout: block.layout || 'stack'
                                  })
                                }
                                className="editor-btn"
                                title="Switch between Long Text and Image + Text"
                              >
                                <span>
                                  {isImageBlock ? 'TEXT ONLY' : '+ ATTACH IMAGE'}
                                </span>
                              </button>

                              <button
                                type="button"
                                disabled={bIdx === 0}
                                onClick={() => moveBlock(selectedView, bIdx, bIdx - 1)}
                                className="editor-btn editor-btn-icon"
                                title="Move Block Up"
                              >
                                <ArrowUpIcon size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={bIdx === activeBlocks.length - 1}
                                onClick={() => moveBlock(selectedView, bIdx, bIdx + 1)}
                                className="editor-btn editor-btn-icon"
                                title="Move Block Down"
                              >
                                <ArrowDownIcon size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeBlock(selectedView, bIdx)}
                                className="editor-btn editor-btn-danger"
                              >
                                <TrashIcon size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Optional Section Heading */}
                          <div>
                            <label className="editor-label">
                              Section Heading (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. SYSTEM ARCHITECTURE, MULTIPLAYER SYNC, UI WORKFLOW..."
                              value={block.heading || ''}
                              onChange={(e) =>
                                updateBlock(selectedView, bIdx, {
                                  heading: e.target.value
                                })
                              }
                              className="editor-input"
                            />
                          </div>

                          {/* Image Controls (Only shown when block.type === 'image_text') */}
                          {isImageBlock && (
                            <div className="editor-block-image-zone">
                              <div className="editor-block-image-preview">
                                {block.imageUrl ? (
                                  <img
                                    src={block.imageUrl}
                                    alt={block.caption || `Block ${bIdx + 1}`}
                                    className="editor-image-thumb"
                                  />
                                ) : (
                                  <div className="editor-block-no-image">
                                    NO IMAGE SELECTED
                                  </div>
                                )}

                                <label
                                  className="editor-btn editor-btn-primary editor-block-upload-btn"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <UploadIcon size={12} />
                                  <span>
                                    {uploadingBlockIdx === bIdx
                                      ? 'UPLOADING...'
                                      : block.imageUrl
                                      ? 'REPLACE IMAGE FILE'
                                      : 'UPLOAD IMAGE FILE'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleBlockImageUpload(selectedView, bIdx, e)
                                    }
                                    style={{ display: 'none' }}
                                  />
                                </label>
                              </div>

                              <div className="editor-block-image-meta">
                                <div>
                                  <label className="editor-label">
                                    Image Layout in Left Panel
                                  </label>
                                  <select
                                    value={block.layout || 'stack'}
                                    onChange={(e) =>
                                      updateBlock(selectedView, bIdx, {
                                        layout: e.target.value
                                      })
                                    }
                                    className="editor-input"
                                  >
                                    <option value="stack">
                                      Full-Width Image + Text Below
                                    </option>
                                    <option value="split-left">
                                      Side-by-Side: Image Left + Text Right
                                    </option>
                                    <option value="split-right">
                                      Side-by-Side: Text Left + Image Right
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label className="editor-label">
                                    Image URL or Local Path
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="https://... or ./projects/screenshot.png"
                                    value={block.imageUrl || ''}
                                    onChange={(e) =>
                                      updateBlock(selectedView, bIdx, {
                                        imageUrl: e.target.value
                                      })
                                    }
                                    className="editor-input"
                                  />
                                </div>

                                <div>
                                  <label className="editor-label">
                                    Image Caption (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Host-authoritative 3D dice physics replay"
                                    value={block.caption || ''}
                                    onChange={(e) =>
                                      updateBlock(selectedView, bIdx, {
                                        caption: e.target.value
                                      })
                                    }
                                    className="editor-input"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Long Text / Accompanying Text */}
                          <div>
                            <label className="editor-label">
                              {isImageBlock
                                ? 'Accompanying Text / Description (Optional)'
                                : 'Long Text Content'}
                            </label>
                            <textarea
                              rows={isImageBlock ? 4 : 6}
                              placeholder={
                                isImageBlock
                                  ? 'Explain what is happening in this image or section...'
                                  : 'Write paragraphs, bullet points (•), or technical notes...'
                              }
                              value={block.content || ''}
                              onChange={(e) =>
                                updateBlock(selectedView, bIdx, {
                                  content: e.target.value
                                })
                              }
                              className="editor-textarea"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Quick-Add Bar */}
                {activeBlocks.length > 0 && (
                  <div className="editor-blocks-footer-bar">
                    <button
                      type="button"
                      onClick={() => addTextBlock(selectedView)}
                      className="editor-btn"
                    >
                      <PlusIcon size={12} />
                      <span>+ APPEND LONG TEXT BLOCK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addImageTextBlock(selectedView)}
                      className="editor-btn"
                    >
                      <PlusIcon size={12} />
                      <span>+ APPEND IMAGE + TEXT BLOCK</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Action Links (Live Demo, Repo, etc.) & Tech Stack */}
              <div className="editor-card">
                <div className="editor-card-header">
                  <span className="editor-card-badge">
                    03 // EXTERNAL LINKS &amp; TECHNOLOGY TAGS
                  </span>
                  <button
                    type="button"
                    onClick={() => addProjectLink(selectedView)}
                    className="editor-btn"
                  >
                    <PlusIcon size={12} />
                    <span>ADD ACTION LINK</span>
                  </button>
                </div>

                {getProjectLinks(selectedView).length > 0 && (
                  <div className="editor-items-stack" style={{ marginBottom: '10px' }}>
                    {getProjectLinks(selectedView).map((lnk, lIdx) => (
                      <div key={lIdx} className="editor-link-row">
                        <div>
                          <label className="editor-label">Button Label</label>
                          <input
                            type="text"
                            placeholder="LIVE DEMO / GITHUB"
                            value={lnk.label}
                            onChange={(e) =>
                              updateProjectLink(
                                selectedView,
                                lIdx,
                                'label',
                                e.target.value
                              )
                            }
                            className="editor-input"
                          />
                        </div>
                        <div>
                          <label className="editor-label">Target URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={lnk.url}
                            onChange={(e) =>
                              updateProjectLink(selectedView, lIdx, 'url', e.target.value)
                            }
                            className="editor-input"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProjectLink(selectedView, lIdx)}
                          className="editor-btn editor-btn-danger"
                          style={{ alignSelf: 'flex-end', height: '33px' }}
                        >
                          <TrashIcon size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="editor-label">Technology Tags</label>
                  <div className="editor-tags-row">
                    {(activeProject.tech || []).map((t, tIdx) => (
                      <span key={tIdx} className="editor-tag-pill">
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => removeTechTag(selectedView, tIdx)}
                          className="editor-tag-remove"
                          title="Remove tag"
                        >
                          <CloseIcon size={10} />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      placeholder="+ Add tag (Enter)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechTag(selectedView, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="editor-input editor-tag-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
