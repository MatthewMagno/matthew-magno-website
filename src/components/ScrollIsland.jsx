import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Floating glass navigation. Sits at the top on wide screens and becomes a
// bottom tab bar on phones. The highlighted capsule tracks the section in view.
export default function ScrollIsland({ sections }) {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [thumb, setThumb] = useState(null);
  const linkRefs = useRef({});
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    const hero = document.getElementById('top');
    if (hero) observer.observe(hero);
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [sections]);

  useLayoutEffect(() => {
    const measure = () => {
      const link = linkRefs.current[active];
      const bar = barRef.current;
      if (!link || !bar) return setThumb(null);
      const a = link.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      setThumb({ left: a.left - b.left, width: a.width });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <nav className={`island glass ${scrolled ? 'is-scrolled' : ''}`} aria-label="Sections">
      <a className="island-home" href="#top" aria-label="Back to top">
        <span className="island-avatar" aria-hidden="true">MM</span>
        <span className="island-name">Matthew Magno</span>
      </a>
      <div className="island-links" ref={barRef}>
        {thumb && (
          <span
            className="island-thumb"
            style={{ transform: `translateX(${thumb.left}px)`, width: thumb.width }}
            aria-hidden="true"
          />
        )}
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            ref={(el) => (linkRefs.current[id] = el)}
            className={active === id ? 'is-active' : undefined}
            aria-current={active === id ? 'true' : undefined}
          >
            <SectionGlyph id={id} />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

// Small SF Symbols-style glyphs, shown only in the phone tab bar.
function SectionGlyph({ id }) {
  const paths = {
    apps: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" />
      </>
    ),
    work: (
      <>
        <rect x="2.5" y="7" width="19" height="13" rx="3" />
        <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" fill="none" strokeWidth="1.8" stroke="currentColor" />
      </>
    ),
    about: (
      <>
        <circle cx="12" cy="8" r="4.2" />
        <path d="M3.8 20.5c.9-4 4.2-6.3 8.2-6.3s7.3 2.3 8.2 6.3z" />
      </>
    ),
    contact: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" fill="none" stroke="var(--glyph-cut)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };
  return (
    <svg className="island-glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}
