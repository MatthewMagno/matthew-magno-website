import React, { useMemo, useState } from 'react';
import { PhoneFrame, Stack, useStack } from './Phone.jsx';

// Mirrors SplitIt (split-money-app): the app's own sample trip (Views/Onboarding/SampleTrip.swift)
// in its default USD, with Summary / Expenses / Review, the expense editor, and settle-up math
// ported from Model/SplitMath.swift. Today is Wednesday, Oct 21, so the trip ran Oct 17 to 20.

const tint = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(255 + (c - 255) * k);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
};
const lifted = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const up = (c) => Math.round(c + (255 - c) * k);
  return `rgb(${up((n >> 16) & 255)}, ${up((n >> 8) & 255)}, ${up(n & 255)})`;
};

const PEOPLE = [
  { id: 'you', name: 'You', color: '#0F6B66' },
  { id: 'ben', name: 'Ben', color: '#6A4FB3' },
  { id: 'cleo', name: 'Cleo', color: '#C2502A' },
  { id: 'max', name: 'Max', color: '#8A6D0B' },
];
const IDS = PEOPLE.map((p) => p.id);
const ME = 'you';

// The trip's default categories, with the app's color remap applied.
const CATS = [
  { id: 'food', name: 'Food & drink', glyph: 'food', color: '#C2502A' },
  { id: 'transport', name: 'Transport', glyph: 'car', color: '#0F6B66' },
  { id: 'lodging', name: 'Lodging', glyph: 'bed', color: '#6A4FB3' },
  { id: 'activities', name: 'Activities', glyph: 'ticket', color: '#B0376A' },
  { id: 'shopping', name: 'Shopping & gifts', glyph: 'bag', color: '#9B4FB3' },
  { id: 'groceries', name: 'Groceries', glyph: 'cart', color: '#3E7D32' },
  { id: 'other', name: 'Other', glyph: 'other', color: '#5E6F6B' },
];
const cat = (id) => CATS.find((c) => c.id === id);

const DAYS = { 17: 'Sat, Oct 17', 18: 'Sun, Oct 18', 19: 'Mon, Oct 19', 20: 'Tue, Oct 20' };

const ex = (id, title, amount, payer, category, day, hour, extra = {}) => ({
  id, title, amount, payer, category, day, hour, people: IDS, mode: 'even', percent: {}, amounts: {}, items: [], note: '', ...extra,
});

const EXPENSES = [
  ex('hotel', 'Hotel in Alfama, 3 nights', 612, 'you', 'lodging', 17, 15, { checked: true }),
  ex('uber', 'Uber from the airport', 38.5, 'cleo', 'transport', 17, 12, {
    mode: 'amount', people: ['cleo', 'max'], amounts: { cleo: 18.5, max: 20 }, checked: true,
  }),
  ex('taberna', 'Dinner at Taberna', 142, 'ben', 'food', 17, 21, { checked: true }),
  ex('tram', 'Tram 28 tickets', 24, 'max', 'transport', 18, 10, { checked: true }),
  ex('sintra', 'Sintra day trip', 164, 'you', 'activities', 18, 9, { mode: 'percent', percent: { you: 30, ben: 30, cleo: 20, max: 20 } }),
  ex('timeout', 'Time Out Market', 96.4, 'ben', 'food', 19, 13, {
    mode: 'items',
    items: [
      { id: 'l1', name: 'Bacalhau', amount: 28, people: ['you', 'ben'] },
      { id: 'l2', name: 'Grilled octopus', amount: 32, people: ['cleo', 'max'] },
      { id: 'l3', name: 'Vinho verde', amount: 24, people: [] },
    ],
  }),
  ex('pasteis', 'Pastéis de Belém', 18.4, 'cleo', 'food', 20, 11),
  ex('fado', 'Fado night', 120, 'max', 'activities', 20, 21),
];

const MODES = [['even', 'Even'], ['percent', '%'], ['amount', 'Amount'], ['items', 'Items']];

const money = (n) => `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (v) => `${Math.round(v * 100)}%`;
const person = (id) => PEOPLE.find((p) => p.id === id);
const sortKey = (e) => e.day * 100 + e.hour;

/* ---------- SplitMath.swift, ported ---------- */

function rawShares(e) {
  if (e.mode === 'items' && e.items.length) {
    const w = {};
    e.items.forEach((line) => {
      const picked = IDS.filter((id) => line.people.includes(id));
      const ps = picked.length ? picked : IDS.filter((id) => e.people.includes(id)).length ? IDS.filter((id) => e.people.includes(id)) : IDS;
      ps.forEach((p) => { w[p] = (w[p] ?? 0) + line.amount / ps.length; });
    });
    const sum = Object.values(w).reduce((a, b) => a + b, 0);
    if (Math.abs(sum) > 1e-9) return Object.fromEntries(Object.entries(w).map(([p, v]) => [p, (e.amount * v) / sum]));
  }
  const ps = IDS.filter((id) => e.people.includes(id));
  if (!ps.length) return null;
  if (e.mode === 'percent') {
    const ws = ps.map((p) => Math.max(0, e.percent[p] ?? 0));
    const sum = ws.reduce((a, b) => a + b, 0);
    if (sum > 0) return Object.fromEntries(ps.map((p, i) => [p, (e.amount * ws[i]) / sum]));
  }
  if (e.mode === 'amount') {
    const ws = ps.map((p) => e.amounts[p] ?? 0);
    const sum = ws.reduce((a, b) => a + b, 0);
    if (Math.abs(sum) > 0.0001) return Object.fromEntries(ps.map((p, i) => [p, (e.amount * ws[i]) / sum]));
  }
  return Object.fromEntries(ps.map((p) => [p, e.amount / ps.length]));
}

function shares(e) {
  const raw = rawShares(e);
  if (!raw) return null;
  const totalCents = Math.round(e.amount * 100);
  const order = IDS.filter((id) => raw[id] !== undefined);
  const sum = order.reduce((s, p) => s + raw[p], 0);
  if (Math.abs(sum) < 1e-9) return raw;
  const exact = order.map((p) => (totalCents * raw[p]) / sum);
  const cents = exact.map((v) => Math.floor(v));
  const left = totalCents - cents.reduce((a, b) => a + b, 0);
  const byRemainder = order.map((_, i) => i).sort((a, b) => {
    const ra = exact[a] - cents[a];
    const rb = exact[b] - cents[b];
    return Math.abs(ra - rb) > 1e-9 ? rb - ra : a - b;
  });
  byRemainder.slice(0, Math.max(0, left)).forEach((i) => { cents[i] += 1; });
  return Object.fromEntries(order.map((p, i) => [p, cents[i] / 100]));
}

function signature(e) {
  const sh = rawShares(e);
  if (!sh) return '';
  const parts = Object.keys(sh).sort().map((p) => `${p}:${(sh[p] / e.amount).toFixed(4)}`);
  return `${parts.join(',')}|${e.payer}|${e.category}|${e.amount.toFixed(2)}`;
}

const verifyState = (e) => (!e.stamp ? 'todo' : e.stamp === signature(e) ? 'ok' : 'changed');

function settlement(expenses) {
  const st = { paid: {}, owed: {}, net: {}, total: 0, count: 0, transfers: [] };
  IDS.forEach((p) => { st.paid[p] = 0; st.owed[p] = 0; });
  expenses.forEach((e) => {
    if (!e.payment) { st.total += e.amount; st.count += 1; }
    const sh = shares(e);
    if (!sh) return;
    st.paid[e.payer] += e.amount;
    Object.entries(sh).forEach(([p, v]) => { st.owed[p] += v; });
  });
  IDS.forEach((p) => { st.net[p] = st.paid[p] - st.owed[p]; });
  const creditors = IDS.filter((p) => st.net[p] > 0.005).map((p) => [p, st.net[p]]).sort((a, b) => b[1] - a[1]);
  const debtors = IDS.filter((p) => st.net[p] < -0.005).map((p) => [p, -st.net[p]]).sort((a, b) => b[1] - a[1]);
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const v = Math.min(debtors[i][1], creditors[j][1]);
    if (v > 0.005) st.transfers.push({ id: `${debtors[i][0]}-${creditors[j][0]}`, from: debtors[i][0], to: creditors[j][0], amount: v });
    debtors[i][1] -= v;
    creditors[j][1] -= v;
    if (debtors[i][1] <= 0.005) i += 1;
    if (creditors[j][1] <= 0.005) j += 1;
  }
  return st;
}

function categoryBreakdown(expenses) {
  const rows = {};
  expenses.filter((e) => !e.payment).forEach((e) => {
    const sh = shares(e);
    if (!sh) return;
    Object.values(sh).forEach((v) => { rows[e.category] = (rows[e.category] ?? 0) + v; });
  });
  return CATS.filter((c) => (rows[c.id] ?? 0) > 0.005).map((c) => ({ ...c, total: rows[c.id] }));
}

function fillCustom(e) {
  const ps = IDS.filter((id) => e.people.includes(id));
  const next = { ...e, percent: {}, amounts: {} };
  if (!ps.length) return next;
  if (e.mode === 'percent') {
    const base = Math.floor(10000 / ps.length) / 100;
    ps.forEach((p, i) => { next.percent[p] = i === ps.length - 1 ? Math.round((100 - base * (ps.length - 1)) * 100) / 100 : base; });
  } else if (e.mode === 'amount') {
    const cents = Math.round(Math.abs(e.amount) * 100);
    const base = Math.floor(cents / ps.length);
    ps.forEach((p, i) => { next.amounts[p] = (i === ps.length - 1 ? cents - base * (ps.length - 1) : base) / 100; });
  }
  return next;
}

const withStamps = (list) => list.map((e) => (e.checked ? { ...e, stamp: signature(e) } : e));

/* ---------- App ---------- */

export default function SplitItDemo() {
  const nav = useStack('event');
  const [tab, setTab] = useState('summary');
  const [expenses, setExpenses] = useState(() => withStamps(EXPENSES));
  const [recording, setRecording] = useState(null);
  const [opened, setOpened] = useState(false);

  const restart = () => {
    setTab('summary');
    setExpenses(withStamps(EXPENSES));
    setRecording(null);
    setOpened(false);
    nav.reset();
  };

  const update = (id, fn) => setExpenses((list) => list.map((e) => (e.id === id ? fn(e) : e)));
  const open = (e) => { setOpened(true); nav.push('expense', 'push', { id: e.id }); };

  const top = nav.stack.filter((e) => !e.leaving).at(-1);
  const counts = useMemo(() => {
    const q = expenses.filter((e) => !e.payment);
    return { total: q.length, ok: q.filter((e) => verifyState(e) === 'ok').length, changed: q.filter((e) => verifyState(e) === 'changed').length };
  }, [expenses]);

  const render = (entry) => {
    if (entry.name === 'expense') {
      const e = expenses.find((x) => x.id === entry.props.id);
      if (!e) return null;
      return (
        <ExpenseEdit
          e={e}
          onBack={nav.pop}
          onChange={(fn) => update(e.id, fn)}
          onDelete={() => { nav.pop(); setTimeout(() => setExpenses((l) => l.filter((x) => x.id !== e.id)), 380); }}
        />
      );
    }
    return (
      <div className="sp-screen">
        <NavBar back="Events" title={<><span>🇵🇹 Lisbon (sample)</span><span className="sp-sample">Sample</span></>} more />
        <div className="sp-pills-bar">
          <Pills
            options={[['summary', 'Summary'], ['expenses', 'Expenses'], ['review', 'Review']]}
            value={tab}
            onChange={setTab}
            badges={{ review: counts.total - counts.ok }}
            hint={!opened && tab === 'summary' ? 'expenses' : null}
          />
        </div>
        <div className="sp-body" key={tab}>
          {tab === 'summary' && <Summary expenses={expenses} counts={counts} onPaid={setRecording} onTab={setTab} />}
          {tab === 'expenses' && <Expenses expenses={expenses} hint={!opened} onOpen={open} />}
          {tab === 'review' && <Review expenses={expenses} counts={counts} onCheck={(id) => update(id, (x) => ({ ...x, stamp: signature(x) }))} onFix={open} />}
        </div>
        {recording && (
          <ActionSheet
            title="Record this payment?"
            message="It's added to Expenses as a payment, so the balances update."
            action={`${person(recording.from).name} paid ${person(recording.to).name} ${money(recording.amount)}`}
            onAction={() => {
              const t = recording;
              setRecording(null);
              setExpenses((l) => [...l, ex(`pay-${Date.now()}`, `${person(t.from).name} paid ${person(t.to).name}`, Math.round(t.amount * 100) / 100, t.from, '', 21, Date.now() % 24, { people: [t.to], payment: true })]);
            }}
            onCancel={() => setRecording(null)}
          />
        )}
      </div>
    );
  };

  return (
    <PhoneFrame label="SplitIt demo" onRestart={restart}>
      <div className="demo demo-split">
        <Stack stack={nav.stack} render={render} />
        <TabBar hidden={top?.name === 'expense'} />
      </div>
    </PhoneFrame>
  );
}

function NavBar({ back, title, more, onBack }) {
  return (
    <div className="sp-navbar">
      <button className="sp-nav-back" onClick={onBack} tabIndex={onBack ? 0 : -1}>
        <svg viewBox="0 0 12 20" width="12" height="20"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {back}
      </button>
      <span className="sp-nav-title">{title}</span>
      {more && <span className="sp-nav-more"><Glyph name="dots" size={18} fill /></span>}
    </div>
  );
}

function Pills({ options, value, onChange, badges = {}, hint }) {
  return (
    <div className="sp-pills" role="tablist">
      {options.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={value === id} className={`${value === id ? 'is-on' : ''} ${hint === id ? 'hint' : ''}`} onClick={() => onChange(id)}>
          {label}
          {badges[id] > 0 && <b>{badges[id]}</b>}
        </button>
      ))}
    </div>
  );
}

function TabBar({ hidden }) {
  const tabs = [['Events', 'events', true], ['Friends', 'friends'], ['Activity', 'activity'], ['Me', 'me']];
  return (
    <nav className={`sp-tabbar ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      {tabs.slice(0, 2).map(([t, icon, on]) => <TabItem key={t} title={t} icon={icon} on={on} />)}
      <span className="sp-tab sp-tab-add">
        <span className="sp-add-circle"><Glyph name="plus" size={22} /></span>
        <span className="sp-tab-label">Add</span>
      </span>
      {tabs.slice(2).map(([t, icon]) => <TabItem key={t} title={t} icon={icon} />)}
    </nav>
  );
}

function TabItem({ title, icon, on }) {
  return (
    <span className={`sp-tab ${on ? 'is-on' : ''}`}>
      <span className="sp-tab-icon">
        {icon === 'events' && (
          <svg viewBox="0 0 26 24" width="26" height="24"><rect x="2" y="2" width="14" height="12" rx="4" /><rect x="7" y="9" width="14" height="12" rx="4" className="sp-fill" /></svg>
        )}
        {icon === 'friends' && <svg viewBox="0 0 26 24" width="26" height="24"><circle cx="9" cy="12" r="7" /><circle cx="17" cy="12" r="7" /></svg>}
        {icon === 'activity' && <svg viewBox="0 0 26 24" width="26" height="24"><path d="M6.5 16.8h13M8.3 16.8C8.3 9 9.4 4 13 4s4.7 5 4.7 12.8M11.6 20h2.8" /></svg>}
        {icon === 'me' && <svg viewBox="0 0 26 24" width="26" height="24"><circle cx="13" cy="8.6" r="3.8" /><path d="M5.5 21c.7-6.8 14.3-6.8 15 0" /></svg>}
      </span>
      <span className="sp-tab-label">{title}</span>
    </span>
  );
}

/* ---------- Summary ---------- */

function Summary({ expenses, counts, onPaid, onTab }) {
  const st = settlement(expenses);
  const rows = categoryBreakdown(expenses);
  const top = Math.max(...rows.map((r) => r.total), 1);
  const arcs = [...rows].sort((a, b) => b.total - a.total);

  return (
    <div className="sp-scroll">
      <div className="sp-hero">
        <Ring arcs={arcs} />
        <div>
          <span className="sp-hero-label">Total spent</span>
          <span className="sp-hero-total">{money(st.total)}</span>
          <span className="sp-hero-label">{st.count} expense{st.count === 1 ? '' : 's'}</span>
        </div>
      </div>

      <SectionTitle text="Settle up" />
      <div className="sp-card sp-settle">
        {st.transfers.length === 0 && (
          <div className="sp-even">
            <span className="sp-tile" style={{ background: '#E3F0EE' }}><Glyph name="check" size={13} color="#0F6B66" /></span>
            Everyone is even
          </div>
        )}
        {st.transfers.map((t, i) => (
          <div key={t.id} className="sp-transfer">
            <span className="sp-pair">
              <Avatar id={t.from} size={28} />
              <i />
              <Avatar id={t.to} size={28} />
            </span>
            <span className="sp-transfer-text">
              <span>{person(t.from).name} pays {person(t.to).name}</span>
              <b>{money(t.amount)}</b>
            </span>
            {t.from === ME ? (
              <button className="sp-pay">Pay</button>
            ) : (
              <button className={`sp-ink ${i === 0 ? 'hint' : ''}`} onClick={() => onPaid(t)}>Paid</button>
            )}
          </div>
        ))}
      </div>
      {st.transfers.length > 0 && <p className="sp-note">The fewest payments that even everyone out. Tap Paid once the money has been sent.</p>}

      <SectionTitle text="Everyone" trailing={String(PEOPLE.length)} />
      <div className="sp-people">
        {PEOPLE.map((p) => {
          const net = st.net[p.id];
          const paid = st.paid[p.id];
          const share = st.owed[p.id];
          const ratio = share > 0 ? Math.min(paid / share, 1.6) / 1.6 : paid > 0 ? 1 : 0;
          const even = Math.abs(net) < 0.005;
          return (
            <div key={p.id} className="sp-card sp-person">
              <span className="sp-person-head">
                <Avatar id={p.id} size={26} />
                <b>{p.name}</b>
                {p.id === ME && <small>you</small>}
              </span>
              <span className="sp-person-label">{even ? 'Even' : net > 0 ? 'Gets back' : 'Owes'}</span>
              <span className={`sp-person-net ${even ? '' : net > 0 ? 'is-pos' : 'is-neg'}`}>{money(Math.abs(net))}</span>
              <Bar fraction={ratio} color={p.color} height={6} />
              <span className="sp-person-foot"><span>Share {money(share)}</span><span>Paid {money(paid)}</span></span>
            </div>
          );
        })}
      </div>

      <SectionTitle text="By category" />
      <div className="sp-card sp-cats">
        {rows.map((r) => (
          <div key={r.id} className="sp-cat-row">
            <span className="sp-cat-line">
              <CatIcon c={r} size={30} />
              <b>{r.name}</b>
              <small>{pct(st.total > 0 ? r.total / st.total : 0)}</small>
              <strong>{money(r.total)}</strong>
            </span>
            <Bar fraction={r.total / top} color={r.color} />
          </div>
        ))}
      </div>

      <SectionTitle text="Review" />
      <button className="sp-card sp-review-card" onClick={() => onTab('review')}>
        <span className="sp-review-line">
          <b>{counts.ok} of {counts.total} checked</b>
          <strong>{pct(counts.ok / counts.total)}</strong>
          <Glyph name="chevron" size={11} color="#8A9894" />
        </span>
        <Bar fraction={counts.ok / counts.total} color="#0F6B66" />
        {counts.changed > 0 && <small className="sp-warn">{counts.changed} changed since checked</small>}
      </button>
    </div>
  );
}

function Ring({ arcs }) {
  const total = arcs.reduce((s, a) => s + a.total, 0) || 1;
  const r = 59;
  const c = 2 * Math.PI * r;
  const gap = arcs.length > 1 ? 3 / 360 : 0;
  let start = 0;
  return (
    <svg className="sp-ring" viewBox="0 0 132 132" width="132" height="132" aria-hidden="true">
      <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="14" />
      {arcs.map((a) => {
        const len = a.total / total;
        const from = start + gap / 2;
        const l = Math.max(len - gap, 0.002);
        start += len;
        return (
          <circle
            key={a.id}
            cx="66"
            cy="66"
            r={r}
            fill="none"
            stroke={lifted(a.color, 0.45)}
            strokeWidth="14"
            strokeDasharray={`${l * c} ${c}`}
            strokeDashoffset={-from * c}
            transform="rotate(-90 66 66)"
          />
        );
      })}
    </svg>
  );
}

function Bar({ fraction, color, height = 8 }) {
  const f = Math.min(Math.max(fraction, 0), 1);
  return (
    <span className="sp-bar" style={{ height }}>
      <i style={{ width: f > 0 ? `max(${height}px, ${f * 100}%)` : 0, background: color }} />
    </span>
  );
}

function SectionTitle({ text, trailing }) {
  return (
    <div className="sp-section-title">
      <b>{text}</b>
      {trailing && <span>{trailing}</span>}
    </div>
  );
}

/* ---------- Expenses ---------- */

function Expenses({ expenses, hint, onOpen }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const visible = expenses.filter((e) => {
    if (filter === 'unsplit' && (e.payment || shares(e))) return false;
    if (filter === 'check' && (e.payment || verifyState(e) === 'ok')) return false;
    const q = search.trim().toLowerCase();
    if (q) {
      const hay = [e.title, e.note, cat(e.category)?.name ?? '', ...e.items.map((i) => i.name)].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => sortKey(b) - sortKey(a));
  const days = [];
  visible.forEach((e) => {
    const last = days[days.length - 1];
    if (last && last.day === e.day) last.items.push(e);
    else days.push({ day: e.day, items: [e] });
  });
  const filtering = filter !== 'all' || search;

  return (
    <div className="sp-scroll sp-expenses">
      <div className="sp-search-row">
        <label className="sp-search">
          <Glyph name="search" size={15} color="#5E6F6B" />
          <input value={search} onChange={(ev) => setSearch(ev.target.value)} placeholder="Search expenses and receipt items" />
        </label>
        <span className="sp-circle-btn"><Glyph name="filter" size={14} /></span>
      </div>
      <Pills options={[['all', 'All'], ['unsplit', 'Not split'], ['check', 'To check']]} value={filter} onChange={setFilter} />
      {filtering && (
        <p className="sp-shown">{visible.length} shown · {money(visible.filter((e) => !e.payment).reduce((s, e) => s + e.amount, 0))}</p>
      )}
      {visible.length === 0 && (
        <div className="sp-empty">
          <b>Nothing matches</b>
          <span>Try another search or filter.</span>
        </div>
      )}
      {days.map((d) => (
        <section key={d.day}>
          <div className="sp-overline">
            <span>{d.day === 21 ? 'Wed, Oct 21' : DAYS[d.day]}</span>
            <span>{money(d.items.filter((e) => !e.payment).reduce((s, e) => s + e.amount, 0))}</span>
          </div>
          <div className="sp-card sp-rows">
            {d.items.map((e) => <ExpenseRow key={e.id} e={e} hint={hint && e.id === 'timeout'} onOpen={onOpen} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function ExpenseRow({ e, hint, onOpen }) {
  const sh = shares(e);
  const state = verifyState(e);
  return (
    <button className={`sp-row ${hint ? 'hint' : ''}`} onClick={() => !e.payment && onOpen(e)}>
      {e.payment ? (
        <span className="sp-tile" style={{ width: 40, height: 40, borderRadius: 12.8, background: tint('#0F6B66', 0.12) }}>
          <Glyph name="settle" size={16} color="#0F6B66" />
        </span>
      ) : (
        <CatIcon c={cat(e.category)} size={40} />
      )}
      <span className="sp-row-text">
        <span className="sp-row-title">
          <b>{e.title}</b>
          {!e.payment && state === 'ok' && <Glyph name="checkCircle" size={14} color="#0F6B66" />}
          {!e.payment && state === 'changed' && <Glyph name="alert" size={14} color="#B83C18" />}
        </span>
        {e.payment ? (
          <small>Settle-up payment</small>
        ) : (
          <span className="sp-row-meta">
            <small>{person(e.payer).name} paid · {Object.keys(sh).length} {Object.keys(sh).length === 1 ? 'person' : 'people'}</small>
            {e.mode !== 'even' && <em>{MODES.find((m) => m[0] === e.mode)[1]}</em>}
          </span>
        )}
      </span>
      <strong className={e.payment ? 'is-pos' : ''}>{e.payment ? '+' : ''}{money(e.amount)}</strong>
    </button>
  );
}

/* ---------- Review ---------- */

function Review({ expenses, counts, onCheck, onFix }) {
  const queue = expenses.filter((e) => !e.payment).sort((a, b) => sortKey(a) - sortKey(b));
  const [index, setIndex] = useState(() => Math.max(0, queue.findIndex((e) => verifyState(e) !== 'ok')));
  const [started, setStarted] = useState(false);
  const [dir, setDir] = useState(1);
  const allDone = counts.ok === counts.total && (!started || index >= queue.length);
  const i = Math.min(Math.max(index, 0), queue.length - 1);
  const e = queue[i];

  const advance = () => {
    const n = queue.length;
    let next = n;
    for (let k = 1; k <= n; k += 1) {
      const j = (i + k) % n;
      if (j !== i && verifyState(queue[j]) !== 'ok') { next = j; break; }
    }
    setDir(1);
    setIndex(next);
  };

  return (
    <div className="sp-review">
      <div className="sp-review-head">
        <span className="sp-stepper">
          <button disabled={index <= 0} onClick={() => { setDir(-1); setStarted(true); setIndex(Math.max(0, i - 1)); }} aria-label="Previous expense"><Glyph name="chevronLeft" size={12} color="#0F6B66" /></button>
          <span>{i + 1}/{queue.length}</span>
          <button disabled={index >= queue.length - 1} onClick={() => { setDir(1); setStarted(true); setIndex(Math.min(queue.length - 1, i + 1)); }} aria-label="Next expense"><Glyph name="chevron" size={12} color="#0F6B66" /></button>
        </span>
        <span className="sp-review-count">{counts.ok} of {counts.total} checked</span>
      </div>
      <div className="sp-review-progress"><Bar fraction={counts.ok / counts.total} color="#0F6B66" /></div>

      {allDone ? (
        <div className="sp-done">
          <span className="sp-done-mark"><svg viewBox="0 0 34 30" width="34" height="30"><path d="M4 15.6 13.6 24 30.6 6.6" /></svg></span>
          <b>All squared away</b>
          <span>Every expense is checked.</span>
          <button onClick={() => { setStarted(true); setDir(1); setIndex(0); }}>Review again</button>
        </div>
      ) : (
        <>
          <div className="sp-scroll sp-review-scroll">
            <ReviewCard key={e.id} e={e} dir={dir} />
          </div>
          <div className="sp-review-foot">
            <button className="sp-soft" onClick={() => onFix(e)}>Needs a fix</button>
            <button
              className="sp-brand hint"
              onClick={() => {
                if (verifyState(e) !== 'ok') onCheck(e.id);
                setStarted(true);
                setTimeout(advance, 0);
              }}
            >
              {verifyState(e) === 'ok' ? 'Next' : 'Looks right'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ReviewCard({ e, dir }) {
  const sh = shares(e);
  const state = verifyState(e);
  const method = e.mode === 'items' && e.items.length ? 'Split item by item'
    : e.mode === 'percent' ? 'Split by percentage'
      : e.mode === 'amount' ? 'Split by amount'
        : IDS.filter((id) => e.people.includes(id)).length > 1 ? 'Split evenly' : 'One person';
  return (
    <div className="sp-review-stack" style={{ '--dir': dir }}>
      {state === 'ok' && <p className="sp-banner">Already checked</p>}
      {state === 'changed' && <p className="sp-banner is-warn">Changed since you checked it</p>}
      <div className="sp-card sp-rcard">
        <div className="sp-rcard-top">
          <CatIcon c={cat(e.category)} size={48} />
          <span className="sp-rcard-day">{DAYS[e.day].toUpperCase()}</span>
          <b>{e.title}</b>
          <strong>{money(e.amount)}</strong>
        </div>
        {IDS.filter((id) => sh[id] !== undefined).map((p) => (
          <div key={p} className="sp-rcard-row">
            <i style={{ background: person(p).color }} />
            <b>{person(p).name}</b>
            <small>{pct(sh[p] / e.amount)}</small>
            <strong>{money(sh[p])}</strong>
          </div>
        ))}
        <p className="sp-rcard-foot">{person(e.payer).name} paid · {method.toLowerCase()}</p>
      </div>
      {e.mode === 'items' && <Receipt e={e} />}
    </div>
  );
}

function Receipt({ e }) {
  const extra = e.amount - e.items.reduce((s, l) => s + l.amount, 0);
  return (
    <div className="sp-receipt">
      <b className="sp-receipt-merchant">{e.title.toUpperCase()}</b>
      <span className="sp-receipt-date">{DAYS[e.day].toUpperCase()}</span>
      <span className="sp-receipt-rule" />
      {e.items.map((l) => (
        <div key={l.id} className="sp-receipt-line">
          <span>
            {l.name}
            <small>{(l.people.length ? l.people : IDS).map((id) => person(id).name).join(', ')}</small>
          </span>
          <span>{money(l.amount)}</span>
        </div>
      ))}
      <div className="sp-receipt-line is-muted"><span>Tax, tip &amp; fees</span><span>{money(extra)}</span></div>
      <span className="sp-receipt-rule" />
      <div className="sp-receipt-line is-total"><span>Total</span><span>{money(e.amount)}</span></div>
      <span className="sp-receipt-paid">Paid by {person(e.payer).name}</span>
    </div>
  );
}

/* ---------- Expense editor ---------- */

function ExpenseEdit({ e, onBack, onChange, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const state = verifyState(e);
  const sh = shares(e);
  const ps = IDS.filter((id) => e.people.includes(id));
  const set = (patch) => onChange((x) => ({ ...x, ...patch }));
  const setMode = (m) => onChange((x) => fillCustom({ ...x, people: ps.length ? x.people : IDS, mode: m }));
  const togglePerson = (p) => onChange((x) => {
    const people = x.people.includes(p) ? x.people.filter((y) => y !== p) : [...x.people, p];
    return fillCustom({ ...x, people: IDS.filter((id) => people.includes(id)) });
  });
  const toggleLine = (lineId, p) => onChange((x) => ({
    ...x,
    items: x.items.map((l) => {
      if (l.id !== lineId) return l;
      if (!p) return { ...l, people: [] };
      const people = l.people.includes(p) ? l.people.filter((y) => y !== p) : [...l.people, p];
      return { ...l, people: IDS.filter((id) => people.includes(id)) };
    }),
  }));
  const itemsTotal = e.items.reduce((s, l) => s + l.amount, 0);
  const warning = e.mode === 'percent' && Math.abs(ps.reduce((s, p) => s + (e.percent[p] ?? 0), 0) - 100) > 0.01
    ? `Adds up to ${ps.reduce((s, p) => s + (e.percent[p] ?? 0), 0)}%, not 100%. Shares are scaled to fit.` : null;

  return (
    <div className="sp-screen sp-form-screen">
      <NavBar back="Back" title={<span>{e.title}</span>} onBack={onBack} />
      <div className="sp-scroll sp-form">
        <div className="sp-group">
          <div className="sp-frow sp-checked">
            <span className="sp-check-icon">{state === 'ok' ? <Glyph name="checkCircle" size={14} color="#0F6B66" /> : state === 'changed' ? <Glyph name="alert" size={14} color="#B83C18" /> : null}</span>
            <span className="sp-grow">
              <b>Checked</b>
              {state === 'changed' && <small className="sp-warn">Changed since you checked it</small>}
            </span>
            <button
              className={`sp-toggle ${state === 'ok' ? 'is-on' : ''}`}
              role="switch"
              aria-checked={state === 'ok'}
              onClick={() => set({ stamp: state === 'ok' ? null : signature(e) })}
            ><i /></button>
          </div>
        </div>

        <div className="sp-group">
          <div className="sp-frow"><input className="sp-title-input" value={e.title} onChange={(ev) => set({ title: ev.target.value })} aria-label="What was it?" /></div>
          <div className="sp-frow sp-amount-row">
            <span className="sp-money-mark">$</span>
            <input
              className="sp-amount-input"
              inputMode="decimal"
              value={e.amountText ?? String(e.amount)}
              onChange={(ev) => {
                const v = parseFloat(ev.target.value.replace(/[^0-9.]/g, ''));
                set({ amountText: ev.target.value, amount: Number.isFinite(v) ? v : 0 });
              }}
              onBlur={() => set({ amountText: undefined })}
              aria-label="Amount"
            />
            <span className="sp-grow" />
            <span className="sp-mono">USD</span>
          </div>
          <div className="sp-frow">
            <b className="sp-grow">Date</b>
            <span className="sp-date-pill">{DAYS[e.day].split(', ')[1]}, 2026</span>
            <span className="sp-date-pill">{e.hour % 12 || 12}:00 {e.hour < 12 ? 'AM' : 'PM'}</span>
          </div>
          <div className="sp-frow sp-catpick">
            <div className="sp-catpick-head">
              <b>Category</b>
              <small>{cat(e.category)?.name ?? 'No category'}</small>
            </div>
            <div className="sp-catpick-rail">
              {CATS.map((c) => (
                <button key={c.id} className={c.id === e.category ? 'is-on' : ''} onClick={() => set({ category: c.id })} style={{ '--c': c.color }}>
                  <CatIcon c={c} size={40} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Overline text="Paid by" />
        <div className="sp-group">
          <div className="sp-frow sp-chiprow">
            {PEOPLE.map((p) => <Chip key={p.id} p={p} on={e.payer === p.id} onClick={() => set({ payer: p.id })} />)}
          </div>
        </div>

        <Overline text="Split" />
        <div className="sp-group">
          <div className="sp-frow"><Pills options={MODES} value={e.mode} onChange={setMode} /></div>
          {e.mode !== 'items' && (
            <div className="sp-frow sp-chiprow">
              <Chip p={{ name: 'Everyone', color: '#0F6B66' }} on={ps.length === IDS.length} onClick={() => onChange((x) => fillCustom({ ...x, people: ps.length === IDS.length ? [] : IDS }))} />
              {PEOPLE.map((p) => <Chip key={p.id} p={p} on={e.people.includes(p.id)} onClick={() => togglePerson(p.id)} />)}
            </div>
          )}
          {e.mode === 'percent' && ps.map((p) => (
            <div key={p} className="sp-frow">
              <Dot id={p} />
              <input className="sp-num-input" inputMode="decimal" value={e.percent[p] ?? 0} onChange={(ev) => onChange((x) => ({ ...x, percent: { ...x.percent, [p]: parseFloat(ev.target.value) || 0 } }))} aria-label={`${person(p).name} percent`} />
              <small className="sp-unit">%</small>
            </div>
          ))}
          {e.mode === 'amount' && ps.map((p) => (
            <div key={p} className="sp-frow">
              <Dot id={p} />
              <small className="sp-unit">$</small>
              <input className="sp-num-input sp-num-short" inputMode="decimal" value={e.amounts[p] ?? 0} onChange={(ev) => onChange((x) => ({ ...x, amounts: { ...x.amounts, [p]: parseFloat(ev.target.value) || 0 } }))} aria-label={`${person(p).name} amount`} />
            </div>
          ))}
        </div>
        {warning && <p className="sp-foot sp-warn">{warning}</p>}
        {e.mode === 'items' && (
          <p className="sp-foot">Tap people on each line. Lines with nobody picked are shared by everyone. Tax, tip and fees are shared in proportion to what each person had.</p>
        )}

        {e.mode === 'items' && (
          <>
            <Overline text="Receipt items (USD)" />
            <div className="sp-group">
              {e.items.map((l) => (
                <div key={l.id} className="sp-frow sp-line">
                  <div className="sp-line-top">
                    <b>{l.name}</b>
                    <span className="sp-line-amt"><small>$</small>{l.amount}</span>
                  </div>
                  <div className="sp-chiprow">
                    <Chip small p={{ name: 'Everyone', color: '#0F6B66' }} on={!l.people.length} onClick={() => toggleLine(l.id, null)} />
                    {PEOPLE.map((p) => <Chip small key={p.id} p={p} on={l.people.includes(p.id)} onClick={() => toggleLine(l.id, p.id)} />)}
                  </div>
                </div>
              ))}
              <div className="sp-frow sp-add-item">
                <span><Glyph name="plus" size={12} color="#0F6B66" /></span>
                Add item
              </div>
              <div className="sp-frow"><b className="sp-grow">Items</b><b>{money(itemsTotal)}</b></div>
              <div className="sp-frow sp-muted-row"><span className="sp-grow">Tax, tip &amp; fees</span><span>{money(e.amount - itemsTotal)}</span></div>
            </div>
          </>
        )}

        {sh && (
          <>
            <Overline text="Each person's share" />
            <div className="sp-group">
              {IDS.filter((id) => sh[id] !== undefined).map((p) => (
                <div key={p} className="sp-frow">
                  <Dot id={p} />
                  <small className="sp-pct">{pct(sh[p] / e.amount)}</small>
                  <strong className="sp-share-amt">{money(sh[p])}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        <Overline text="Note" />
        <div className="sp-group">
          <div className="sp-frow"><input className="sp-note-input" value={e.note} onChange={(ev) => set({ note: ev.target.value })} placeholder="Anything worth remembering" /></div>
        </div>

        <div className="sp-group sp-actions">
          <div className="sp-frow sp-action"><Glyph name="search" size={15} color="#0F6B66" />Search on Google</div>
          <div className="sp-frow sp-action"><Glyph name="archive" size={15} color="#0F6B66" />Archive (keep, but don't count it)</div>
          <button className="sp-frow sp-action is-neg" onClick={() => setConfirm(true)}><Glyph name="close" size={15} color="#B5461F" />Delete expense</button>
        </div>
      </div>
      {confirm && (
        <ActionSheet title="Delete this expense?" action="Delete" destructive onAction={() => { setConfirm(false); onDelete(); }} onCancel={() => setConfirm(false)} />
      )}
    </div>
  );
}

function Overline({ text }) {
  return <p className="sp-overline sp-form-overline"><span>{text}</span></p>;
}

function Chip({ p, on, onClick, small }) {
  return (
    <button
      className={`sp-chip ${on ? 'is-on' : ''} ${small ? 'is-small' : ''}`}
      style={{ '--c': p.color, '--t': tint(p.color, 0.18) }}
      onClick={onClick}
      aria-pressed={on}
    >
      {on && <svg viewBox="0 0 12 12" width={small ? 9 : 11} height={small ? 9 : 11}><path d="M2 6.5 4.8 9.2 10 3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {p.name}
    </button>
  );
}

function Dot({ id }) {
  return (
    <span className="sp-dot sp-grow">
      <i style={{ background: person(id).color }} />
      {person(id).name}
    </span>
  );
}

function ActionSheet({ title, message, action, destructive, onAction, onCancel }) {
  return (
    <div className="sp-dim" onClick={onCancel}>
      <div className="sp-sheet" onClick={(ev) => ev.stopPropagation()}>
        <div className="sp-sheet-group">
          <div className="sp-sheet-head">
            <b>{title}</b>
            {message && <span>{message}</span>}
          </div>
          <button className={`${destructive ? 'is-destructive' : ''} hint`} onClick={onAction}>{action}</button>
        </div>
        <button className="sp-sheet-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function Avatar({ id, size = 22 }) {
  const p = person(id);
  return (
    <span className="sp-avatar" style={{ width: size, height: size, fontSize: size * 0.42, color: p.color, background: tint(p.color, 0.18) }} aria-hidden="true">
      {p.name[0].toUpperCase()}
    </span>
  );
}

/* ---------- Glyphs (Views/Components.swift) ---------- */

const ICON = {
  food: 'M7 3V10 M4.5 3V7.5C4.5 8.9 5.6 10 7 10C8.4 10 9.5 8.9 9.5 7.5V3 M7 10V21 M17 21V3C15 4.5 14 7.5 14 11C14 12.4 15 13.5 16.3 13.5H17',
  car: 'M5.7 17H3V12.5L5 7.6C5.3 6.7 6.1 6 7.1 6H16.9C17.9 6 18.7 6.7 19 7.6L21 12.5V17H18.3 M9.3 17H14.7 M3.5 12H20.5',
  bed: 'M3 5V19 M3 15H21V19 M21 15V12C21 10.3 19.7 9 18 9H11V15',
  ticket: 'M3.5 7H20.5V10C19.4 10 18.5 10.9 18.5 12C18.5 13.1 19.4 14 20.5 14V17H3.5V14C4.6 14 5.5 13.1 5.5 12C5.5 10.9 4.6 10 3.5 10Z M14.5 8V9.2 M14.5 11.4V12.6 M14.5 14.8V16',
  bag: 'M5 8.5H19L18.1 20.5H5.9Z M9 11V7C9 5.3 10.3 4 12 4C13.7 4 15 5.3 15 7V11',
  cart: 'M2.5 4H5L7.3 15H18L20 7.5H5.9',
  other: '',
};
const ICON_CIRCLES = {
  car: [[7.5, 17, 1.8], [16.5, 17, 1.8]],
  bed: [[6.8, 11.6, 1.9]],
  cart: [[9, 19.3, 1.4], [16.3, 19.3, 1.4]],
  other: [[5.5, 12, 0.6], [12, 12, 0.6], [18.5, 12, 0.6]],
};

function CatIcon({ c, size = 34 }) {
  const s = size * 0.5;
  return (
    <span className="sp-tile" style={{ width: size, height: size, borderRadius: size * 0.32, background: tint(c.color, 0.12) }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={c.color} strokeWidth={Math.max(s * 0.085, 1.4) * (24 / s)} strokeLinecap="round" strokeLinejoin="round">
        {ICON[c.glyph] && <path d={ICON[c.glyph]} />}
        {(ICON_CIRCLES[c.glyph] ?? []).map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
      </svg>
    </span>
  );
}

const GLYPH = {
  plus: [[[0.5, 0.1], [0.5, 0.9]], [[0.1, 0.5], [0.9, 0.5]]],
  check: [[[0.12, 0.52], [0.4, 0.8], [0.9, 0.22]]],
  chevron: [[[0.34, 0.12], [0.7, 0.5], [0.34, 0.88]]],
  chevronLeft: [[[0.66, 0.12], [0.3, 0.5], [0.66, 0.88]]],
  close: [[[0.18, 0.18], [0.82, 0.82]], [[0.82, 0.18], [0.18, 0.82]]],
  filter: [[[0.08, 0.24], [0.92, 0.24]], [[0.24, 0.5], [0.76, 0.5]], [[0.4, 0.76], [0.6, 0.76]]],
  settle: [[[0, 0.5], [0.18, 0.5]], [[0.3, 0.5], [0.72, 0.5]], [[0.56, 0.32], [0.74, 0.5], [0.56, 0.68]], [[0.86, 0.5], [1, 0.5]]],
  search: [[[0.65, 0.65], [0.92, 0.92]]],
  checkCircle: [[[0.3, 0.52], [0.45, 0.66], [0.7, 0.36]]],
  alert: [[[0.5, 0.28], [0.5, 0.56]], [[0.5, 0.72], [0.5, 0.73]]],
  archive: [[[0.16, 0.36], [0.16, 0.88], [0.84, 0.88], [0.84, 0.36]], [[0.4, 0.56], [0.6, 0.56]]],
};

function Glyph({ name, size = 16, color = 'currentColor', fill }) {
  const weight = name === 'settle' ? 0.14 : 0.12;
  const sw = Math.max(size * weight, 1.4) / size;
  const pts = GLYPH[name] ?? [];
  return (
    <svg viewBox="0 0 1 1" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ overflow: 'visible' }}>
      {pts.map((line, i) => <polyline key={i} points={line.map(([x, y]) => `${x},${y}`).join(' ')} />)}
      {name === 'search' && <circle cx="0.42" cy="0.42" r="0.3" />}
      {(name === 'checkCircle' || name === 'alert') && <circle cx="0.5" cy="0.5" r="0.44" />}
      {name === 'archive' && <rect x="0.08" y="0.14" width="0.84" height="0.22" rx="0.06" />}
      {name === 'dots' && fill && [0.16, 0.5, 0.84].map((x) => <circle key={x} cx={x} cy="0.5" r="0.1" fill={color} stroke="none" />)}
    </svg>
  );
}
