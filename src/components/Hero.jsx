import React from 'react';
import { apps, profile } from '../data.js';

export default function Hero({ onOpenApp }) {
  const reviewing = apps.find((a) => a.status === 'In App Store review');

  return (
    <header className="hero" id="top">
      <div className="silk" aria-hidden="true">
        <span className="silk-a" />
        <span className="silk-b" />
        <span className="silk-c" />
      </div>

      <div className="hero-inner">
        {reviewing && (
          <p className="status-pill glass">
            <span className="status-dot" aria-hidden="true" />
            {reviewing.name} is in App Store review
          </p>
        )}

        <h1 className="hero-title">
          <span className="reveal" style={{ '--i': 0 }}>Matthew</span>{' '}
          <span className="reveal" style={{ '--i': 1 }}>Magno</span>
        </h1>

        <p className="hero-lede reveal" style={{ '--i': 2 }}>
          Software engineer at JPMorganChase in the Bay Area. On nights and weekends I design, build
          and ship my own iPhone apps.
        </p>

        <div className="hero-actions reveal" style={{ '--i': 3 }}>
          <a className="button button-filled" href={`mailto:${profile.email}`}>Email me</a>
          <a className="button button-glass glass" href={profile.resume} target="_blank" rel="noreferrer">
            Download résumé
          </a>
        </div>

        <div className="dock glass" role="list" aria-label="My apps">
          {apps.map((app, i) => (
            <button
              key={app.id}
              role="listitem"
              className="dock-app"
              style={{ '--i': i }}
              onClick={() => onOpenApp(app.id)}
              aria-label={`${app.name}: ${app.status}`}
            >
              <img src={app.icon} alt="" width="72" height="72" />
              <span>{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
