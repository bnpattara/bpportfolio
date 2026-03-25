"use client";

import React, { useState, useRef, useEffect } from 'react';
import { QUESTIONS, SCRIPTS } from './data/scripts';

const D = {
  bg: '#0a0a0a',
  panel: '#111',
  border: '#1e1e1e',
  b2: '#2a2a2a',
  label: '#777',
  mid: '#aaa',
  sub: 'rgba(255,255,255,.72)',
  bright: 'rgba(255,255,255,.92)',
  white: '#fff',
  font: "'Helvetica Neue', Arial, sans-serif",
} as const;

const PERSONAS = [
  { id: 'sarah', name: 'Sarah', role: 'The Pragmatist', meta: 'Project Manager · 32', bio: 'Values efficiency and durability. Rejects hype. Buys on data.', initials: 'SP', accent: '#4d8c53' },
  { id: 'david', name: 'David', role: 'The Anxious Collector', meta: 'Tech Professional · 29', bio: 'High earner with deadstock paralysis. Treats sneakers as assets.', initials: 'DA', accent: '#4060a0' },
  { id: 'chloe', name: 'Chloe', role: 'The Style Seeker', meta: 'Social Media Manager · 24', bio: 'Dupe economy architect. Decouples aesthetic from brand. Zero loyalty.', initials: 'CS', accent: '#8c3c3c' },
  { id: 'maya', name: 'Maya', role: 'The Individualist', meta: 'Creative Professional · 26', bio: 'Shops vintage Nike. Values provenance and circular economy.', initials: 'MI', accent: '#6040a0' },
  { id: 'alex', name: 'Alex', role: 'The Hypebeast', meta: 'Student / Reseller · 22', bio: 'Views SNKRS drops as financial assets. Deep in cook groups.', initials: 'AH', accent: '#905030' },
];

interface Msg { id: string; from: 'user' | 'persona'; personaId?: string; text: string; }

export default function PersonaTool() {
  const [mode, setMode] = useState<'individual' | 'focus'>('individual');
  const [selId, setSelId] = useState<string | null>(null);
  const [focusIds, setFocusIds] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = chatRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [msgs, typing]);

  const active = mode === 'individual'
    ? PERSONAS.filter(p => p.id === selId)
    : PERSONAS.filter(p => focusIds.includes(p.id));

  const canAsk = active.length > 0 && !typing;
  const getP = (id: string) => PERSONAS.find(p => p.id === id);
  const getAns = (pid: string, qid: string) =>
    SCRIPTS.find(s => s.personaId === pid)?.answers[qid] ?? "I don't have a strong view on that.";

  const ask = async (q: { id: string; text: string }) => {
    if (!canAsk) return;
    setMsgs(prev => [...prev, { id: Date.now().toString(), from: 'user', text: q.text }]);
    setTyping(true);
    for (let i = 0; i < active.length; i++) {
      const p = active[i];
      const ans = getAns(p.id, q.id);
      await new Promise(r => setTimeout(r, i === 0 ? 500 : 300));
      await new Promise(r => setTimeout(r, Math.min(ans.length * 12, 1000) + i * 280));
      setMsgs(prev => [...prev, { id: Date.now().toString() + p.id, from: 'persona', personaId: p.id, text: ans }]);
    }
    setTyping(false);
  };

  const reset = () => { setMsgs([]); setTyping(false); setSelId(null); setFocusIds([]); };

  const switchMode = (m: 'individual' | 'focus') => {
    setMode(m); setMsgs([]); setTyping(false); setSelId(null); setFocusIds([]);
  };

  return (
    <div
      className="nike-pt-root"
      style={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        height: '100%',
        width: '100%',
        fontFamily: D.font,
        background: D.bg,
        overflow: 'hidden',
      }}
    >

      {/* ─── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside
        className="nike-pt-aside"
        style={{ width: 'min(280px, max(240px, 28vw))', flexShrink: 0, borderRight: `1px solid ${D.border}`, display: 'flex', flexDirection: 'column' }}
      >

        {/* Header */}
        <div style={{ padding: '22px 20px 16px', borderBottom: `1px solid ${D.border}` }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: D.label, marginBottom: '6px' }}>
            Research Artifact · Nike SNKRS
          </div>
          <div style={{ fontSize: '19px', fontWeight: 300, letterSpacing: '.05em', textTransform: 'uppercase', color: D.white, lineHeight: 1.1 }}>
            Consumer<br />Persona Tool
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${D.border}`, display: 'flex', gap: '1px' }}>
          {(['individual', 'focus'] as const).map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: '8px 0',
              fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
              border: 'none', background: mode === m ? D.white : 'transparent',
              color: mode === m ? D.bg : D.label,
              cursor: 'pointer', transition: 'all 150ms ease',
            }}>
              {m === 'individual' ? 'Inquiry' : 'Focus Group'}
            </button>
          ))}
        </div>

        {/* Persona cards */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '8px 20px 6px', borderBottom: `1px solid ${D.border}` }}>
            <span style={{ fontSize: '10px', color: D.label, letterSpacing: '.08em' }}>
              {mode === 'individual' ? 'Select one segment' : 'Select 2–5 segments'}
            </span>
          </div>
          {PERSONAS.map(p => {
            const isSel = mode === 'individual' ? selId === p.id : focusIds.includes(p.id);
            return (
              <button key={p.id} onClick={() => {
                if (mode === 'individual') {
                  if (selId !== p.id) { setSelId(p.id); setMsgs([]); setTyping(false); }
                } else {
                  setFocusIds(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]);
                  setMsgs([]); setTyping(false);
                }
              }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  width: '100%', padding: '13px 20px',
                  background: isSel ? D.panel : 'transparent',
                  border: 'none', borderBottom: `1px solid ${D.border}`,
                  borderLeft: isSel ? `3px solid ${p.accent}` : '3px solid transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 120ms ease',
                }}
              >
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: isSel ? p.accent : '#1c1c1c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: D.white,
                  border: `1px solid ${isSel ? p.accent : '#2a2a2a'}`,
                  transition: 'all 150ms ease',
                }}>{p.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: isSel ? D.white : D.mid, transition: 'color 120ms ease', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '11px', color: D.label, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.role}
                  </div>
                </div>
                {mode === 'focus' && (
                  <div style={{ marginLeft: 'auto', flexShrink: 0, width: '16px', height: '16px', borderRadius: '50%', border: `1px solid ${isSel ? p.accent : D.b2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}>
                    {isSel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.accent }} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${D.border}` }}>
          <div style={{ fontSize: '10px', color: D.label, lineHeight: 1.6 }}>
            Built from <span style={{ color: D.mid }}>629 research touchpoints</span> — surveys, interviews &amp; behavioral data.
          </div>
          {msgs.length > 0 && (
            <button onClick={reset} style={{
              marginTop: '10px', width: '100%', padding: '7px 0',
              fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
              border: `1px solid ${D.b2}`, background: 'transparent', color: D.label,
              cursor: 'pointer', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = D.white; el.style.borderColor = '#444'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = D.label; el.style.borderColor = D.b2; }}
            >
              ↺ Reset Session
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN AREA ────────────────────────────────────────────────────────── */}
      <main className="nike-pt-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Status bar */}
        <div style={{ padding: '0 24px', height: '52px', borderBottom: `1px solid ${D.border}`, background: D.panel, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {active.length > 0 ? (
              <>
                <div style={{ display: 'flex' }}>
                  {active.slice(0, 5).map((p, i) => (
                    <div key={p.id} style={{ width: '26px', height: '26px', borderRadius: '50%', background: p.accent, border: `2px solid ${D.bg}`, marginLeft: i > 0 ? '-7px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: D.white }}>
                      {p.initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: D.bright }}>
                    {mode === 'individual' ? `${active[0].name} — ${active[0].role}` : `Focus Group · ${active.length} participants`}
                  </div>
                  {mode === 'individual' && active[0] && (
                    <div style={{ fontSize: '11px', color: D.mid, marginTop: '1px' }}>{active[0].bio}</div>
                  )}
                </div>
              </>
            ) : (
              <span style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: D.label }}>Select a segment from the sidebar</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: active.length > 0 ? '#4a8' : '#2a2a2a', boxShadow: active.length > 0 ? '0 0 6px rgba(68,170,100,.5)' : 'none', transition: 'all 300ms' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: D.label }}>
              {active.length > 0 ? 'Live' : 'Idle'}
            </span>
          </div>
        </div>

        {/* Chat */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {msgs.length === 0 && (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', color: D.border, marginBottom: '12px' }}>◎</div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: D.label }}>
                  {active.length === 0 ? 'Select a segment to begin the inquiry' : 'Choose a question below to extract insights'}
                </div>
              </div>
            </div>
          )}

          {msgs.map(msg => {
            const p = msg.personaId ? getP(msg.personaId) : null;
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-start' }}>
                {msg.from === 'persona' && p && (
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: p.accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: D.white, marginTop: '14px' }}>
                    {p.initials}
                  </div>
                )}
                <div style={{ maxWidth: '78%' }}>
                  {msg.from === 'persona' && p && (
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: p.accent, marginBottom: '5px' }}>
                      {p.name} &mdash; {p.role}
                    </div>
                  )}
                  <div style={{
                    padding: '12px 16px',
                    background: msg.from === 'user' ? D.white : D.panel,
                    color: msg.from === 'user' ? D.bg : D.bright,
                    fontSize: '13px', lineHeight: 1.75,
                    borderLeft: msg.from === 'persona' && p ? `2px solid ${p.accent}` : 'none',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {typing && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1c1c1c', flexShrink: 0 }} />
              <div style={{ padding: '12px 16px', background: D.panel, display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: D.label, animation: `ptb 1s ease infinite ${i * .14}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Questions */}
        <div style={{ borderTop: `1px solid ${D.border}`, flexShrink: 0 }}>
          <div style={{ padding: '10px 20px 8px', borderBottom: `1px solid ${D.border}`, background: D.panel }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: D.label }}>
              {canAsk ? 'Select Inquiry Topic' : !active.length ? 'Awaiting segment selection' : 'Processing response…'}
            </span>
          </div>
          <div className="nike-pt-question-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: D.border }}>
            {QUESTIONS.map(q => (
              <button key={q.id} onClick={() => ask(q)} disabled={!canAsk}
                style={{
                  padding: '13px 16px',
                  fontSize: '12px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '.02em',
                  border: 'none',
                  background: canAsk ? D.bg : '#0d0d0d',
                  color: canAsk ? D.mid : D.label,
                  cursor: canAsk ? 'pointer' : 'not-allowed',
                  textAlign: 'left', transition: 'all 100ms ease',
                }}
                onMouseEnter={e => { if (canAsk) { const el = e.currentTarget as HTMLButtonElement; el.style.background = '#181818'; el.style.color = D.white; } }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = canAsk ? D.bg : '#0d0d0d'; el.style.color = canAsk ? D.mid : D.label; }}
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes ptb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @media (max-width: 720px) {
          .nike-pt-root{flex-direction:column!important;overflow:auto!important;height:auto!important;min-height:100dvh!important;-webkit-overflow-scrolling:touch}
          .nike-pt-aside{width:100%!important;max-height:42vh;border-right:none!important;border-bottom:1px solid ${D.border}}
          .nike-pt-main{min-height:min(58vh,520px);flex:1}
          .nike-pt-question-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}