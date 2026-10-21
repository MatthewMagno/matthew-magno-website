import React from 'react';
import { apps } from '../data.js';

// Apple Wallet-style stack: every app shows its header, the open one expands.
export default function WalletStack({ openId, onOpen }) {
  return (
    <section className="section" id="apps" aria-labelledby="apps-title">
      <div className="section-head">
        <h2 id="apps-title">Apps I’ve built</h2>
        <p>Designed, engineered and shipped on my own time. Tap a card to open it.</p>
      </div>

      <div className="wallet">
        {apps.map((app) => {
          const open = app.id === openId;
          return (
            <article
              key={app.id}
              className={`pass ${open ? 'is-open' : ''}`}
              style={{ '--pass': app.color }}
            >
              <h3 className="pass-heading">
                <button
                  className="pass-header"
                  onClick={() => onOpen(app.id)}
                  aria-expanded={open}
                  aria-controls={`pass-${app.id}`}
                >
                  <img src={app.icon} alt="" width="48" height="48" />
                  <span className="pass-name">{app.name}</span>
                  <span className="pass-status">{app.status}</span>
                </button>
              </h3>

              {/* Closed bodies stay in the DOM so the height can animate; inert hides them from focus. */}
              <div className="pass-body" id={`pass-${app.id}`} {...(!open && { inert: '', 'aria-hidden': true })}>
                <div className="pass-body-inner">
                  <p className="pass-tagline">{app.tagline}</p>

                  <dl className="pass-facts">
                    {app.facts.map((f) => (
                      <div key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="pass-points">
                    {app.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>

                  <div className="pass-footer">
                    <ul className="chips" aria-label="Built with">
                      {app.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    {app.link && (
                      <a className="button button-light" href={app.link.href} target="_blank" rel="noreferrer">
                        {app.link.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
