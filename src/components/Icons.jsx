import React from 'react';

/**
 * Tactical NieR & Video-Game System Vector Icons.
 * Production-ready SVG components with dynamic sizing and currentColor inheritance.
 */

function SvgIcon({
  size = 18,
  color = 'currentColor',
  strokeWidth = '1.8',
  fill = 'none',
  className = '',
  style = {},
  children
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={fill === 'none' ? color : undefined}
      strokeWidth={fill === 'none' ? strokeWidth : undefined}
      strokeLinecap={fill === 'none' ? 'round' : undefined}
      strokeLinejoin={fill === 'none' ? 'round' : undefined}
      className={className || undefined}
      style={{ flexShrink: 0, ...style }}
    >
      {children}
    </svg>
  );
}

// 01 // ARCHIVE — Tactical Storage / Projects Floppy-Disc & Cartridge
export function ArchiveIcon(props) {
  return (
    <SvgIcon size={18} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 3v6h10V3" />
      <circle cx="12" cy="14" r="3" />
      <path d="M12 17v2" />
    </SvgIcon>
  );
}

// 02 // UNIT DATA — Android / Cyborg Identification Badge
export function UnitDataIcon(props) {
  return (
    <SvgIcon size={18} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      <path d="M12 4V2" />
      <path d="M19 8h2" />
      <path d="M3 8h2" />
    </SvgIcon>
  );
}

// 03 // CHIP CONFIG — Microchip / CPU Hardware Matrix
export function ChipConfigIcon(props) {
  return (
    <SvgIcon size={18} {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
    </SvgIcon>
  );
}

// 04 // JOURNEY — Waypoint Compass & Route Navigator
export function JourneyIcon({ color = 'currentColor', ...props }) {
  return (
    <SvgIcon size={18} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} fillOpacity="0.2" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </SvgIcon>
  );
}

// 05 // ARSENAL — Crossed Precision Wrenches & Workbench
export function ArsenalIcon(props) {
  return (
    <SvgIcon size={18} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      <path d="m3 21 3-3" />
    </SvgIcon>
  );
}

// 06 // TRANSMISSIONS — Satellite Uplink & Telemetry Frequencies
export function TransmissionsIcon({ color = 'currentColor', ...props }) {
  return (
    <SvgIcon size={18} color={color} {...props}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </SvgIcon>
  );
}

const MODULE_ICON_MAP = {
  archive: ArchiveIcon,
  unit_data: UnitDataIcon,
  chip_config: ChipConfigIcon,
  chronicles: JourneyIcon,
  arsenal: ArsenalIcon,
  transmissions: TransmissionsIcon
};

// Map helper to easily get an icon by module ID
export function getModuleIcon(moduleId, props = {}) {
  const IconComponent = MODULE_ICON_MAP[moduleId] || ArchiveIcon;
  return <IconComponent {...props} />;
}

// -----------------------------------------------------------------
// SYSTEM & UI CONTROLS
// -----------------------------------------------------------------

export function SpeakerOnIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </SvgIcon>
  );
}

export function SpeakerOffIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </SvgIcon>
  );
}

export function ConfigIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </SvgIcon>
  );
}

export function ClockIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  );
}

export function RadarCrosshairIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </SvgIcon>
  );
}

export function ExternalLinkIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </SvgIcon>
  );
}

export function SaveIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </SvgIcon>
  );
}

export function DownloadIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </SvgIcon>
  );
}

export function UploadIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </SvgIcon>
  );
}

export function TrashIcon(props) {
  return (
    <SvgIcon size={13} strokeWidth="2" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </SvgIcon>
  );
}

export function PlusIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2.2" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </SvgIcon>
  );
}

export function LockIcon(props) {
  return (
    <SvgIcon size={14} strokeWidth="2" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SvgIcon>
  );
}

export function EyeIcon(props) {
  return (
    <SvgIcon size={14} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}

export function EyeOffIcon(props) {
  return (
    <SvgIcon size={14} {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </SvgIcon>
  );
}

export function ArrowUpIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2.2" {...props}>
      <polyline points="18 15 12 9 6 15" />
    </SvgIcon>
  );
}

export function ArrowDownIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2.2" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </SvgIcon>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <SvgIcon size={13} strokeWidth="2.2" {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </SvgIcon>
  );
}

export function CloseIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2.2" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </SvgIcon>
  );
}

export function ResetIcon(props) {
  return (
    <SvgIcon size={13} strokeWidth="2" {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </SvgIcon>
  );
}

export function ExpandIcon(props) {
  return (
    <SvgIcon size={12} strokeWidth="2" {...props}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </SvgIcon>
  );
}

// -----------------------------------------------------------------
// BRAND & PROTOCOL ICONS (FOR TRANSMISSIONS)
// -----------------------------------------------------------------

export function MailIcon(props) {
  return (
    <SvgIcon size={16} {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </SvgIcon>
  );
}

export function GithubIcon(props) {
  return (
    <SvgIcon size={16} fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </SvgIcon>
  );
}

export function LinkedinIcon(props) {
  return (
    <SvgIcon size={16} fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </SvgIcon>
  );
}

export function DocumentIcon(props) {
  return (
    <SvgIcon size={16} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </SvgIcon>
  );
}

export function getChannelIcon(label = '', props = {}) {
  const lower = label.toLowerCase();
  if (lower.includes('email') || lower.includes('mail')) return <MailIcon {...props} />;
  if (lower.includes('github') || lower.includes('repo')) return <GithubIcon {...props} />;
  if (lower.includes('linkedin') || lower.includes('network')) return <LinkedinIcon {...props} />;
  return <DocumentIcon {...props} />;
}
