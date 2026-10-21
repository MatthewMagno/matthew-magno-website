import React from 'react';
import { profile } from '../data.js';

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="silk" aria-hidden="true">
        <span className="silk-a" />
        <span className="silk-b" />
        <span className="silk-c" />
      </div>

      <div className="hero-inner">
        <h1 className="hero-title">
          <span className="reveal" style={{ '--i': 0 }}>Matthew</span>{' '}
          <span className="reveal" style={{ '--i': 1 }}>Magno</span>
        </h1>

        <p className="hero-lede reveal" style={{ '--i': 2 }}>
          Software engineer at JPMorganChase in the Bay Area. On nights and weekends I ship apps that
          make my own life more productive.
        </p>

        <div className="hero-actions reveal" style={{ '--i': 3 }}>
          <a className="button button-filled" href={`mailto:${profile.email}`}>Email me</a>
          <a className="button button-glass glass" href={profile.resume} target="_blank" rel="noreferrer">
            Download résumé
          </a>
        </div>

      </div>
    </header>
  );
}
