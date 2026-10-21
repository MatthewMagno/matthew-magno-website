import React, { useState } from 'react';
import { PhoneFrame, Stack, useStack } from './Phone.jsx';

// Category colors from the app's generated OKLCH palette (light scheme).
const CAT = {
  restaurant: { color: '#B65C4E', name: 'Restaurant' },
  flight: { color: '#3A75AF', name: 'Flight' },
  hotel: { color: '#7860A0', name: 'Hotel' },
  car: { color: '#27786B', name: 'Car' },
  event: { color: '#A37734', name: 'Event' },
  appointment: { color: '#31858E', name: 'Appointment' },
  delivery: { color: '#4B8358', name: 'Delivery' },
};

const art = (cat) => `./demo/res-${cat}.png`;

const INITIAL = [
  {
    id: 'amazon', cat: 'delivery', day: 'Today, Oct 6', title: 'Package from Amazon', sub: 'Out for delivery, UPS',
    time: 'By 5 PM', label: 'Delivery', when: 'Today, Tue, Oct 6', big: 'By 5 PM', conf: '113-2284915-8800',
    actions: ['Track', 'Order'], fields: [['Carrier', 'UPS'], ['Items', 'AirPods Pro case']],
  },
  {
    id: 'nobu', cat: 'restaurant', day: 'Today, Oct 6', title: 'Dinner at Nobu', sub: 'Party of 4, Nobu Malibu',
    time: '7:30 PM', label: 'Restaurant · Japanese', place: 'Nobu Malibu', address: '22706 Pacific Coast Hwy, Malibu, CA',
    when: 'Today, Tue, Oct 6', big: '7:30 PM', badge: '4 guests', conf: 'NB4821', via: 'via OpenTable',
    actions: ['Directions', 'Call', 'Modify', 'Menu'],
    notice: 'Cancel free until 3:30 PM today. After that the $100 deposit is kept.',
    fields: [['Occasion', 'Birthday'], ['Request', 'Window table'], ['Dress code', 'Smart casual']],
  },
  {
    id: 'dentist', cat: 'appointment', day: 'Wed, Oct 7', title: 'Dentist check-up', sub: 'Dr. Anita Patel, Suite 210',
    time: '9:00 AM', label: 'Appointment', place: 'Bright Smile Dental', address: '450 Sutter St, San Francisco, CA',
    when: 'Wed, Oct 7', big: '9:00 AM', conf: 'BSD-20931', actions: ['Directions', 'Call', 'Reschedule'],
    fields: [['Provider', 'Dr. Anita Patel'], ['Bring', 'Insurance card']],
  },
  {
    id: 'flight', cat: 'flight', day: 'Fri, Oct 9', title: 'SFO to JFK', sub: 'United 1234, seat 14A',
    time: '7:00 AM', label: 'Flight · United Airlines', when: 'In 3 days',
    route: { from: 'SFO', fromCity: 'San Francisco', to: 'JFK', toCity: 'New York', dep: '7:00 AM', arr: '3:29 PM', dur: '5h 29m' },
    conf: 'XK92LM', actions: ['Check in', 'Status', 'Airport'],
    fields: [['Flight', 'UAL 1234'], ['Seat', '14A'], ['Cabin', 'Economy'], ['Boards', '6:30 AM']],
  },
  {
    id: 'hotel', cat: 'hotel', day: 'Fri, Oct 9', title: 'The Greenwich Hotel', sub: '2 nights, Tribeca',
    time: '3:00 PM', label: 'Hotel', place: 'The Greenwich Hotel', address: '377 Greenwich St, New York, NY',
    when: 'Fri, Oct 9 to Sun, Oct 11', big: 'Check in 3 PM', badge: '2 nights', conf: 'GH-77310',
    actions: ['Directions', 'Call', 'Modify'], fields: [['Room', 'Courtyard King'], ['Check out', 'Sun, 12 PM']],
  },
  {
    id: 'show', cat: 'event', day: 'Sat, Oct 10', title: 'Hamilton', sub: 'Richard Rodgers Theatre, 2 tickets',
    time: '8:00 PM', label: 'Event · Theater', place: 'Richard Rodgers Theatre', address: '226 W 46th St, New York, NY',
    when: 'Sat, Oct 10', big: '8:00 PM', badge: '2 tickets', conf: 'TM-5521984', actions: ['Directions', 'Tickets'],
    fields: [['Seats', 'Orch L, Row K, 7–8'], ['Doors', '7:15 PM']],
  },
];

export default function ReservationsDemo() {
  const nav = useStack('timeline');
  const [items, setItems] = useState(INITIAL);
  const [flash, setFlash] = useState(null);
  const [visited, setVisited] = useState(false);

  const restart = () => {
    setItems(INITIAL);
    setFlash(null);
    setVisited(false);
    nav.reset();
  };

  const add = (item) => {
    setItems((list) => {
      const i = list.findIndex((x) => x.day !== 'Today, Oct 6');
      const next = [...list];
      next.splice(i < 0 ? list.length : i, 0, item);
      return next;
    });
    setFlash(item.id);
    nav.pop();
  };

  const render = (entry) => {
    switch (entry.name) {
      case 'timeline':
        return (
          <Timeline
            items={items}
            flash={flash}
            hint={!visited}
            onOpen={(item) => {
              setVisited(true);
              nav.push('detail', 'push', { item });
            }}
            onAdd={() => nav.push('new', 'sheet')}
            onConnect={() => nav.push('connect', 'sheet')}
          />
        );
      case 'detail':
        return <Detail item={entry.props.item} onBack={nav.pop} />;
      case 'new':
        return <NewReservation onCancel={nav.pop} onAdd={add} />;
      case 'connect':
        return <Connect onDone={nav.pop} />;
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

function Timeline({ items, flash, hint, onOpen, onAdd, onConnect }) {
  const days = [];
  items.forEach((item) => {
    const last = days[days.length - 1];
    if (last && last.day === item.day) last.items.push(item);
    else days.push({ day: item.day, items: [item] });
  });

  return (
    <div className="res-screen">
      <div className="res-scroll">
        <header className="res-top">
          <h1>Reservations</h1>
          <div className="res-sync">
            <span>Synced today, 2:35 PM</span>
            <button className="res-link" onClick={onConnect}>Scan with Claude ↗</button>
          </div>
        </header>

        {days.map((d) => (
          <section key={d.day} className="res-day">
            <h2>{d.day}</h2>
            {d.items.map((item) => (
              <button
                key={item.id}
                className={`res-card ${flash === item.id ? 'is-new' : ''} ${hint && item.id === 'nobu' ? 'hint' : ''}`}
                style={{ '--c': CAT[item.cat].color }}
                onClick={() => onOpen(item)}
              >
                <img src={art(item.cat)} alt="" />
                <span className="res-card-text">
                  <span className="res-card-title">{item.title}</span>
                  <span className="res-card-sub">{item.sub}</span>
                </span>
                <span className="res-card-time">{item.time}</span>
              </button>
            ))}
          </section>
        ))}
      </div>

      <div className="res-tabbar">
        <span className="res-tab is-active">
          <svg viewBox="0 0 20 20"><rect x="2.5" y="4" width="15" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M2.5 8h15M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Timeline
        </span>
        <span className="res-tab" aria-hidden="true">
          <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 6v4l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </span>
        <span className="res-tab" aria-hidden="true">
          <svg viewBox="0 0 20 20"><circle cx="10" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 17c1-3.2 3.5-4.8 6.5-4.8s5.5 1.6 6.5 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </span>
      </div>
      <button className="res-fab" onClick={onAdd} aria-label="New reservation">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

function Detail({ item, onBack }) {
  const [copied, setCopied] = useState(false);
  const c = CAT[item.cat].color;

  return (
    <div className="res-screen res-detail" style={{ '--c': c }}>
      <div className="res-scroll">
        <div className="res-navbar">
          <button className="res-pill" onClick={onBack}>
            <svg viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Timeline
          </button>
        </div>

        <div className="res-ticket">
          <div className="res-ticket-band">
            <span>{item.label}</span>
            <img src={art(item.cat)} alt="" />
          </div>
          <div className="res-ticket-body">
            {item.route ? (
              <>
                <p className="res-when">{item.when}</p>
                <div className="res-route">
                  <div>
                    <strong>{item.route.from}</strong>
                    <span>{item.route.fromCity}</span>
                  </div>
                  <div className="res-route-mid">
                    <span>{item.route.dur}</span>
                    <i />
                    <span>Nonstop</span>
                  </div>
                  <div className="res-route-end">
                    <strong>{item.route.to}</strong>
                    <span>{item.route.toCity}</span>
                  </div>
                </div>
                <div className="res-route-times">
                  <span>{item.route.dep}</span>
                  <span>{item.route.arr}</span>
                </div>
              </>
            ) : (
              <>
                <h3>{item.place ?? item.title}</h3>
                <p className="res-when">{item.when}</p>
                <div className="res-big">
                  <span>{item.big}</span>
                  {item.badge && <span className="res-badge">{item.badge}</span>}
                </div>
                {item.address && (
                  <p className="res-address">
                    <svg viewBox="0 0 16 16"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="8" cy="6.5" r="1.8" fill="currentColor" /></svg>
                    {item.address}
                  </p>
                )}
              </>
            )}

            <div className="res-conf">
              <span className="res-label">Confirmation</span>
              <div>
                <code>{item.conf}</code>
                <button
                  className={`res-copy ${copied ? 'is-done' : ''}`}
                  onClick={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                {item.via && <span className="res-via">{item.via}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="res-actions">
          {item.actions.map((a) => (
            <span key={a} className="res-action">{a}</span>
          ))}
        </div>

        {item.notice && <p className="res-notice">{item.notice}</p>}

        {item.fields.length > 0 && (
          <>
            <p className="res-section">Details</p>
            <ul className="res-list">
              {item.fields.map(([k, v]) => (
                <li key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function NewReservation({ onCancel, onAdd }) {
  const [cat, setCat] = useState(null);
  const [title, setTitle] = useState('');

  const submit = () => {
    if (!cat) return;
    const name = title.trim() || `New ${CAT[cat].name.toLowerCase()}`;
    onAdd({
      id: `new-${Date.now()}`, cat, day: 'Today, Oct 6', title: name, sub: 'Added just now', time: 'No time',
      label: CAT[cat].name, place: name, when: 'Today, Tue, Oct 6', big: 'No time set', conf: 'None yet',
      actions: ['Edit'], fields: [],
    });
  };

  return (
    <div className="res-sheet">
      <div className="res-sheet-bar">
        <button onClick={onCancel}>Cancel</button>
        <strong>New reservation</strong>
        <span />
      </div>
      <p className="res-section">Category</p>
      <div className="res-cats">
        {Object.entries(CAT).map(([key, v]) => (
          <button
            key={key}
            className={`res-cat ${cat === key ? 'is-on' : ''} ${!cat && key === 'flight' ? 'hint' : ''}`}
            style={{ '--c': v.color }}
            onClick={() => setCat(key)}
          >
            <img src={art(key)} alt="" />
            <span>{v.name}</span>
          </button>
        ))}
      </div>
      <ul className="res-list res-form">
        <li>
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Required" aria-label="Title" />
        </li>
        <li>
          <span>Date</span>
          <span>Tuesday, October 6</span>
        </li>
        <li>
          <span>Time</span>
          <span>No time</span>
        </li>
      </ul>
      <button className={`res-submit ${cat ? 'is-ready hint' : ''}`} onClick={submit} disabled={!cat}>
        Add reservation
      </button>
    </div>
  );
}

function Connect({ onDone }) {
  return (
    <div className="res-sheet">
      <div className="res-sheet-bar">
        <button onClick={onDone}>Done</button>
        <strong>Connect to Claude</strong>
        <span />
      </div>
      <p className="res-copy-text">
        Claude reads your Gmail in your own Claude account and adds bookings here. Reservations never
        connects to your email. New bookings show up the next time the app syncs.
      </p>
      <p className="res-section">How to set it up</p>
      <ol className="res-list res-steps">
        <li>In Claude, open Settings, then Connectors, and choose Add custom connector.</li>
        <li>Name it Reservations and paste your private address. No sign-in needed.</li>
        <li>Turn on Claude’s Gmail connector so it can read your confirmations.</li>
      </ol>
      <p className="res-foot">Bookings are matched by confirmation code, flight number and title, so nothing is added twice.</p>
    </div>
  );
}
