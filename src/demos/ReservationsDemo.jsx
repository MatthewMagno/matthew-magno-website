import React, { useEffect, useRef, useState } from 'react';
import { PhoneFrame, Stack, useStack } from './Phone.jsx';

// Mirrors the Reservations app (reservations repo) with its own demo account:
// the Timeline with the soonest booking as a full wallet ticket and the rest
// folded, the per-category detail views, New reservation, Past and Profile.
// Times are the demo seeds read in Pacific time, on Wednesday, Oct 21.

const CAT = {
  restaurant: { color: '#B65C4E', rgb: '182,92,78', name: 'Restaurant', chip: 'Restaurant' },
  flight: { color: '#3A75AF', rgb: '58,117,175', name: 'Flight', chip: 'Flight' },
  hotel: { color: '#7860A0', rgb: '120,96,160', name: 'Hotel', chip: 'Hotel' },
  car: { color: '#27786B', rgb: '39,120,107', name: 'Car rental', chip: 'Car' },
  event: { color: '#A37734', rgb: '163,119,52', name: 'Event', chip: 'Event' },
  appointment: { color: '#31858E', rgb: '49,133,142', name: 'Appointment', chip: 'Appointment' },
  delivery: { color: '#4B8358', rgb: '75,131,88', name: 'Delivery', chip: 'Delivery' },
};
const ORDER = ['restaurant', 'flight', 'hotel', 'car', 'event', 'appointment', 'delivery'];
const art = (cat) => `./demo/res-${cat}.png`;

const DAYS = {
  21: { title: 'October 21, 2026', weekday: 'Wednesday', band: 'Wed, Oct 21' },
  22: { title: 'October 22, 2026', weekday: 'Thursday', band: 'Thu, Oct 22' },
  24: { title: 'October 24, 2026', weekday: 'Saturday', band: 'Sat, Oct 24' },
  26: { title: 'October 26, 2026', weekday: 'Monday', band: 'Mon, Oct 26' },
};

const INITIAL = [
  {
    id: 'amazon', cat: 'delivery', day: 21, title: 'Package from Amazon', sub: 'Out for delivery · UPS', time: 'By 5 PM',
    code: '113-2284915-8800', logo: 'AM', band: 'Delivery · Amazon', email: 'shipment-tracking@amazon.com', received: 'Oct 16, 10:00 AM',
  },
  {
    id: 'nobu', cat: 'restaurant', day: 21, title: 'Dinner at Nobu', sub: 'Party of 4 · Nobu Malibu', time: '7:30 PM',
    code: 'NB4821', logo: 'OP', band: 'Restaurant · Japanese', email: 'reservations@opentable.com', received: 'Oct 16, 10:00 AM',
  },
  {
    id: 'dentist', cat: 'appointment', day: 22, title: 'Dentist check-up', sub: 'Dr. Anita Patel · Suite 210', time: '9:00 AM',
    logo: 'BS', band: 'Appointment · Dental', email: 'noreply@brightsmile.com', received: 'Oct 17, 10:00 AM',
  },
  {
    id: 'flight', cat: 'flight', day: 24, title: 'SFO to JFK', sub: 'UAL1234 · SFO → JFK', time: '7:00 AM',
    code: 'XK92LM', logo: 'UA', band: 'Flight · United Airlines', email: 'confirmations@united.com', received: 'Oct 19, 10:00 AM',
  },
  {
    id: 'hertz', cat: 'car', day: 24, title: 'Hertz pickup', sub: 'Hertz · Compact · JFK Airport, Terminal 4', time: '8:00 AM',
    code: 'HZ553201', logo: 'HE', band: 'Car rental', email: 'reservations@hertz.com', received: 'Oct 19, 10:00 AM',
  },
  {
    id: 'standard', cat: 'hotel', day: 24, title: 'The Standard, NYC', sub: '3 nights · The Standard, High Line', time: '12:00 PM',
    code: 'HT77310', logo: 'BC', band: 'Hotel', email: 'bookings@booking.com', received: 'Oct 19, 10:00 AM',
  },
  {
    id: 'dune', cat: 'event', day: 26, title: 'Dune: Part Three', sub: 'AMC Metreon 16', time: '7:30 PM',
    code: 'FD-51722', logo: 'FA', band: 'Event · Movie', email: 'tickets@fandango.com', received: 'Oct 18, 10:00 AM',
  },
];

const PAST = [
  { id: 'etsy', cat: 'delivery', when: 'Oct 20 · 3:00 PM', title: 'Package from Etsy', sub: 'Delivered · USPS' },
  { id: 'haircut', cat: 'appointment', when: 'Oct 18 · 2:00 PM', title: 'Haircut', sub: 'Barber & Co', cancelled: true },
];

const BARS = [2, 4, 2, 2, 5, 2, 3, 2, 4, 2, 2, 3, 5, 2];

export default function ReservationsDemo() {
  const nav = useStack('home');
  const [items, setItems] = useState(INITIAL);
  const [tab, setTab] = useState('timeline');
  const [flash, setFlash] = useState(null);
  const [key, setKey] = useState(0);

  const restart = () => {
    setItems(INITIAL);
    setTab('timeline');
    setFlash(null);
    setKey((k) => k + 1);
    nav.reset();
  };

  const add = (item) => {
    setItems((list) => {
      const i = list.findIndex((x) => x.day > item.day);
      const next = [...list];
      next.splice(i < 0 ? list.length : i, 0, item);
      return next;
    });
    setTab('timeline');
    setFlash(item.id);
    setTimeout(() => setFlash(null), 900);
    nav.pop();
  };

  const render = (entry) => {
    switch (entry.name) {
      case 'home':
        return (
          <div className="res-screen">
            {tab === 'timeline' && (
              <Timeline key={key} items={items} flash={flash} onOpen={(item) => nav.push('detail', 'push', { item })} />
            )}
            {tab === 'past' && <Past />}
            {tab === 'profile' && <Profile />}
            <Dock tab={tab} onTab={setTab} />
            {tab === 'timeline' && (
              <button className="res-fab" onClick={() => nav.push('add', 'sheet')} aria-label="Add reservation">
                <Icon name="plus" size={28} />
              </button>
            )}
          </div>
        );
      case 'detail':
        return <Detail item={entry.props.item} onBack={nav.pop} />;
      case 'add':
        return <AddReservation onCancel={nav.pop} onAdd={add} />;
      default:
        return null;
    }
  };

  return (
    <PhoneFrame label="Reservations demo" onRestart={restart}>
      <div className="demo demo-res">
        <Stack stack={nav.stack} render={render} />
      </div>
    </PhoneFrame>
  );
}

/* ---------- Timeline ---------- */

function Timeline({ items, flash, onOpen }) {
  const [unfolded, setUnfolded] = useState(() => new Set());
  const [filter, setFilter] = useState([]);
  const [railOpen, setRailOpen] = useState(true);
  const [scan, setScan] = useState(null);
  const [synced, setSynced] = useState('1:36 PM');
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (scan === null) return undefined;
    if (scan >= 100) {
      const t = setTimeout(() => { setScan(null); setSynced('1:37 PM'); }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setScan((p) => Math.min(100, p + 7 + Math.round(Math.random() * 9))), 140);
    return () => clearTimeout(t);
  }, [scan]);

  const counts = { all: items.length };
  ORDER.forEach((k) => { counts[k] = items.filter((i) => i.cat === k).length; });
  const shown = filter.length ? items.filter((i) => filter.includes(i.cat)) : items;
  const soonest = shown[0]?.id;

  const days = [];
  shown.forEach((item) => {
    const last = days[days.length - 1];
    if (last && last.day === item.day) last.items.push(item);
    else days.push({ day: item.day, items: [item] });
  });

  const toggle = (k) => setFilter((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));
  const chips = filter.length
    ? ['clear', ...ORDER.filter((k) => filter.includes(k)), 'all', ...ORDER.filter((k) => !filter.includes(k))]
    : ['all', ...ORDER];

  return (
    <div className="res-scroll res-timeline">
      <div className="res-title-row">
        <h1>Reservations</h1>
        <button className="res-bell" aria-label="Updates"><Icon name="bell" size={22} /></button>
      </div>
      <div className="res-sync-row">
        <span>{scan !== null ? `Scanning… ${Math.min(scan, 100)}%` : `Synced today, ${synced}`}</span>
        <button className={`res-scan ${scan !== null ? 'is-busy' : ''}`} onClick={() => scan === null && setScan(0)}>
          <Icon name="refresh" size={16} />
          Scan now
        </button>
      </div>

      <div className="res-rail">
        <div className="res-tools">
          <button className={railOpen || filter.length ? 'is-on' : ''} onClick={() => setRailOpen((o) => !o)} aria-label="Filter">
            <Icon name="filter" size={20} />
          </button>
          <button aria-label="Sort, date"><Icon name="sort" size={20} /></button>
        </div>
        {railOpen && (
          <div
            className={`res-chips ${atEnd ? '' : 'is-faded'}`}
            onScroll={(e) => {
              const el = e.currentTarget;
              setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
            }}
          >
            {chips.map((k) => {
              if (k === 'clear') {
                return (
                  <button key="clear" className="res-chip res-chip-clear" onClick={() => setFilter([])}>
                    <Icon name="x" size={16} />
                    Clear
                  </button>
                );
              }
              if (k === 'all') {
                const on = filter.length === 0;
                return (
                  <button key="all" className={`res-chip ${on ? 'is-on' : ''}`} onClick={() => setFilter([])}>
                    All <span>{counts.all}</span>
                  </button>
                );
              }
              return (
                <button key={k} className={`res-chip res-chip-art ${filter.includes(k) ? 'is-on' : ''}`} onClick={() => toggle(k)}>
                  <img src={art(k)} alt="" />
                  <b>{CAT[k].chip}</b>
                  <span>{counts[k]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {days.length === 0 && (
        <div className="res-empty">
          <p>{filter.length === 1 ? `No ${CAT[filter[0]].name.toLowerCase()} reservations.` : 'No matching reservations.'}</p>
          <button onClick={() => setFilter([])}>Clear filter</button>
        </div>
      )}

      {days.map((d) => (
        <section key={d.day} className="res-day">
          <h2>
            <span>{DAYS[d.day].title}</span>
            <small>{DAYS[d.day].weekday}</small>
          </h2>
          {d.items.map((item) => (
            <div key={item.id} className={`res-row ${flash === item.id ? 'is-new' : ''}`}>
              {item.id === soonest ? (
                <Ticket item={item} onOpen={onOpen} hint />
              ) : unfolded.has(item.id) ? (
                <Ticket item={item} onOpen={onOpen} onCollapse={() => setUnfolded((s) => { const n = new Set(s); n.delete(item.id); return n; })} />
              ) : (
                <Folded item={item} onPress={() => setUnfolded((s) => new Set(s).add(item.id))} />
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function Ticket({ item, onOpen, onCollapse, hint }) {
  const c = CAT[item.cat];
  return (
    <div className={`res-ticket ${onCollapse ? 'is-unfolding' : ''}`} style={{ '--c': c.color, '--c-rgb': c.rgb }}>
      <div className="res-ticket-band">
        <button className="res-ticket-band-main" onClick={() => onOpen(item)}>
          <span className="res-ticket-cat">{c.name}</span>
          <span>{DAYS[item.day].band}</span>
        </button>
        {onCollapse && (
          <button className="res-ticket-hide" onClick={onCollapse} aria-label="Hide ticket">
            <Icon name="chevron-down" size={18} stroke={2.6} />
          </button>
        )}
      </div>
      <button className={`res-ticket-body ${hint ? 'hint' : ''}`} onClick={() => onOpen(item)}>
        <span className="res-ticket-text">
          <span className="res-ticket-time">{item.time}</span>
          <span className="res-ticket-title">{item.title}</span>
          <span className="res-ticket-sub">{item.sub}</span>
        </span>
        <img src={art(item.cat)} alt="" />
      </button>
      <Perforation />
      <div className="res-stub">
        <span className="res-stub-text">
          <span className="res-caps">Confirmation</span>
          {item.code ? <span className="res-stub-code">{item.code}</span> : <span className="res-stub-none">Not in the email</span>}
        </span>
        {item.code ? (
          <span className="res-bars" aria-hidden="true">
            {BARS.map((w, i) => <i key={i} style={{ width: w }} />)}
          </span>
        ) : (
          <span className="res-add-chip"><Icon name="plus" size={12} stroke={2.5} />Add</span>
        )}
      </div>
    </div>
  );
}

function Perforation() {
  return (
    <div className="res-perf" aria-hidden="true">
      <i />
      <span />
      <i />
    </div>
  );
}

function Folded({ item, onPress }) {
  const c = CAT[item.cat];
  return (
    <button className="res-folded" style={{ '--c': c.color, '--c-rgb': c.rgb }} onClick={onPress}>
      <img src={art(item.cat)} alt="" />
      <span className="res-folded-text">
        <span className="res-folded-title">{item.title}</span>
        <span className="res-folded-sub">{item.sub}</span>
      </span>
      <span className="res-folded-right">
        <span className="res-folded-time">{item.time}</span>
        <span className="res-show">Show<Icon name="chevron-down" size={13} stroke={2.6} /></span>
      </span>
    </button>
  );
}

/* ---------- Dock ---------- */

function Dock({ tab, onTab }) {
  const items = [
    { id: 'timeline', label: 'Timeline', icon: 'calendar' },
    { id: 'past', label: 'Past', icon: 'history' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];
  return (
    <nav className="res-dock">
      {items.map((i) => (
        <button key={i.id} className={tab === i.id ? 'is-on' : ''} onClick={() => onTab(i.id)} aria-label={i.label}>
          <Icon name={i.icon} size={22} />
          {tab === i.id && <span>{i.label}</span>}
        </button>
      ))}
    </nav>
  );
}

/* ---------- Detail ---------- */

function Detail({ item, onBack }) {
  const c = CAT[item.cat];
  const D = DETAILS[item.id] ?? DETAILS.amazon;
  return (
    <div className="res-screen res-detail" style={{ '--c': c.color, '--c-rgb': c.rgb }}>
      <div className="res-scroll">
        <div className="res-hero">
          <div className="res-hero-band">
            <span className="res-logo">{item.logo}</span>
            <span className="res-hero-cat">{item.band}</span>
            <img src={art(item.cat)} alt="" />
          </div>
          <div className="res-hero-body">{D.hero(item)}</div>
        </div>
        <div className={`res-actions res-actions-${D.actions.length}`}>
          {D.actions.map(([icon, label], i) => (
            <span key={label} className={`res-action ${i === 0 && D.primary ? 'is-primary' : ''}`}>
              <Icon name={icon} size={17} />
              <span>{label}</span>
            </span>
          ))}
        </div>
        {D.notice && (
          <div className="res-notice">
            <span className="res-notice-icon"><Icon name="clock" size={17} /></span>
            <span>
              <b>{D.notice[0]}</b>
              <small>{D.notice[1]}</small>
            </span>
          </div>
        )}
        {D.sections.map((s) => <Section key={s.title} {...s} />)}
        <button className="res-email">
          <span className="res-email-icon"><Icon name="mail" size={17} /></span>
          <span>
            <b>View original email</b>
            <small>{item.email} · Received {item.received}</small>
          </span>
          <Icon name="chevron-right" size={18} />
        </button>
        <div className="res-prov">
          {['Email received', 'Extracted', 'Confirmed'].map((s, i) => (
            <span key={s} className={i === 2 ? 'is-on' : ''}>
              <i><Icon name="check" size={13} stroke={3} /></i>
              <b>{s}</b>
              <small>{item.received.split(',')[0]}</small>
            </span>
          ))}
        </div>
        {D.history && (
          <>
            <p className="res-caps res-section-title">History</p>
            <div className="res-history">
              <span className="res-history-icon"><Icon name="history" size={17} /></span>
              <span>
                <b>Updated from an email</b>
                {D.history.map((h) => <small key={h}>{h}</small>)}
              </span>
              <em>Oct 20</em>
            </div>
          </>
        )}
      </div>
      <div className="res-detail-top">
        <button className="res-glass res-back" onClick={onBack}>
          <Icon name="chevron-left" size={20} />
          Timeline
        </button>
        <span className="res-glass res-more"><Icon name="more" size={20} /></span>
      </div>
    </div>
  );
}

function Section({ title, rows, grid, checks }) {
  const [done, setDone] = useState(() => new Set());
  return (
    <>
      <p className="res-caps res-section-title">{title}</p>
      {grid && (
        <div className="res-group res-grid">
          {grid.map(([k, v, mono]) => (
            <span key={k}>
              <small className="res-caps">{k}</small>
              <b className={mono ? 'is-mono' : ''}>{v}</b>
            </span>
          ))}
        </div>
      )}
      {rows && (
        <ul className="res-group res-rows">
          {rows.map(([k, v]) => (
            <li key={k}>
              <span>{k}</span>
              {v && <span>{v}</span>}
            </li>
          ))}
        </ul>
      )}
      {checks && (
        <ul className="res-group res-checks">
          {checks.map((k) => (
            <li key={k}>
              <button
                className={done.has(k) ? 'is-done' : ''}
                onClick={() => setDone((d) => { const n = new Set(d); n.has(k) ? n.delete(k) : n.add(k); return n; })}
              >
                <i>{done.has(k) && <Icon name="check" size={14} stroke={3} />}</i>
                {k}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function CopyCode({ code, size = 18, via }) {
  const [copied, setCopied] = useState(false);
  const t = useRef();
  return (
    <span className="res-code-row">
      <span className="res-code" style={{ fontSize: size }}>{code}</span>
      <button
        className="res-copy"
        onClick={() => {
          setCopied(true);
          clearTimeout(t.current);
          t.current = setTimeout(() => setCopied(false), 1500);
        }}
      >
        <Icon name={copied ? 'check' : 'copy'} size={13} />
        {copied ? 'Copied' : 'Copy'}
      </button>
      {via && <span className="res-via">{via}</span>}
    </span>
  );
}

function Place({ label, address, extra, toggle = true }) {
  return (
    <div className="res-place">
      <span className="res-place-icon"><Icon name="pin" size={18} /></span>
      <span>
        <small>{label}</small>
        <b>{address}</b>
        {extra && <small>{extra}</small>}
      </span>
      {toggle && <Icon name="chevron-down" size={18} />}
    </div>
  );
}

const DETAILS = {
  amazon: {
    hero: () => (
      <>
        <h3 className="res-h-lg">Out for delivery</h3>
        <p className="res-h-brand">Arriving Wed, Oct 21 · by 8:00 PM</p>
        <p className="res-h-sub">Arrives in 3 h 23 m</p>
        <div className="res-steps">
          {['Ordered', 'Shipped', 'In transit', 'Out', 'Delivered'].map((s, i) => (
            <span key={s} className={i < 3 ? 'is-done' : i === 3 ? 'is-now' : ''}>
              <i>{i < 3 && <Icon name="check" size={12} stroke={3} />}</i>
              <b>{s}</b>
            </span>
          ))}
        </div>
        <p className="res-h-note">Status as of Oct 21, 9:36 AM (from email). Tap Track for live status.</p>
        <hr />
        <p className="res-caps">Tracking · UPS</p>
        <CopyCode code="1Z999AA10123456784" />
        <p className="res-caps res-mt-lg">Order</p>
        <CopyCode code="113-2284915-8800" />
      </>
    ),
    primary: true,
    actions: [['truck', 'Track package'], ['copy', 'Copy no.'], ['mail', 'Email']],
    sections: [
      { title: 'Items', rows: [['Anker 100W charger', '× 1'], ['USB-C cable', '× 2'], ['+ 1 more item']] },
      { title: 'Delivering to', rows: [['Signature', 'Not required'], ['Instructions', 'Leave at the door']] },
      { title: 'Shipment', rows: [['Service', 'UPS Ground'], ['Shipped', 'Oct 19, 9:00 AM']] },
    ],
  },
  nobu: {
    hero: () => (
      <>
        <h3 className="res-h-md">Nobu Malibu</h3>
        <div className="res-when-row">
          <span>
            <span className="res-h-date">Today, Wed, Oct 21</span>
            <span className="res-h-time">7:30 PM</span>
            <span className="res-h-sub">in 5 h 49 m</span>
          </span>
          <span className="res-pill-c"><Icon name="users" size={20} />4 guests</span>
        </div>
        <p className="res-h-strong res-mt">Under: Demo · Patio</p>
        <hr />
        <Place label="Nobu Malibu" address="22706 Pacific Coast Hwy, Malibu, CA 90265" />
        <p className="res-caps res-mt">Confirmation</p>
        <CopyCode code="NB4821" size={24} via="via OpenTable" />
      </>
    ),
    actions: [['nav', 'Directions'], ['phone', 'Call'], ['external', 'Modify'], ['external', 'Menu']],
    notice: ['Cancel free until Wed, Oct 21, 3:30 PM', '$100.00 deposit applies. Cancel at least 4 hours ahead or the deposit is kept.'],
    sections: [{ title: 'Notes', rows: [['Occasion', 'Birthday'], ['Request', 'Window table'], ['Dress code', 'Smart casual']] }],
  },
  dentist: {
    hero: () => (
      <>
        <div className="res-provider">
          <span className="res-avatar">AP</span>
          <span>
            <b>Dr. Anita Patel</b>
            <small>DDS · Bright Smile Dental</small>
          </span>
        </div>
        <span className="res-tag-c">Routine cleaning</span>
        <span className="res-h-date">Thu, Oct 22</span>
        <span className="res-h-range">9:00 AM – 9:45 AM</span>
        <span className="res-h-sub">45 min · in 19 h 23 m</span>
        <hr />
        <Place label="Bright Smile Dental" address="100 Main St, San Francisco, CA 94105, Suite 210" extra="2nd floor · Validated in the garage" />
      </>
    ),
    actions: [['nav', 'Directions'], ['phone', 'Call office'], ['external', 'Reschedule'], ['external', 'Forms']],
    sections: [
      { title: 'Prepare', checks: ['Arrive 15 minutes early', 'Bring photo ID and insurance card', 'Fill in the intake forms'] },
      { title: 'Visit', rows: [['For', 'Demo'], ['Patient', 'Returning'], ['Copay', '$30.00']] },
    ],
    notice: null,
  },
  flight: {
    hero: () => (
      <>
        <p className="res-h-soon">in 3 days</p>
        <div className="res-route">
          <span>
            <b>SFO</b>
            <small>San Francisco</small>
          </span>
          <span className="res-route-mid">
            <small>5h 29m</small>
            <span><i /><Icon name="plane" size={20} /><i /></span>
            <small>Nonstop</small>
          </span>
          <span className="is-end">
            <b>JFK</b>
            <small>New York</small>
          </span>
        </div>
        <div className="res-route-times">
          <span>
            <b>7:00 AM</b>
            <small>Sat, Oct 24</small>
          </span>
          <span className="is-end">
            <b>3:29 PM</b>
            <small>Sat, Oct 24</small>
          </span>
        </div>
        <div className="res-route-term">
          <span>Terminal 3</span>
          <span>Terminal 4</span>
        </div>
        <Perforation />
        <p className="res-caps">Confirmation</p>
        <CopyCode code="XK92LM" size={28} />
        <div className="res-mini-grid">
          {[['Flight', 'UAL1234'], ['Seat', '14A'], ['Cabin', 'Economy'], ['Boards', '6:30 AM']].map(([k, v]) => (
            <span key={k}>
              <small className="res-caps">{k}</small>
              <b>{v}</b>
            </span>
          ))}
        </div>
      </>
    ),
    actions: [['check-circle', 'Check in'], ['activity', 'Status'], ['nav', 'Airport']],
    sections: [
      { title: 'Passenger', grid: [['Name', 'Demo Traveler'], ['Seat', '14A'], ['Ticket no.', '0162384710294', true], ['Frequent flyer', 'UA 4408 2211', true]] },
      { title: 'Baggage & fare', grid: [['Baggage', '1 carry-on, 1 checked bag'], ['Fare class', 'L · Economy'], ['Total', '$329.40'], ['Refundable', 'No']] },
    ],
    history: ['Seat: 12C → 14A', 'Terminal (departure): 1 → 3'],
  },
  hertz: {
    hero: () => (
      <>
        <h3 className="res-h-md">Hertz</h3>
        <p className="res-h-sub">Compact · Toyota Corolla or similar</p>
        <p className="res-h-soon">in 3 days</p>
        <div className="res-legs">
          <div>
            <i className="is-fill" />
            <span>
              <small className="res-caps">Pickup</small>
              <b>Sat, Oct 24 · 11:00 AM</b>
              <strong>JFK Airport, Terminal 4</strong>
              <small>Counter hours 5 AM – midnight · Shuttle from arrivals</small>
            </span>
          </div>
          <span className="res-legs-days">3 days</span>
          <div>
            <i />
            <span>
              <small className="res-caps">Return</small>
              <b>Tue, Oct 27 · 10:00 AM</b>
              <strong>JFK Airport Rental Return</strong>
            </span>
          </div>
        </div>
        <hr />
        <Place label="JFK Airport, Terminal 4" address="Federal Circle, Jamaica, NY 11430" />
        <p className="res-caps res-mt">Confirmation</p>
        <CopyCode code="HZ553201" size={24} />
      </>
    ),
    actions: [['nav', 'To pickup'], ['phone', 'Call'], ['external', 'Manage']],
    sections: [
      { title: 'Driver', grid: [['Driver', 'Demo Traveler'], ['Min. age', '25+']] },
      { title: 'Bring', checks: ["Driver's licence", "Credit card in the driver's name", 'Booking confirmation'] },
      { title: 'Rate', rows: [['Total', '$312.40'], ['Due at pickup', '$312.40'], ['Deposit hold', '$200.00']] },
      { title: 'Included', rows: [['Mileage', 'Unlimited'], ['Insurance', 'CDW included'], ['Fuel policy', 'Full to full']] },
    ],
  },
  standard: {
    hero: () => (
      <>
        <h3 className="res-h-md">The Standard, High Line</h3>
        <p className="res-h-soon res-mt-2">in 3 days</p>
        <div className="res-stay">
          <span>
            <small className="res-caps">Check-in</small>
            <b>Sat, Oct 24</b>
            <em>from 3:00 PM</em>
          </span>
          <span className="res-nights"><b>3</b><small>nights</small></span>
          <span>
            <small className="res-caps">Check-out</small>
            <b>Tue, Oct 27</b>
            <em>by 11:00 AM</em>
          </span>
        </div>
        <Place label="The Standard, High Line" address="848 Washington St, New York, NY 10014" />
        <p className="res-caps res-mt">Confirmation</p>
        <CopyCode code="HT77310" size={26} />
      </>
    ),
    actions: [['nav', 'Directions'], ['phone', 'Call'], ['external', 'Manage']],
    notice: ['Free cancellation until Fri, Oct 23, 6:00 PM', 'in 2 days. After that the first night is charged.'],
    sections: [
      { title: 'Room & guests', rows: [['Guests', '2 adults'], ['Room', 'King Deluxe'], ['Special request', 'High floor, quiet room']] },
      { title: 'Price', rows: [['Total', '$642.18'], ['Payment', 'Pay at property'], ['Taxes & fees', '$84.18']] },
      { title: 'Included', rows: [['Breakfast', 'Included'], ['Wi-Fi', 'Included'], ['Parking', '$65 per night']] },
    ],
  },
  dune: {
    hero: () => (
      <>
        <h3 className="res-h-lg">Dune: Part Three</h3>
        <p className="res-h-strong">AMC Metreon 16 · Auditorium 7</p>
        <span className="res-h-date res-mt-2">Mon, Oct 26</span>
        <span className="res-h-range">7:30 PM</span>
        <small className="res-caps">Showtime</small>
        <p className="res-h-soon res-mt-2">in 5 days</p>
        <Place label="AMC Metreon 16" address="135 4th St, San Francisco, CA" />
        <Perforation />
        <div className="res-seats">
          <span><small className="res-caps">Row</small><b>H</b></span>
          <span><small className="res-caps">Seat</small><b>7</b></span>
          <em>× 2</em>
        </div>
        <p className="res-caps res-mt">Order</p>
        <CopyCode code="FD-51722" size={22} via="Fandango" />
      </>
    ),
    primary: true,
    actions: [['mail', 'Open email'], ['nav', 'Directions'], ['share', 'Share']],
    sections: [{ title: 'Seats', rows: [['Ticket 1', 'Row H · Seat 7'], ['Ticket 2', 'Row H · Seat 8']] }],
  },
};

/* ---------- New reservation ---------- */

function AddReservation({ onCancel, onAdd }) {
  const [cat, setCat] = useState(null);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [code, setCode] = useState('');
  const ready = cat && title.trim();

  const submit = () => {
    if (!ready) return;
    onAdd({
      id: `new-${Date.now()}`, cat, day: 21, title: title.trim(), sub: place.trim() || 'Added by you', time: 'All day',
      code: code.trim() || null, logo: title.trim().slice(0, 2).toUpperCase(), band: CAT[cat].name, email: 'Added by you', received: 'Oct 21, 1:40 PM',
    });
  };

  return (
    <div className="res-sheet">
      <div className="res-sheet-bar">
        <button onClick={onCancel}>Cancel</button>
        <strong>New reservation</strong>
      </div>
      <div className="res-sheet-scroll">
        <p className="res-caps res-section-title">Category</p>
        <div className="res-cats">
          {ORDER.map((k) => (
            <button
              key={k}
              className={`res-cat ${cat === k ? 'is-on' : ''} ${!cat && k === 'restaurant' ? 'hint' : ''}`}
              style={{ '--c': CAT[k].color, '--c-rgb': CAT[k].rgb }}
              onClick={() => setCat(k)}
            >
              <span><img src={art(k)} alt="" /></span>
              {CAT[k].chip}
            </button>
          ))}
        </div>
        <ul className="res-group res-form">
          <li>
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Required" aria-label="Title" />
          </li>
          <li>
            <span>Date</span>
            <span>Wednesday, October 21</span>
          </li>
          <li>
            <span>Time</span>
            <span>No time</span>
          </li>
          <li>
            <span>Place</span>
            <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Optional" aria-label="Place" />
          </li>
          <li>
            <span>Confirmation no.</span>
            <input className="is-mono" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Optional" aria-label="Confirmation number" />
          </li>
        </ul>
        <p className="res-foot">Reservations you add yourself are always shown as Confirmed and stay on this device.</p>
      </div>
      <div className="res-sheet-foot">
        <button className={`res-submit ${ready ? 'hint' : ''}`} onClick={submit} disabled={!ready}>Add reservation</button>
      </div>
    </div>
  );
}

/* ---------- Past + Profile ---------- */

function Past() {
  return (
    <div className="res-scroll res-past">
      <h1 className="res-large">Past</h1>
      <h2 className="res-month">October 2026</h2>
      {PAST.map((p) => (
        <div key={p.id} className={`res-past-card ${p.cancelled ? 'is-cancelled' : ''}`} style={{ '--c-rgb': CAT[p.cat].rgb }}>
          <span className="res-past-art"><img src={art(p.cat)} alt="" /></span>
          <span className="res-past-text">
            <span className="res-past-when">
              <s>{p.when}</s>
              {p.cancelled && <em><Icon name="x" size={13} stroke={2.5} />Cancelled</em>}
            </span>
            <b>{p.title}</b>
            <small>{p.sub}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const [freq, setFreq] = useState('Manual');
  return (
    <div className="res-scroll res-profile">
      <h1 className="res-large">Profile</h1>
      <div className="res-group res-me">
        <span className="res-me-avatar">D</span>
        <span>
          <b>Demo</b>
          <small>demo@example.com</small>
          <em><Icon name="check" size={13} stroke={3} />Gmail connected · read-only</em>
        </span>
      </div>
      <p className="res-caps res-section-title">Library</p>
      <ul className="res-group res-rows res-nav-rows">
        <li><span className="res-tile" style={{ background: '#6B727E' }}><Icon name="history" size={17} /></span><span>Past reservations</span><span>2</span><Icon name="chevron-right" size={18} /></li>
        <li><span className="res-tile" style={{ background: '#BB6546' }}><Icon name="bell" size={17} /></span><span>Reminders</span><span>1 hour before</span><Icon name="chevron-right" size={18} /></li>
      </ul>
      <p className="res-caps res-section-title">Claude</p>
      <ul className="res-group res-rows res-nav-rows">
        <li><span className="res-tile" style={{ background: '#D97757' }}><Icon name="external" size={17} /></span><span>Connect to Claude</span><span /><Icon name="chevron-right" size={18} /></li>
      </ul>
      <p className="res-caps res-section-title">Scanning</p>
      <div className="res-group res-scanning">
        <div className="res-scanning-row"><span>Last synced</span><span>Today, 1:40 PM</span></div>
        <div className="res-scanning-freq">
          <span>Scan frequency</span>
          <div className="res-seg">
            {['Manual', 'Daily', 'Every 6 h'].map((f) => (
              <button key={f} className={freq === f ? 'is-on' : ''} onClick={() => setFreq(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="res-scanning-row res-brand-row">Scan now</div>
      </div>
      <div className="res-group res-danger"><span>Disconnect Gmail</span></div>
      <div className="res-group res-danger res-danger-2"><span>Sign out</span><span>Delete account</span></div>
      <p className="res-version">Version 1.0.0</p>
    </div>
  );
}

/* ---------- Icons (lucide paths, as the app draws them) ---------- */

const PATHS = {
  plus: ['M5 12h14', 'M12 5v14'],
  bell: ['M10.268 21a2 2 0 0 0 3.464 0', 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'],
  refresh: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5'],
  filter: ['M2 5h20', 'M6 12h12', 'M9 19h6'],
  sort: ['m21 16-4 4-4-4', 'M17 20V4', 'm3 8 4-4 4 4', 'M7 4v16'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  check: ['M20 6 9 17l-5-5'],
  history: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5', 'M12 7v5l4 2'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
  phone: ['M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384'],
  activity: ['M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2'],
  share: ['M12 2v13', 'm16 6-4-4-4 4', 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'],
  truck: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'],
  plane: ['M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z'],
  pin: ['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M16 3.128a4 4 0 0 1 0 7.744', 'M22 21v-2a4 4 0 0 0-3-3.87'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
  calendar: ['M8 2v3', 'M16 2v3', 'M3 9h18'],
  mail: ['m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7'],
  copy: ['M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'],
  clock: ['M12 6v6l4 2'],
  'check-circle': ['m16 9-5.5 5.5L8 12'],
  nav: [],
  more: [],
};

function Icon({ name, size = 20, stroke = 2 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(PATHS[name] ?? []).map((d) => <path key={d} d={d} />)}
      {name === 'truck' && <><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>}
      {name === 'pin' && <circle cx="12" cy="10" r="3" />}
      {name === 'users' && <circle cx="9" cy="7" r="4" />}
      {name === 'user' && <circle cx="12" cy="7" r="4" />}
      {name === 'calendar' && <rect x="3" y="3" width="18" height="18" rx="2" />}
      {name === 'mail' && <rect x="2" y="4" width="20" height="16" rx="2" />}
      {name === 'copy' && <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />}
      {(name === 'clock' || name === 'check-circle') && <circle cx="12" cy="12" r="10" />}
      {name === 'nav' && <polygon points="3 11 22 2 13 21 11 13 3 11" />}
      {name === 'more' && <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>}
    </svg>
  );
}
