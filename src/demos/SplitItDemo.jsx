import React, { useMemo, useState } from 'react';
import { PhoneFrame, Stack, useStack } from './Phone.jsx';

// The app's own sample trip (Views/Onboarding/SampleTrip.swift), in euros.
const PEOPLE = [
  { id: 'you', name: 'You', color: '#0F6B66' },
  { id: 'ben', name: 'Ben', color: '#6A4FB3' },
  { id: 'cleo', name: 'Cleo', color: '#C2502A' },
  { id: 'max', name: 'Max', color: '#8A6D0B' },
];
const ALL = PEOPLE.map((p) => p.id);

const CATS = {
  lodging: { name: 'Lodging', color: '#6A4FB3' },
  transport: { name: 'Transport', color: '#2D7FA0' },
  food: { name: 'Food', color: '#C2502A' },
  activities: { name: 'Activities', color: '#B0376A' },
};

const EXPENSES = [
  { id: 'e1', title: 'Hotel in Alfama, 3 nights', amount: 612, payer: 'you', cat: 'lodging', day: 'Thu, Oct 16', mode: 'even', people: ALL },
  { id: 'e2', title: 'Uber from the airport', amount: 38.5, payer: 'cleo', cat: 'transport', day: 'Thu, Oct 16', mode: 'amount', people: ['cleo', 'max'], amounts: { cleo: 18.5, max: 20 } },
  { id: 'e3', title: 'Dinner at Taberna', amount: 142, payer: 'ben', cat: 'food', day: 'Thu, Oct 16', mode: 'even', people: ALL },
  { id: 'e4', title: 'Tram 28 tickets', amount: 24, payer: 'max', cat: 'transport', day: 'Fri, Oct 17', mode: 'even', people: ALL },
  { id: 'e5', title: 'Sintra day trip', amount: 164, payer: 'you', cat: 'activities', day: 'Fri, Oct 17', mode: 'percent', people: ALL, percent: { you: 30, ben: 30, cleo: 20, max: 20 } },
  {
    id: 'e6', title: 'Time Out Market', amount: 96.4, payer: 'ben', cat: 'food', day: 'Sat, Oct 18', mode: 'items', people: ALL,
    items: [
      { name: 'Bacalhau', amount: 28, people: ['you', 'ben'] },
      { name: 'Grilled octopus', amount: 32, people: ['cleo', 'max'] },
      { name: 'Vinho verde', amount: 24, people: [] },
    ],
  },
  { id: 'e7', title: 'Pastéis de Belém', amount: 18.4, payer: 'cleo', cat: 'food', day: 'Sun, Oct 19', mode: 'even', people: ALL },
  { id: 'e8', title: 'Fado night', amount: 120, payer: 'max', cat: 'activities', day: 'Sun, Oct 19', mode: 'even', people: ALL },
];

const MODES = [
  { id: 'even', label: 'Even' },
  { id: 'percent', label: '%' },
  { id: 'amount', label: 'Amount' },
  { id: 'items', label: 'Items' },
];

const euro = (n) => `€${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const person = (id) => PEOPLE.find((p) => p.id === id);

// What each person owes for one expense, following the app's four split modes.
export function shares(e) {
  const out = {};
  const people = e.people.length ? e.people : ALL;
  if (e.mode === 'percent' && e.percent) {
    Object.entries(e.percent).forEach(([id, pct]) => (out[id] = (e.amount * pct) / 100));
  } else if (e.mode === 'amount' && e.amounts) {
    Object.entries(e.amounts).forEach(([id, v]) => (out[id] = v));
  } else if (e.mode === 'items' && e.items) {
    // Lines with nobody picked are shared by everyone; tax and tip follow each person's subtotal.
    let lines = 0;
    e.items.forEach((it) => {
      const who = it.people.length ? it.people : people;
      who.forEach((id) => (out[id] = (out[id] ?? 0) + it.amount / who.length));
      lines += it.amount;
    });
    const extra = e.amount - lines;
    Object.keys(out).forEach((id) => (out[id] += (out[id] / lines) * extra));
  } else {
    people.forEach((id) => (out[id] = e.amount / people.length));
  }
  return out;
}

function settle(expenses, payments) {
  const paid = Object.fromEntries(ALL.map((id) => [id, 0]));
  const owed = Object.fromEntries(ALL.map((id) => [id, 0]));
  expenses.forEach((e) => {
    paid[e.payer] += e.amount;
    Object.entries(shares(e)).forEach(([id, v]) => (owed[id] += v));
  });
  const net = Object.fromEntries(ALL.map((id) => [id, paid[id] - owed[id]]));
  payments.forEach((p) => {
    net[p.from] += p.amount;
    net[p.to] -= p.amount;
  });

  // Fewest payments: repeatedly match the biggest debtor with the biggest creditor.
  const debtors = ALL.filter((id) => net[id] < -0.005).map((id) => ({ id, v: -net[id] })).sort((a, b) => b.v - a.v);
  const creditors = ALL.filter((id) => net[id] > 0.005).map((id) => ({ id, v: net[id] })).sort((a, b) => b.v - a.v);
  const transfers = [];
  while (debtors.length && creditors.length) {
    const d = debtors[0];
    const c = creditors[0];
    const amount = Math.min(d.v, c.v);
    transfers.push({ from: d.id, to: c.id, amount: Math.round(amount * 100) / 100 });
    d.v -= amount;
    c.v -= amount;
    if (d.v < 0.005) debtors.shift();
    if (c.v < 0.005) creditors.shift();
  }
  return { paid, owed, net, transfers };
}

export default function SplitItDemo() {
  const nav = useStack('event');
  const [tab, setTab] = useState('summary');
  const [expenses, setExpenses] = useState(EXPENSES);
  const [payments, setPayments] = useState([]);
  const [opened, setOpened] = useState(false);

  const st = useMemo(() => settle(expenses, payments), [expenses, payments]);

  const restart = () => {
    setTab('summary');
    setExpenses(EXPENSES);
    setPayments([]);
    setOpened(false);
    nav.reset();
  };

  const update = (id, patch) => setExpenses((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const render = (entry) => {
    if (entry.name === 'expense') {
      const e = expenses.find((x) => x.id === entry.props.id);
      return <ExpenseDetail e={e} onBack={nav.pop} onChange={(patch) => update(e.id, patch)} />;
    }
    return (
      <div className="sp-screen">
        <div className="sp-scroll">
          <div className="sp-nav">
            <span className="sp-back">
              <svg viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Events
            </span>
          </div>
          <h1 className="sp-title"><span aria-hidden="true">🇵🇹</span> Lisbon</h1>
          <div className="sp-seg" role="tablist">
            {['summary', 'expenses'].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`${tab === t ? 'is-on' : ''} ${t === 'expenses' && !opened && tab === 'summary' ? 'hint' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'summary' ? 'Summary' : 'Expenses'}
              </button>
            ))}
          </div>

          {tab === 'summary' ? (
            <Summary
              expenses={expenses}
              st={st}
              onPaid={(t) => setPayments((p) => [...p, t])}
            />
          ) : (
            <Expenses
              expenses={expenses}
              hint={!opened}
              onOpen={(e) => {
                setOpened(true);
                nav.push('expense', 'push', { id: e.id });
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <PhoneFrame label="SplitIt demo" onRestart={restart}>
      <div className="demo demo-split">
        <Stack stack={nav.stack} render={render} />
      </div>
    </PhoneFrame>
  );
}

function Summary({ expenses, st, onPaid }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCat = Object.keys(CATS).map((k) => ({ k, v: expenses.filter((e) => e.cat === k).reduce((s, e) => s + e.amount, 0) }));

  return (
    <>
      <div className="sp-hero">
        <span className="sp-hero-label">Total spent</span>
        <span className="sp-hero-total">{euro(total)}</span>
        <span className="sp-hero-sub">{expenses.length} expenses, {PEOPLE.length} people</span>
        <div className="sp-catbar">
          {byCat.map(({ k, v }) => (
            <span key={k} style={{ flexGrow: v, background: CATS[k].color }} />
          ))}
        </div>
        <div className="sp-legend">
          {byCat.map(({ k, v }) => (
            <span key={k}><i style={{ background: CATS[k].color }} />{CATS[k].name} {Math.round((v / total) * 100)}%</span>
          ))}
        </div>
      </div>

      <div className="sp-card">
        <div className="sp-card-head">
          <strong>Settle up</strong>
          <span>{st.transfers.length ? `${st.transfers.length} payment${st.transfers.length > 1 ? 's' : ''}` : 'Done'}</span>
        </div>
        {st.transfers.length ? (
          <ul className="sp-transfers">
            {st.transfers.map((t, i) => (
              <li key={`${t.from}-${t.to}`}>
                <Avatar id={t.from} />
                <span className="sp-transfer-text">
                  <strong>{person(t.from).name}</strong> pays <strong>{person(t.to).name}</strong>
                  <span className="sp-amount">{euro(t.amount)}</span>
                </span>
                <button className={`sp-paid ${i === 0 ? 'hint' : ''}`} onClick={() => onPaid(t)}>Paid</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sp-even">Everyone’s even. Nothing left to settle.</p>
        )}
      </div>

      <div className="sp-section"><strong>Everyone</strong><span>{PEOPLE.length}</span></div>
      <div className="sp-people">
        {PEOPLE.map((p) => {
          const net = st.net[p.id];
          const even = Math.abs(net) < 0.005;
          const ratio = st.owed[p.id] > 0 ? Math.min(st.paid[p.id] / st.owed[p.id], 1.6) / 1.6 : 1;
          return (
            <div key={p.id} className="sp-person">
              <span className="sp-person-head"><Avatar id={p.id} size={26} />{p.name}{p.id === 'you' && <em>you</em>}</span>
              <span className="sp-person-label">{even ? 'Even' : net > 0 ? 'Gets back' : 'Owes'}</span>
              <span className={`sp-person-net ${even ? '' : net > 0 ? 'is-pos' : 'is-neg'}`}>{euro(Math.abs(net))}</span>
              <span className="sp-person-bar"><i style={{ width: `${ratio * 100}%`, background: p.color }} /></span>
              <span className="sp-person-foot"><span>Share {euro(st.owed[p.id])}</span><span>Paid {euro(st.paid[p.id])}</span></span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Expenses({ expenses, hint, onOpen }) {
  const days = [];
  expenses.forEach((e) => {
    const last = days[days.length - 1];
    if (last && last.day === e.day) last.items.push(e);
    else days.push({ day: e.day, items: [e] });
  });

  return days.map((d) => (
    <section key={d.day}>
      <div className="sp-section"><strong>{d.day}</strong><span>{euro(d.items.reduce((s, e) => s + e.amount, 0))}</span></div>
      <div className="sp-card sp-rows">
        {d.items.map((e) => (
          <button key={e.id} className={`sp-row ${hint && e.id === 'e6' ? 'hint' : ''}`} onClick={() => onOpen(e)}>
            <CatTile cat={e.cat} />
            <span className="sp-row-text">
              <strong>{e.title}</strong>
              <span>{person(e.payer).name} paid · {MODES.find((m) => m.id === e.mode).label} split</span>
            </span>
            <span className="sp-row-amt">{euro(e.amount)}</span>
          </button>
        ))}
      </div>
    </section>
  ));
}

function ExpenseDetail({ e, onBack, onChange }) {
  const s = shares(e);
  const max = Math.max(...Object.values(s), 0.01);
  const available = (m) => m === 'even' || (m === 'percent' && e.percent) || (m === 'amount' && e.amounts) || (m === 'items' && e.items);

  const toggle = (id) => {
    const on = e.people.includes(id);
    if (on && e.people.length === 1) return;
    onChange({ people: on ? e.people.filter((x) => x !== id) : ALL.filter((x) => x === id || e.people.includes(x)) });
  };

  return (
    <div className="sp-screen">
      <div className="sp-scroll">
        <div className="sp-nav">
          <button className="sp-back" onClick={onBack}>
            <svg viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Lisbon
          </button>
        </div>
        <div className="sp-detail-head">
          <CatTile cat={e.cat} size={44} />
          <h2>{e.title}</h2>
          <span className="sp-detail-amt">{euro(e.amount)}</span>
          <span className="sp-detail-sub">{person(e.payer).name} paid · {CATS[e.cat].name} · {e.day}</span>
        </div>

        <div className="sp-section"><strong>Split</strong><span>{MODES.find((m) => m.id === e.mode).label}</span></div>
        <div className="sp-modes" role="tablist">
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={e.mode === m.id}
              disabled={!available(m.id)}
              className={`${e.mode === m.id ? 'is-on' : ''} ${e.mode === 'items' && m.id === 'even' ? 'hint' : ''}`}
              onClick={() => onChange({ mode: m.id, people: m.id === 'even' && e.mode !== 'even' ? ALL : e.people })}
            >
              {m.label}
            </button>
          ))}
        </div>

        {e.mode === 'even' && (
          <div className="sp-chips">
            {PEOPLE.map((p) => (
              <button key={p.id} className={e.people.includes(p.id) ? 'is-on' : ''} style={{ '--p': p.color }} onClick={() => toggle(p.id)}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {e.mode === 'items' && (
          <div className="sp-card sp-items">
            {e.items.map((it) => (
              <div key={it.name} className="sp-item">
                <span>{it.name}</span>
                <span className="sp-item-who">{it.people.length ? it.people.map((id) => person(id).name).join(', ') : 'Everyone'}</span>
                <span>{euro(it.amount)}</span>
              </div>
            ))}
            <div className="sp-item sp-item-extra">
              <span>Tax and tip</span>
              <span className="sp-item-who">In proportion</span>
              <span>{euro(e.amount - e.items.reduce((t, it) => t + it.amount, 0))}</span>
            </div>
          </div>
        )}

        <div className="sp-card sp-shares">
          {PEOPLE.filter((p) => s[p.id] !== undefined).map((p) => (
            <div key={p.id} className="sp-share">
              <Avatar id={p.id} />
              <span className="sp-share-name">{p.name}</span>
              <span className="sp-share-bar"><i style={{ width: `${(s[p.id] / max) * 100}%`, background: p.color }} /></span>
              <span className="sp-share-amt">{euro(s[p.id])}</span>
            </div>
          ))}
        </div>
        <p className="sp-foot">
          {e.mode === 'even' ? 'Tap a name to take them out of this split. Settle up updates as you go.' : 'Switch to Even to change who’s in. Settle up updates as you go.'}
        </p>
      </div>
    </div>
  );
}

function Avatar({ id, size = 30 }) {
  const p = person(id);
  return (
    <span className="sp-avatar" style={{ background: p.color, width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {p.name[0]}
    </span>
  );
}

const GLYPHS = {
  lodging: <path d="M3 15V6M3 11h14v4M17 15v-4M6 11V9.5A1.5 1.5 0 0 1 7.5 8H9a1.5 1.5 0 0 1 1.5 1.5V11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  transport: <path d="M4.5 13.5V9l1.6-3.6A1.5 1.5 0 0 1 7.5 4.5h5a1.5 1.5 0 0 1 1.4.9L15.5 9v4.5zM4.5 13.5v1.5M15.5 13.5v1.5M7 11h.01M13 11h.01" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  food: <path d="M6 3v5a2 2 0 0 0 4 0V3M8 8v9M14 17V3c-1.7 1-2.5 3-2.5 5.5S12.5 11 14 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  activities: <path d="M10 3l2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 13.8 5.8 16l.8-4.7-3.4-3.3 4.7-.7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />,
};

function CatTile({ cat, size = 36 }) {
  const c = CATS[cat].color;
  return (
    <span className="sp-cat" style={{ width: size, height: size, color: c, background: `color-mix(in srgb, ${c} 13%, #fff)` }} aria-hidden="true">
      <svg viewBox="0 0 20 20" width={size * 0.55} height={size * 0.55}>{GLYPHS[cat]}</svg>
    </span>
  );
}
