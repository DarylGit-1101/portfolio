import React from 'react';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';
import { getChannelIcon, ExternalLinkIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';

export function TransmissionsModule({ module, inkState }) {
  return (
    <div className="transmissions-list">
      {module.channels.map((comm, idx) => (
        <LimeInkBlock
          key={comm.label}
          state={inkState}
          delayMin={200 + idx * 100}
          delayMax={550 + idx * 120}
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
                <div className="transmission-label">
                  <LimeInkText state={inkState} delayMin={250 + idx * 100} delayMax={650 + idx * 120}>
                    {comm.label}
                  </LimeInkText>
                </div>
                <div className="transmission-address">
                  <LimeInkText state={inkState} delayMin={320 + idx * 100} delayMax={800 + idx * 130}>
                    {comm.address}
                  </LimeInkText>
                </div>
              </div>
            </div>

            <span className="transmission-action">
              <span>
                <LimeInkText state={inkState} delayMin={380 + idx * 100} delayMax={880 + idx * 130}>
                  CONNECT
                </LimeInkText>
              </span>
              <ExternalLinkIcon size={12} color="currentColor" />
            </span>
          </a>
        </LimeInkBlock>
      ))}
    </div>
  );
}
