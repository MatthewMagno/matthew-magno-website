import React, { useCallback, useEffect, useRef, useState } from 'react';
import './demos.css';

// The demos lay out at real iPhone points (393 × 852) and the frame scales them down,
// so type and spacing match what the apps actually look like on a phone.
export const SCREEN_W = 393;
export const SCREEN_H = 852;

export function PhoneFrame({ children, darkStatus = false, label, onRestart }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.74);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(0.78, (el.clientWidth - 24) / SCREEN_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="phone-wrap" ref={wrapRef}>
      <div
        className="phone"
        role="group"
        aria-label={label}
        style={{ width: SCREEN_W * scale + 24, height: SCREEN_H * scale + 24 }}
      >
        <div className="phone-screen" style={{ transform: `scale(${scale})` }}>
          {children}
          <div className={`phone-status ${darkStatus ? 'is-dark' : ''}`} aria-hidden="true">
            <span className="phone-time">9:41</span>
            <span className="phone-island" />
            <span className="phone-icons">
              <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
              <svg viewBox="0 0 16 12"><path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .5 3.4l1.3 1.3A8.7 8.7 0 0 1 8 2.2zm0 3.7c1.4 0 2.7.5 3.6 1.4L13 6a7 7 0 0 0-10 0l1.4 1.3A5.1 5.1 0 0 1 8 5.9zm0 3.6c-.6 0-1.1.2-1.5.6L8 11.7l1.5-1.6c-.4-.4-.9-.6-1.5-.6z" /></svg>
              <svg viewBox="0 0 27 12"><rect x="0.5" y="0.5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="20" height="8" rx="2" /><path d="M25 4v4c.8-.3 1.5-1.1 1.5-2S25.8 4.3 25 4z" opacity=".4" /></svg>
            </span>
          </div>
          <div className={`phone-home ${darkStatus ? 'is-dark' : ''}`} aria-hidden="true" />
        </div>
      </div>
      <div className="phone-caption">
        <span>Live demo with sample data. Tap around.</span>
        {onRestart && (
          <button className="phone-restart" onClick={onRestart}>Start over</button>
        )}
      </div>
    </div>
  );
}

// A tiny navigation stack: push slides a screen in from the right, sheet slides one up.
export function useStack(root) {
  const [stack, setStack] = useState([{ id: 'root', name: root, kind: 'root' }]);

  const push = useCallback((name, kind = 'push', props = {}) => {
    setStack((s) => [...s, { id: `${name}-${Date.now()}`, name, kind, props }]);
  }, []);

  const pop = useCallback(() => {
    setStack((s) => {
      const live = s.filter((e) => !e.leaving);
      if (live.length < 2) return s;
      const last = live[live.length - 1];
      return s.map((e) => (e === last ? { ...e, leaving: true } : e));
    });
    setTimeout(() => setStack((s) => s.filter((e) => !e.leaving)), 420);
  }, []);

  const reset = useCallback((name = root) => {
    setStack([{ id: `root-${Date.now()}`, name, kind: 'root' }]);
  }, [root]);

  return { stack, push, pop, reset };
}

export function Stack({ stack, render }) {
  return (
    <div className="stack">
      {stack.map((entry, i) => {
        const above = stack.slice(i + 1).filter((e) => !e.leaving);
        const cover = above.length ? above[above.length - 1].kind : null;
        return (
          <div
            key={entry.id}
            className={[
              'scr',
              `scr-${entry.kind}`,
              entry.leaving ? 'is-leaving' : '',
              cover ? `covered-by-${cover}` : '',
            ].join(' ')}
            {...(cover && { inert: '', 'aria-hidden': true })}
          >
            {render(entry)}
          </div>
        );
      })}
    </div>
  );
}
