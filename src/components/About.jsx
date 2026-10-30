import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// What I do away from a keyboard, each with the photos that go with it.
const PURSUITS = [
  {
    title: 'Running',
    photos: [
      { src: './about/marathon-start.jpg', alt: 'Matthew and two friends in race bibs at the marathon start at night' },
      { src: './about/marathon-run.jpg', alt: 'Matthew running in the San Francisco Marathon past a crowd of spectators' },
    ],
  },
  {
    title: 'Hiking',
    photos: [
      { src: './about/trek-pass.jpg', alt: 'Hikers climbing a rocky trail above a long valley under low clouds', caption: 'Up to the pass' },
      { src: './about/trek-forest.jpg', alt: 'Matthew with trekking poles, small against a wall of dense green forest', caption: 'Into the cloud forest' },
      { src: './about/trek-cable.jpg', alt: 'Matthew and a friend laughing in a hanging cable car over a rushing river', caption: 'The way across the river' },
    ],
  },
  {
    title: 'Photography',
    photos: [
      { src: './about/photo-torres-del-paine.jpg', alt: 'A lone figure at a lake below the granite towers of Torres del Paine, lit orange at sunrise', caption: 'Torres del Paine, Patagonia' },
      { src: './about/photo-dolomites.jpg', alt: 'Four hikers on a grassy ridge below jagged grey peaks', caption: 'The Dolomites, Italy' },
      { src: './about/photo-tokyo.jpg', alt: 'A quiet Tokyo street at dusk, seen from above, with one person walking', caption: 'Tokyo' },
      { src: './about/photo-sequoia.jpg', alt: 'A person sitting at the base of a giant sequoia in a sunlit forest', caption: 'Giant sequoias, California' },
      { src: './about/photo-mexico-city.jpg', alt: 'Brightly painted boats lined up along a canal in Xochimilco', caption: 'Xochimilco, Mexico City' },
      { src: './about/photo-patagonia-glacier.jpg', alt: 'Hikers crossing dark rocks beside a grey glacial lake under heavy cloud', caption: 'On the W Trek, Patagonia' },
    ],
  },
];

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">About</h2>
      </div>

      <div className="about-layout">
        <div className="about-story">
          <p>
            Outside work I enjoy going on and documenting my adventurous endeavors. I like a
            challenge: a marathon, a three-day W Trek instead of the usual five, and an unguided,
            seemingly perilous hike through Peru that most would get a guide for. I also build apps to make my own life easier, like splitting trip costs with friends,
            planning dates and keeping every booking in one place.
          </p>
        </div>

        <Pursuits />
      </div>
    </section>
  );
}

// One pursuit at a time, picked from a segmented control, with its photos in a strip that scrolls sideways.
// Switching slides the control's thumb, fades the old panel out, then fades the new one in while the height eases.
const FADE_MS = 180;
const RESIZE_MS = 380;

function Pursuits() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const stripRef = useRef(null);
  const panelRef = useRef(null);
  const tabRefs = useRef([]);
  const fromHeight = useRef(null);
  const p = PURSUITS[shown];

  const updateEdges = () => {
    const el = stripRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  // Slide the thumb under the selected tab.
  useLayoutEffect(() => {
    const place = () => {
      const tab = tabRefs.current[active];
      if (tab) setThumb({ x: tab.offsetLeft, w: tab.offsetWidth });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  // Fade the current panel out, then swap in the new one.
  useEffect(() => {
    if (active === shown) return;
    const panel = panelRef.current;
    fromHeight.current = panel ? panel.offsetHeight : null;
    setFading(true);
    const t = setTimeout(() => setShown(active), FADE_MS);
    return () => clearTimeout(t);
  }, [active]);

  // After the swap, ease the panel from its old height to its new one and fade back in.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const from = fromHeight.current;
    fromHeight.current = null;
    if (!panel || from == null) return;
    panel.style.transition = 'none';
    panel.style.height = 'auto';
    const to = panel.offsetHeight;
    panel.style.height = `${from}px`;
    panel.getBoundingClientRect();
    panel.style.transition = '';
    panel.style.height = `${to}px`;
    setFading(false);
    const t = setTimeout(() => {
      panel.style.height = '';
    }, RESIZE_MS);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [shown]);

  const step = (dir) => {
    const el = stripRef.current;
    const card = el?.querySelector('figure');
    if (!card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: 'smooth' });
  };

  return (
    <div className="pursuits">
      <div className="segmented" role="tablist" aria-label="Outside work">
        {thumb && <span className="segmented-thumb" style={{ width: thumb.w, transform: `translateX(${thumb.x}px)` }} />}
        {PURSUITS.map((item, i) => (
          <button
            key={item.title}
            ref={(el) => (tabRefs.current[i] = el)}
            role="tab"
            id={`pursuit-tab-${i}`}
            aria-selected={i === active}
            aria-controls="pursuit-panel"
            className={i === active ? 'is-active' : undefined}
            onClick={() => setActive(i)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div
        className={fading ? 'pursuit is-fading' : 'pursuit'}
        id="pursuit-panel"
        role="tabpanel"
        aria-labelledby={`pursuit-tab-${active}`}
        ref={panelRef}
      >
        <div className="pursuit-carousel">
          <div className="pursuit-photos" ref={stripRef} onScroll={updateEdges}>
            {p.photos.map((ph) => (
              <figure key={ph.src}>
                <img src={ph.src} alt={ph.alt} loading="lazy" />
                {ph.caption && <figcaption>{ph.caption}</figcaption>}
              </figure>
            ))}
          </div>
          {!(edges.start && edges.end) && (
            <div className="pursuit-arrows">
              <button aria-label="Previous photos" onClick={() => step(-1)} disabled={edges.start}>
                ‹
              </button>
              <button aria-label="Next photos" onClick={() => step(1)} disabled={edges.end}>
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
