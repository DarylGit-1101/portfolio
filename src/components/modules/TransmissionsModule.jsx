import React from 'react';
import { LimeInkBlock } from '../LimeInkText.jsx';
import { getChannelIcon, ExternalLinkIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';

export function TransmissionsModule({ module, inkState }) {
  return (
    <div className="transmissions-list">
      {module.channels.map((comm, idx) => (
        <LimeInkBlock
          key={comm.label}
          state={inkState}
          delayMin={200 + idx * 120}
          delayMax={650 + idx * 150}
        >
          <a
            href={comm.href}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => sound.playHover()}
            className="transmission-link"
          >
            <div className="transmission-left">
              <div className="transmission-icon-box">
                {getChannelIcon(comm.label, { size: 18 })}
              </div>

              <div>
                <div className="transmission-label">{comm.label}</div>
                <div className="transmission-address">{comm.address}</div>
              </div>
            </div>

            <span className="transmission-action">
              <span>CONNECT</span>
              <ExternalLinkIcon size={12} color="currentColor" />
            </span>
          </a>
        </LimeInkBlock>
      ))}
    </div>
  );
}
