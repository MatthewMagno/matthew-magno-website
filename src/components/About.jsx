import React from 'react';

const FACTS = [
  { label: 'Based in', value: 'San Francisco' },
  { label: 'Studied', value: 'Chemical engineering, Texas A&M' },
  { label: 'Day job', value: 'Software Engineer II, JPMorganChase' },
  { label: 'Certified', value: 'AWS Cloud Practitioner' },
  { label: 'Building now', value: 'Reservations' },
];

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">About</h2>
      </div>

      <div className="about">
        <div className="about-story">
          <p>
            I studied chemical engineering at Texas A&M. One summer I interned in project management
            at Tillamook, and the next I wrote front-end code at Wells Fargo. The second one stuck.
          </p>
          <p>
            Now I work on lending software at JPMorganChase, where I like the unglamorous wins: an index
            in the right place, a vendor dependency replaced by something my team owns, a sprint that
            doesn’t stall on a sign-off.
          </p>
          <p>
            Outside work I build iPhone apps end to end, from the first sketch to App Store review. Lately
            that means designing products around AI agents, with real guardrails, so they can be trusted
            with someone’s inbox or bookings.
          </p>
        </div>

        <ul className="list facts" aria-label="Quick facts">
          {FACTS.map((f) => (
            <li className="row" key={f.label}>
              <span className="row-title">{f.label}</span>
              <span className="row-value">{f.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
