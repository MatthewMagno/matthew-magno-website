import React, { useEffect, useRef, useState } from 'react';
import { fields, school, toolbox, work } from '../data.js';

const TABS = [
  { id: 'work', label: 'Experience', items: work },
  { id: 'school', label: 'Education', items: school },
];

export default function Work() {
  const [tab, setTab] = useState('work');
  const current = TABS.find((t) => t.id === tab);

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title">Work</h2>
        <p>Software, research labs, a chemical plant, product development and a startup’s marketing team. I’ve learned something different from each.</p>
      </div>

      <RangeChart />
      <SpeedupCard />

      <div className="segmented" role="tablist" aria-label="Show">
        <span className="segmented-thumb" style={{ '--x': TABS.indexOf(current) }} aria-hidden="true" />
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="work-panel"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="work-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab} className="work-panel">
        {current.items.map((entry) => (
          <div className="group" key={entry.org}>
            <p className="group-header">
              {entry.org}
              <span>{entry.field ?? entry.place}</span>
            </p>
            <ul className="list">
              {entry.roles.map((role) => (
                <RoleRow key={role.title} role={role} tint={entry.tint} initial={entry.org[0]} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="subhead" id="toolbox">Toolbox</h3>
      <ul className="list toolbox">
        {toolbox.map((row) => (
          <li key={row.group} className="row toolbox-row">
            <span className="row-title">{row.group}</span>
            <ul className="chips chips-quiet">
              {row.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RoleRow({ role, tint, initial }) {
  const [open, setOpen] = useState(false);
  const hasDetail = role.points.length > 0;
  const id = `role-${role.title.replace(/\W+/g, '-').toLowerCase()}`;

  const content = (
    <>
      <span className="row-icon" style={{ background: tint }} aria-hidden="true">{initial}</span>
      <span className="row-text">
        <span className="row-title">{role.title}</span>
        {role.dates && <span className="row-sub">{role.dates}</span>}
      </span>
      {hasDetail && (
        <svg className="chevron" viewBox="0 0 12 20" aria-hidden="true">
          <path d="M2 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );

  if (!hasDetail) {
    return <li className="row">{content}</li>;
  }

  return (
    <li className={`row-disclosure ${open ? 'is-open' : ''}`}>
      <button className="row" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id}>
        {content}
      </button>
      <div className="row-detail" id={id} {...(!open && { inert: '', 'aria-hidden': true })}>
        <ul className="row-detail-inner">
          {role.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

// The one headline number from the day job, shown as a before and after.
function SpeedupCard() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={`speedup ${seen ? 'is-seen' : ''}`} ref={ref}>
      <figcaption>
        <span className="speedup-figure">59.5% faster</span>
        <span className="speedup-caption">
          Average processing time for large loans (100+ tasks) on JPMorgan’s commercial real estate
          lending platform, after a performance project I led.
        </span>
      </figcaption>
      <div className="bars" role="img" aria-label="Before: 86.4 seconds. After: 35 seconds.">
        <div className="bar-row">
          <span className="bar-label">Before</span>
          <span className="bar bar-before" style={{ '--w': 1 }} />
          <span className="bar-value">86.4 s</span>
        </div>
        <div className="bar-row">
          <span className="bar-label">After</span>
          <span className="bar bar-after" style={{ '--w': 35 / 86.4 }} />
          <span className="bar-value">35 s</span>
        </div>
      </div>
    </figure>
  );
}

// Every job on one timeline, one lane per kind of work, so the range reads at a glance.
const START = 2019;
const NOW = [2026, 10];
const END = 2027;

function monthsFrom([y, m]) {
  return (y - START) * 12 + (m - 1);
}

function RangeChart() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const total = (END - START) * 12;
  const years = Array.from({ length: END - START }, (_, i) => START + i);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={`range ${seen ? 'is-seen' : ''}`} ref={ref}>
      <figcaption>
        <span className="range-title">{['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'][fields.length - 1] ?? fields.length} kinds of work since 2019</span>
        <span className="range-caption">Each bar is a job. Software is where I landed.</span>
      </figcaption>

      <div className="range-chart">
        <div className="range-years" aria-hidden="true">
          {years.map((y) => (
            <span key={y} style={{ left: `${((y - START) * 12 / total) * 100}%` }}>{y}</span>
          ))}
        </div>
        <ul className="range-lanes">
          {fields.map((f, lane) => (
            <li key={f.name} className="range-lane">
              <span className="range-lane-name">{f.name}</span>
              <span className="range-track">
                {f.spans.map((sp, i) => {
                  const a = monthsFrom(sp.from);
                  const b = monthsFrom(sp.to ?? NOW) + 1;
                  return (
                    <span
                      key={sp.org}
                      className={`range-bar ${sp.to ? '' : 'is-current'} ${b - a >= 18 ? 'is-wide' : ''}`}
                      style={{
                        left: `${(a / total) * 100}%`,
                        width: `${((b - a) / total) * 100}%`,
                        '--c': f.color,
                        '--d': `${lane * 90 + i * 60}ms`,
                      }}
                      title={sp.org}
                    >
                      <span className="range-bar-label">{sp.org}</span>
                    </span>
                  );
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
