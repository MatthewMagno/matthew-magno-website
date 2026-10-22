import React, { useEffect, useState } from 'react';
import { PhoneFrame } from './Phone.jsx';

// Mirrors the Memori app (date-jar-app) as it ships: the Jar tab with the
// "your last pull" card, the + menu, the new-idea and idea sheets, making a
// memory, the sealed stamp, the Log shoebox, a held print, and the Us tab.
// Sample data is the app's own seeded demo couple, Mia & Sam.

const photo = (name) => `./demo/memori-${name}.jpg`;

const ENERGY = ['cozy', 'out & about', 'big night', 'active'];
const SPEND = ['free', '$', '$$', '$$$'];
const WEATHER = ['indoors', 'outdoors', 'hot', 'cold'];
const FOOD = ['italian', 'mexican', 'asian', 'american', 'coffee', 'dessert', 'drinks'];
const DURATION = ['quick', 'evening', 'half-day+', 'weekend'];
const CATEGORIES = [
  { key: 'energy', label: 'Energy', options: ENERGY },
  { key: 'spend', label: 'Price', options: SPEND },
  { key: 'weather', label: 'Weather', options: WEATHER },
  { key: 'food', label: 'Food', options: FOOD },
  { key: 'duration', label: 'Time', options: DURATION },
];

const slip = (id, title, energy, spend, weather, by, extra = {}) => ({ id, title, energy, spend, weather, by, ...extra });

const SLIPS = [
  slip('golf', 'That rooftop mini-golf place', ['out & about'], ['$$'], ['outdoors'], 'You', { tossed: 'September', img: photo('lookout') }),
  slip('drivein', 'Drive-in movie with the good blankets', ['cozy'], ['free'], ['outdoors'], 'Sam', { link: true, tossed: 'September', img: photo('sunset') }),
  slip('drivein2', 'Drive-in movie, any movie', ['cozy'], ['free'], ['outdoors'], 'You', { tossed: 'August' }),
  slip('omakase', 'Omakase counter for the anniversary', ['big night'], ['$$$'], ['indoors'], 'Sam', { tossed: 'August', img: photo('storefront') }),
  slip('market', 'Night market food crawl', ['big night'], ['$$'], ['outdoors'], 'Sam', { link: true, tossed: 'July', dust: '3 months', dustAt: 5, img: photo('fireworks') }),
  slip('pasta', 'Learn to make pasta from scratch', ['cozy'], ['$'], ['indoors'], 'You', { tossed: 'May', dust: '5 months', dustAt: 3, img: photo('farmers') }),
  slip('books', 'Bookstore date — pick each other’s next read', ['out & about'], ['$'], ['indoors'], 'You', { tossed: 'May', dust: '5 months', dustAt: 4, img: photo('flowers') }),
  slip('ramen', 'That tiny ramen bar on 5th', ['out & about'], ['$$'], ['indoors'], 'You', { tossed: 'April', dust: '6 months', dustAt: 2, img: photo('ramen') }),
  slip('firstmeal', 'Cook the first meal you ever ate together', ['cozy'], ['$'], ['indoors'], 'starter set', { tossed: 'March', dust: '7 months', dustAt: 1, img: photo('diner') }),
];

const LAST_PULL = slip('picnic', 'Sunset picnic at Miller Point', ['cozy'], ['free'], ['outdoors'], 'Sam', { img: photo('trail') });

const memory = (no, title, month, day, year, img, extra = {}) => ({ id: `m${no}`, no, title, month, day, year, img, ...extra });

// Several dates a month, so the Log reads like a full shoebox. Nº follows date order.
const MEMORIES = [
  memory(16, 'Board game café, best of seven', 'June', 21, 2026, photo('games'), { note: 'you still owe me a rematch' }),
  memory(15, 'That tiny ramen bar on 5th', 'June', 2, 2026, photo('ramen')),
  memory(14, 'Ceramics class downtown', 'May', 24, 2026, photo('ceramics'), { note: 'one bowl, slightly lopsided' }),
  memory(13, 'Farmers market breakfast run', 'May', 10, 2026, photo('farmers'), { note: 'croissants, then more croissants' }),
  memory(12, 'Bowling, loser buys tacos', 'April', 18, 2026, photo('tacos')),
  memory(11, 'Drive out to the lookout', 'April', 5, 2026, photo('lookout')),
  memory(10, 'Desert trail at golden hour', 'March', 22, 2026, photo('trail')),
  memory(9, 'Museum date, the long way home', 'March', 7, 2026, photo('road')),
  memory(8, 'Thrift store challenge', 'February', 14, 2026, photo('flowers'), { note: 'you in that jacket' }),
  memory(7, 'Sunset drive, no destination', 'February', 1, 2026, photo('sunset')),
  memory(6, 'Fireworks from the roof', 'December', 31, 2025, photo('fireworks'), { note: 'midnight, freezing, worth it' }),
  memory(5, 'Hot pot night', 'December', 12, 2025, photo('diner')),
  memory(4, 'First snow walk', 'November', 20, 2025, photo('trees'), { note: 'cold hands, warm everything else' }),
  memory(3, 'The pier, freezing', 'November', 8, 2025, photo('pier')),
  memory(2, 'Karaoke until they kicked us out', 'October', 21, 2025, photo('karaoke')),
  memory(1, 'Dinner at the corner spot', 'October', 3, 2025, photo('storefront')),
];

const PICKS = [photo('trail'), photo('pier'), photo('tacos')];
const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
  'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
const numWord = (n) => WORDS[n] ?? String(n);
const meta = (s) => [...s.energy, ...s.spend, ...s.weather, ...(s.food ?? []), ...(s.duration ?? []), s.by].join(' · ');
const stamp = (m) => `${m.month.toUpperCase()} ${m.day}`;
const monthHeader = (m) => (m.year === 2026 ? m.month.toUpperCase() : `${m.month.toUpperCase()} ${m.year}`);

export default function MemoriDemo() {
  const [key, setKey] = useState(0);
  return (
    <PhoneFrame label="Memori demo" onRestart={() => setKey((k) => k + 1)}>
      <Memori key={key} />
    </PhoneFrame>
  );
}

function Memori() {
  const [tab, setTab] = useState('jar');
  const [slips, setSlips] = useState(SLIPS);
  const [hearts, setHearts] = useState(() => new Set());
  const [dusted, setDusted] = useState(() => new Set());
  const [lastPull, setLastPull] = useState(LAST_PULL);
  const [memories, setMemories] = useState(MEMORIES);
  const [route, setRoute] = useState(null); // 'memory' | 'sealed'
  const [sealed, setSealed] = useState(null);
  const [plus, setPlus] = useState(false);
  const [sheet, setSheet] = useState(null); // { kind: 'new' | 'detail' | 'edit', slip }
  const [print, setPrint] = useState(null);
  const [toast, setToast] = useState(null);
  const labels = useLabelWindow();

  const showToast = (t) => {
    setToast({ ...t, id: Date.now() });
  };
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const toss = (draft) => {
    const s = { id: `s${Date.now()}`, energy: [], spend: [], weather: [], food: [], duration: [], by: 'You', tossed: 'October', fresh: true, ...draft };
    setSlips((list) => [s, ...list]);
    setSheet(null);
    showToast({ text: `In it goes — ${slips.length + 1} and counting`, undo: () => setSlips((list) => list.filter((x) => x.id !== s.id)) });
  };

  const seal = (img) => {
    const no = memories.length + 1;
    const m = memory(no, lastPull.title, 'October', 20, 2026, img, { tags: [...lastPull.energy, ...lastPull.spend, ...lastPull.weather], fresh: true });
    setMemories((list) => [m, ...list]);
    setSealed(m);
    setLastPull(null);
    setRoute('sealed');
  };

  const openSlip = (s) => {
    setDusted((d) => new Set(d).add(s.id));
    setSheet({ kind: 'detail', slip: s });
  };

  return (
    <div className="demo demo-mem">
      <div className={`mem-tabs ${route ? 'is-covered' : ''}`}>
        <div className={`mem-tab ${tab === 'jar' ? 'is-on' : ''}`}>
          <Jar
            slips={slips}
            hearts={hearts}
            dusted={dusted}
            lastPull={lastPull}
            onHeart={(id) => setHearts((h) => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n; })}
            onOpen={openSlip}
            onAddPhotos={() => setRoute('memory')}
            onNotNow={() => setLastPull(null)}
          />
        </div>
        <div className={`mem-tab ${tab === 'log' ? 'is-on' : ''}`}>
          <Log memories={memories} onOpen={setPrint} />
        </div>
        <div className={`mem-tab ${tab === 'us' ? 'is-on' : ''}`}>
          <Us memories={memories} slips={slips} />
        </div>

        <div className="mem-fade" />
        <TabBar tab={tab} onTab={(t) => { setTab(t); setPlus(false); }} labels={labels} />
        <PlusMenu
          open={plus}
          onToggle={() => setPlus((p) => !p)}
          onIdea={() => { setPlus(false); setSheet({ kind: 'new' }); }}
          onMemory={() => { setPlus(false); if (lastPull) setRoute('memory'); else { setTab('log'); } }}
        />

        {sheet?.kind === 'new' && <IdeaSheet onClose={() => setSheet(null)} onToss={toss} />}
        {sheet?.kind === 'detail' && (
          <DetailSheet
            slip={sheet.slip}
            onClose={() => setSheet(null)}
            onEdit={() => setSheet({ kind: 'edit', slip: sheet.slip })}
            onDelete={() => {
              setSlips((list) => list.filter((x) => x.id !== sheet.slip.id));
              setSheet(null);
            }}
          />
        )}
        {sheet?.kind === 'edit' && (
          <EditSheet
            slip={sheet.slip}
            onClose={() => setSheet(null)}
            onSave={(next) => {
              setSlips((list) => list.map((x) => (x.id === next.id ? next : x)));
              setSheet(null);
            }}
          />
        )}
        {print && <PrintDetail memory={print} memories={memories} onClose={() => setPrint(null)} />}
        {toast && (
          <div className="mem-toast" key={toast.id}>
            <span>{toast.text}</span>
            {toast.undo && <button onClick={() => { toast.undo(); setToast(null); }}>Undo</button>}
          </div>
        )}
      </div>

      {route === 'memory' && lastPull && <MakeMemory slip={lastPull} onClose={() => setRoute(null)} onSeal={seal} />}
      {route === 'sealed' && sealed && (
        <Sealed
          memory={sealed}
          count={memories.length}
          onLog={() => { setTab('log'); setRoute(null); }}
          onIdeas={() => { setTab('jar'); setRoute(null); }}
        />
      )}
    </div>
  );
}

// Every tab label shows for the session's first four seconds, then fades for good.
function useLabelWindow() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 4000);
    return () => clearTimeout(t);
  }, []);
  return on;
}

/* ---------- Jar ---------- */

function Jar({ slips, hearts, dusted, lastPull, onHeart, onOpen, onAddPhotos, onNotNow }) {
  const dust = slips.filter((s) => s.dust && !dusted.has(s.id)).sort((a, b) => a.dustAt - b.dustAt);
  const count = (key) => slips.filter((s) => s[key]?.length).length;

  return (
    <div className="mem-scroll">
      <header className="mem-title">
        <div>
          <span className="mem-eyebrow">Jar · Mia &amp; Sam</span>
          <h1>Ideas</h1>
        </div>
        <span className="mem-count">{String(slips.length).padStart(2, '0')}</span>
      </header>

      {lastPull && (
        <section className="mem-lastpull">
          <span className="mem-lastpull-eyebrow">Your last pull</span>
          <div className="mem-lastpull-row">
            <div>
              <h2>{lastPull.title}</h2>
              <p>How’d it go? Add a photo and it becomes a memory.</p>
            </div>
            <button className="mem-pill hint" onClick={onAddPhotos}>Add photos</button>
          </div>
          <button className="mem-notnow" onClick={onNotNow}>Not now</button>
        </section>
      )}

      {dust.length > 0 && (
        <section className="mem-dust">
          <h3>Not looked at in a while</h3>
          <div className="mem-dust-rail">
            {dust.map((s) => (
              <button key={s.id} className="mem-dust-card" onClick={() => onOpen(s)}>
                <span className={`mem-dust-tile ${s.img ? 'has-photo' : ''}`} style={s.img ? { '--photo': `url(${s.img})` } : undefined}>
                  <span className="mem-dust-age">{s.dust}</span>
                  <span className="mem-dust-title">{s.title}</span>
                </span>
                <span className="mem-dust-meta">{[...s.spend, ...s.weather].join(' · ')}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mem-filters">
        <span className="mem-filter"><Icon name="energy" />Energy {count('energy')}</span>
        <span className="mem-filter"><Icon name="price" />Price {count('spend')}</span>
        <span className="mem-filter"><Icon name="weather" />Weather {count('weather')}</span>
      </div>

      <ul className="mem-rows">
        {slips.map((s) => (
          <li key={s.id} className={`mem-row ${s.fresh ? 'is-fresh' : ''}`}>
            <button className="mem-row-main" onClick={() => onOpen(s)}>
              {s.img ? <img className="mem-thumb" src={s.img} alt="" /> : s.link && <span className="mem-thumb mem-stripes" />}
              <span className="mem-row-text">
                <span className="mem-row-title">{s.title}</span>
                <span className="mem-row-meta">{meta(s)}</span>
              </span>
            </button>
            <button className={`mem-heart ${hearts.has(s.id) ? 'is-on' : ''}`} onClick={() => onHeart(s.id)} aria-label={hearts.has(s.id) ? 'Unheart' : 'Heart'}>
              <svg viewBox="0 0 20 20" width="22" height="22"><path d="M10 17.2S2.5 12.6 2.5 7.3A4 4 0 0 1 10 5a4 4 0 0 1 7.5 2.3C17.5 12.6 10 17.2 10 17.2z" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Tab bar + add menu ---------- */

function TabBar({ tab, onTab, labels }) {
  const items = [
    { id: 'jar', label: 'Jar', icon: 'jar' },
    { id: 'log', label: 'Log', icon: 'log' },
    { id: 'us', label: 'Us', icon: 'us' },
  ];
  const at = items.findIndex((i) => i.id === tab);
  return (
    <nav className={`mem-tabbar ${labels ? 'has-labels' : ''}`}>
      <span className="mem-tabbar-on" style={{ transform: `translateX(${at * 77.5}px)` }} />
      {items.map((i) => (
        <button key={i.id} className={tab === i.id ? 'is-on' : ''} onClick={() => onTab(i.id)} aria-label={i.label}>
          <Icon name={i.icon} size={30} />
          <span>{i.label}</span>
        </button>
      ))}
    </nav>
  );
}

function PlusMenu({ open, onToggle, onIdea, onMemory }) {
  return (
    <>
      <div className={`mem-plus-menu ${open ? 'is-open' : ''}`} {...(!open && { inert: '' })}>
        <button className="mem-plus-item" style={{ '--i': 1 }} onClick={onIdea}>
          <span className="mem-glass mem-plus-label" style={{ width: 80 }}>Idea</span>
          <span className="mem-glass mem-plus-icon"><Icon name="idea" size={26} /></span>
        </button>
        <button className="mem-plus-item" style={{ '--i': 0 }} onClick={onMemory}>
          <span className="mem-glass mem-plus-label" style={{ width: 104 }}>Memory</span>
          <span className="mem-glass mem-plus-icon"><Icon name="memory" size={26} /></span>
        </button>
      </div>
      <button className={`mem-glass mem-plus ${open ? 'is-open' : ''}`} onClick={onToggle} aria-label={open ? 'Close' : 'Add'}>
        <svg viewBox="0 0 20 20" width="22" height="22"><path d="M10 3v14M3 10h14" stroke="#150F0A" strokeWidth="2.2" strokeLinecap="round" /></svg>
      </button>
    </>
  );
}

/* ---------- Sheets ---------- */

function Categories({ values, onChange }) {
  return (
    <div className="mem-cats">
      <p className="mem-cats-head">Categories <span>(optional)</span></p>
      {CATEGORIES.map((c) => {
        const v = values[c.key]?.[0];
        const cycle = () => {
          const i = v ? c.options.indexOf(v) + 1 : 0;
          onChange(c.key, i < c.options.length ? [c.options[i]] : []);
        };
        return (
          <button key={c.key} className="mem-cat" onClick={cycle}>
            <span>{c.label}</span>
            <span className={v ? 'is-set' : ''}>{v ?? 'Any'}</span>
            <i>▾</i>
          </button>
        );
      })}
    </div>
  );
}

function IdeaSheet({ onClose, onToss }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState({});
  const [closing, setClosing] = useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 220); };

  return (
    <div className={`mem-dim ${closing ? 'is-closing' : ''}`} onClick={close}>
      <div className="mem-card-sheet" onClick={(e) => e.stopPropagation()}>
        <span className="mem-sheet-eyebrow">New idea</span>
        <button className="mem-x-circle" onClick={close} aria-label="Close">✕</button>
        <h2 className="mem-sheet-title">Add an Idea or <u>Paste a Link</u></h2>
        <span className="mem-dashes" />
        <input
          className={`mem-title-input ${title ? 'has-value' : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="That rooftop mini-golf place"
          aria-label="Idea"
        />
        <span className="mem-helper">Currently only Google Maps and TikTok links are supported</span>
        <button className="mem-add-photos">
          <b>+</b>
          Add photos
        </button>
        <textarea className="mem-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="A line to jog your memory… (optional)" />
        <Categories values={tags} onChange={(k, v) => setTags((t) => ({ ...t, [k]: v }))} />
        <button className="mem-primary" disabled={!title.trim()} onMouseDown={(e) => e.preventDefault()} onClick={() => onToss({ title: title.trim(), ...tags })}>
          Toss it in
        </button>
      </div>
    </div>
  );
}

function BottomSheet({ onClose, children, className = '' }) {
  const [closing, setClosing] = useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 260); };
  return (
    <div className={`mem-dim mem-dim-bottom ${closing ? 'is-closing' : ''}`} onClick={close}>
      <div className={`mem-bottom-sheet ${className}`} onClick={(e) => e.stopPropagation()}>
        <span className="mem-grabber" />
        {children(close)}
      </div>
    </div>
  );
}

function DetailSheet({ slip: s, onClose, onEdit, onDelete }) {
  const tags = [...s.energy, ...s.spend, ...s.weather, ...(s.food ?? []), ...(s.duration ?? [])];
  const who = s.by === 'You' ? 'You' : s.by === 'starter set' ? 'From the starter set' : s.by;
  return (
    <BottomSheet onClose={onClose}>
      {(close) => (
        <div className="mem-detail">
          {s.img && <img className="mem-detail-photo" src={s.img} alt="" />}
          <h2>{s.title}</h2>
          {tags.length > 0 && (
            <div className="mem-chips">
              {tags.map((t) => <span key={t} className="mem-chip">{t}</span>)}
            </div>
          )}
          <p className="mem-detail-who">{who} tossed this in · {s.tossed}</p>
          <button className="mem-soft-btn" onClick={onEdit}>Edit this idea</button>
          <button className="mem-danger" onClick={() => { close(); setTimeout(onDelete, 260); }}>Delete this idea</button>
        </div>
      )}
    </BottomSheet>
  );
}

function EditSheet({ slip: s, onClose, onSave }) {
  const [title, setTitle] = useState(s.title);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState({ energy: s.energy, spend: s.spend, weather: s.weather, food: s.food ?? [], duration: s.duration ?? [] });
  return (
    <BottomSheet onClose={onClose} className="mem-edit">
      {(close) => (
        <>
          <div className="mem-edit-head">
            <span>Edit this idea</span>
            <button onClick={close} aria-label="Close">✕</button>
          </div>
          <button className="mem-add-photos">
            <b>+</b>
            Add photos
          </button>
          <input className="mem-edit-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
          <textarea className="mem-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="A line to jog your memory… (optional)" />
          <Categories values={tags} onChange={(k, v) => setTags((t) => ({ ...t, [k]: v }))} />
          <button className="mem-primary" disabled={!title.trim()} onClick={() => { close(); setTimeout(() => onSave({ ...s, ...tags, title: title.trim() }), 260); }}>
            Save changes
          </button>
        </>
      )}
    </BottomSheet>
  );
}

/* ---------- Make it a memory → sealed ---------- */

function MakeMemory({ slip: s, onClose, onSeal }) {
  const [img, setImg] = useState(null);
  const [note, setNote] = useState('');
  const [sealing, setSealing] = useState(false);
  const pick = () => setImg((cur) => PICKS[(PICKS.indexOf(cur) + 1) % PICKS.length]);
  const seal = () => {
    setSealing(true);
    setTimeout(() => onSeal(img), 1400);
  };

  return (
    <div className="mem-route mem-make">
      <div className={`mem-make-card ${img ? 'has-photo' : ''} ${sealing ? 'is-sealing' : ''}`}>
        <span className="mem-tape mem-make-tape" />
        <button className="mem-make-x" onClick={onClose} aria-label="Close">✕</button>
        <span className="mem-make-eyebrow">Make it a memory</span>
        {sealing ? (
          <img className="mem-make-thumb" src={img} alt="" />
        ) : img ? (
          <button className="mem-make-photo" onClick={pick}>
            <img src={img} alt="" />
            <span>Main</span>
          </button>
        ) : (
          <button className="mem-make-add hint" onClick={pick}>
            <b>+</b>
            Add photos
          </button>
        )}
        <span className="mem-make-title">{s.title}</span>
        <span className="mem-make-date">{sealing ? 'OCTOBER 20' : <>OCTOBER 20 &nbsp;· tap to change date</>}</span>
        <input className="mem-make-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="add a note…" aria-label="Note" disabled={sealing} />
        <span className="mem-make-rule" />
        {sealing && <p className="mem-make-upload">Uploading 1 of 1… Safe either way.</p>}
      </div>
      <button className={`mem-seal ${img && !sealing ? 'hint' : ''} ${sealing ? 'is-sealed' : ''}`} disabled={!img} onClick={sealing ? undefined : seal}>
        {sealing ? (
          <>
            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sealed
          </>
        ) : 'Seal it into the log'}
      </button>
    </div>
  );
}

function Sealed({ memory: m, count, onLog, onIdeas }) {
  return (
    <div className="mem-route mem-sealed">
      <div className="mem-sealed-print">
        <span className="mem-tape mem-sealed-tape" />
        <img src={m.img} alt="" />
        <span className="mem-sealed-caption">{m.title}</span>
        <Stamp className="mem-sealed-stamp" m={m} />
      </div>
      <span className="mem-sealed-eyebrow">Sealed into the log</span>
      <h2>{numWord(count)} dates and counting</h2>
      <p>Sam will see it the moment they open the app.</p>
      <div className="mem-sealed-actions">
        <button className="mem-wide hint" onClick={onLog}>See it on the timeline</button>
        <button className="mem-quiet" onClick={onIdeas}>Back to your ideas</button>
      </div>
    </div>
  );
}

function Stamp({ m, className }) {
  return (
    <span className={`mem-stamp ${className ?? ''}`}>
      {stamp(m)} · N<sup>º</sup> {m.no}
    </span>
  );
}

/* ---------- Log ---------- */

function Log({ memories, onOpen }) {
  const [filter, setFilter] = useState('all');
  const tagCounts = {};
  memories.forEach((m) => (m.tags ?? []).forEach((t) => { tagCounts[t] = (tagCounts[t] ?? 0) + 1; }));
  const shown = filter === 'all' ? memories : memories.filter((m) => m.tags?.includes(filter));
  const onThisDay = memories.find((m) => m.month === 'October' && m.day === 21 && m.year === 2025);

  const groups = [];
  shown.forEach((m) => {
    const h = monthHeader(m);
    const last = groups[groups.length - 1];
    if (last && last.h === h) last.items.push(m);
    else groups.push({ h, items: [m] });
  });

  return (
    <div className="mem-scroll">
      <header className="mem-log-head">
        <div>
          <span className="mem-eyebrow mem-eyebrow-log">The log</span>
          <h1>{memories.length} dates in</h1>
        </div>
        <Icon name="search" size={14} className="mem-log-search" />
        <span className="mem-views">
          <span className="is-on"><Icon name="grid" size={14} /></span>
          <i />
          <span><Icon name="list" size={14} /></span>
          <i />
          <span><Icon name="cal" size={14} /></span>
        </span>
      </header>

      {Object.keys(tagCounts).length > 0 && (
        <div className="mem-log-chips">
          <button className={filter === 'all' ? 'is-on' : ''} onClick={() => setFilter('all')}>all</button>
          {Object.entries(tagCounts).map(([t, n]) => (
            <button key={t} className={filter === t ? 'is-on' : ''} onClick={() => setFilter(filter === t ? 'all' : t)}>{t} · {n}</button>
          ))}
        </div>
      )}

      {onThisDay && filter === 'all' && (
        <button className="mem-otd" onClick={() => onOpen(onThisDay)}>
          <span className="mem-otd-thumb"><img src={onThisDay.img} alt="" /></span>
          <span className="mem-otd-tape" />
          <span>
            <span className="mem-otd-eyebrow">On this day, last year</span>
            <span className="mem-otd-title">{onThisDay.title}</span>
          </span>
        </button>
      )}

      {groups.map((g) => (
        <section key={g.h} className="mem-month">
          <h2>— {g.h} —</h2>
          <div className="mem-shoebox">
            {[0, 1].map((col) => (
              <div key={col} className="mem-shoebox-col">
                {g.items.filter((_, i) => i % 2 === col).map((m) => (
                  <button
                    key={m.id}
                    className={`mem-print ${m.fresh ? 'is-fresh' : ''}`}
                    style={{ '--r': `${((m.no * 37) % 5) * 0.5 - 1.2}deg` }}
                    onClick={() => onOpen(m)}
                  >
                    {m.no % 2 === 0 && <span className="mem-tape mem-print-tape" />}
                    <img src={m.img} alt="" />
                    <span className="mem-print-caption">{m.title}</span>
                    <Stamp className="mem-print-stamp" m={m} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function PrintDetail({ memory: m, onClose }) {
  const [closing, setClosing] = useState(false);
  const [note, setNote] = useState('');
  const close = () => { setClosing(true); setTimeout(onClose, 260); };
  return (
    <div className={`mem-held ${closing ? 'is-closing' : ''}`} onClick={close}>
      <div className="mem-held-inner" onClick={(e) => e.stopPropagation()}>
        <div className="mem-held-bar">
          <button className="mem-glass-circle" onClick={close} aria-label="Back">←</button>
          <span className="mem-held-grab" />
          <button className="mem-glass-circle" aria-label="More">⋯</button>
        </div>
        <div className="mem-held-print">
          <img src={m.img} alt="" />
          <span className="mem-held-caption">{m.title}</span>
          <span className="mem-held-stamp">{stamp(m)} · Nº {m.no}</span>
        </div>
        {m.note && <p className="mem-held-note">“{m.note}”</p>}
        <label className="mem-held-reply">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Leave a note for Sam…" />
          <span>Edit ✎</span>
        </label>
      </div>
    </div>
  );
}

/* ---------- Us ---------- */

function Us({ memories, slips }) {
  return (
    <div className="mem-scroll mem-us">
      <div className="mem-us-prints">
        <div className="mem-us-print mem-us-mia">
          <span className="mem-tape mem-us-tape" />
          <span className="mem-us-face">M</span>
          <span className="mem-us-name">Mia</span>
          <span className="mem-us-add">+</span>
        </div>
        <div className="mem-us-print mem-us-sam">
          <span className="mem-us-tape mem-us-tape-b" />
          <span className="mem-us-face">S</span>
          <span className="mem-us-name">Sam</span>
        </div>
      </div>
      <span className="mem-us-est">Mia &amp; Sam · Est. 2025</span>
      <h2 className="mem-us-title">{numWord(memories.length)} dates in, {numWord(slips.length).toLowerCase()} waiting</h2>
      <div className="mem-us-card mem-us-name-row">
        <span>Your name</span>
        <span>
          Mia ›
          <small>mia@demo.datejar</small>
        </span>
      </div>
      <div className="mem-us-card mem-us-story">
        <span className="mem-us-story-head">Your story so far</span>
        <div>
          <span><b>{memories.length}</b><small>dates sealed</small></span>
          <span><b className="is-dash">—</b><small>together since</small></span>
        </div>
      </div>
      <button className="mem-us-keepsake">Get Keepsake+</button>
      <button className="mem-us-card mem-us-settings">Settings <span>›</span></button>
      <p className="mem-us-foot">Memori · made for two</p>
    </div>
  );
}

/* ---------- Icons (paths copied from the app) ---------- */

function Icon({ name, size = 15, className }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinejoin: 'round', strokeLinecap: 'round' };
  const p = {
    energy: <path d="M11 2 4.5 11.5h4.2L8 18l7.5-10H11l1.8-6z" {...common} strokeWidth="1.5" />,
    price: <path d="M10 2.5v15M13.2 5.6c-.6-.9-1.8-1.5-3.2-1.5-2 0-3.6 1.1-3.6 2.9 0 3.9 6.8 2 6.8 5.8 0 1.8-1.6 2.9-3.6 2.9-1.4 0-2.6-.6-3.2-1.5" {...common} strokeWidth="1.5" />,
    weather: (
      <g {...common} strokeWidth="1.5">
        <circle cx="7.2" cy="6.6" r="2.6" />
        <path d="M7.2 2.4v1M7.2 9.8v1M3 6.6h1M10.4 6.6h1M4.4 3.8l.7.7M9.3 3.8l-.7.7" />
        <path d="M6 17h7.5a3 3 0 0 0 .5-5.96 4 4 0 0 0-7.7-1.3A3.3 3.3 0 0 0 6 17z" />
      </g>
    ),
    jar: (
      <g {...common} strokeWidth="1.6">
        <path d="M10 2.5a5 5 0 0 0-2.7 9.2c.5.4.7 1 .7 1.6v.7h4v-.7c0-.6.2-1.2.7-1.6A5 5 0 0 0 10 2.5z" />
        <path d="M8.3 16.5h3.4M8.7 18h2.6" />
      </g>
    ),
    us: (
      <g {...common} strokeWidth="1.6">
        <circle cx="7.3" cy="10" r="5.3" />
        <circle cx="12.7" cy="10" r="5.3" />
      </g>
    ),
    idea: (
      <g {...common} strokeWidth="1.5">
        <path d="M10 2.6a4.6 4.6 0 0 0-2.5 8.5c.45.35.6.9.6 1.4v.6h3.8v-.6c0-.5.15-1.05.6-1.4A4.6 4.6 0 0 0 10 2.6z" />
        <path d="M8.4 15.8h3.2M8.9 17.3h2.2" />
      </g>
    ),
    memory: (
      <g {...common} strokeWidth="1.5">
        <rect x="4" y="3" width="12" height="14" rx="1" />
        <rect x="6" y="5" width="8" height="6.4" rx="0.6" />
        <path d="M7.6 14.2h4.8" />
      </g>
    ),
    search: (
      <g {...common} strokeWidth="1.6">
        <circle cx="9" cy="9" r="6.5" />
        <path d="M14 14l4.5 4.5" />
      </g>
    ),
    grid: (
      <g {...common} strokeWidth="1.7">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </g>
    ),
    list: <path d="M2 4h16M2 10h16M2 16h16" {...common} strokeWidth="1.7" />,
    cal: (
      <g {...common} strokeWidth="1.7">
        <rect x="2" y="3.5" width="16" height="14.5" rx="2" />
        <path d="M2 8h16M6 2v3M14 2v3" />
      </g>
    ),
  }[name];
  if (name === 'log') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
        <g {...common} strokeWidth="1.7">
          <rect x="5" y="3.5" width="14" height="17" rx="2.2" />
          <path d="M8.6 3.5v17M11.6 8h4.2M11.6 11.5h4.2" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className}>
      {p}
    </svg>
  );
}
