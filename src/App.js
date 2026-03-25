import React, { useState, useEffect } from "react";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
    input[type=number] { -moz-appearance: textfield; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #111; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
    .day-card { transition: transform 0.15s ease; }
    .day-card:hover { transform: translateY(-2px); }
    .done-card { opacity: 0.7; }
    .week-btn:hover { background: #c8ff00 !important; color: #000 !important; }
    .tab-btn { transition: all 0.2s ease; }
    .check-btn { transition: all 0.2s ease; }
    .check-btn:hover { transform: scale(1.1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease; }
  `}</style>
);

// ─── Schedule Data ────────────────────────────────────────────────────────────
const SCHEDULE = {
  dilluns: {
    name: "Dilluns", short: "LUN", muscles: "Pecho · Hombro · Tríceps", accent: "#c8ff00",
    cardio: true,
    exercises: [
      { id: "press_banca_manc", name: "Press Banca Mancuernas", sets: "4×12", weight: 14 },
      { id: "peck_deck_l", name: "Peck Deck", sets: "4×15", weight: 35 },
      { id: "press_militar", name: "Press Militar Mancuernas", sets: "4×10", weight: 14 },
      { id: "elev_lat_l", name: "Elevaciones Laterales", sets: "4×12", weight: 7 },
      { id: "ext_triceps", name: "Extensión Tríceps Polea Alta", sets: "4×15", weight: 15 },
    ]
  },
  dimarts: {
    name: "Dimarts", short: "MAR", muscles: "Espalda · Bíceps", accent: "#38bdf8",
    cardio: true,
    exercises: [
      { id: "jalon_t", name: "Jalón al Pecho", sets: "4×12", weight: 16 },
      { id: "remo_polea", name: "Remo en Polea Baja", sets: "4×12", weight: 16.5 },
      { id: "remo_manc_t", name: "Remo con Mancuerna", sets: "4×10/brazo", weight: 16 },
      { id: "curl_manc_t", name: "Curl Bíceps Mancuernas", sets: "4×12/brazo", weight: 8 },
      { id: "curl_martillo", name: "Curl Martillo", sets: "4×fallo", weight: 7 },
    ]
  },
  dimecres: {
    name: "Dimecres", short: "MIÉ", muscles: "Cardio", accent: "#f97316",
    cardio: false,
    exercises: []
  },
  dijous: {
    name: "Dijous", short: "JUE", muscles: "Piernas · Abdomen", accent: "#e879f9",
    cardio: false,
    exercises: [
      { id: "prensa", name: "Prensa de Piernas", sets: "4×12", weight: 95 },
      { id: "ext_cuad", name: "Extensión Cuádriceps", sets: "4×12", weight: 55 },
      { id: "curl_fem", name: "Curl Femoral", sets: "4×12", weight: 30 },
      { id: "gemelos", name: "Gemelos en Máquina", sets: "4×15", weight: 100 },
      { id: "plancha", name: "Plancha", sets: "4×60s", weight: null },
      { id: "maq_abd", name: "Máquina Abdomen", sets: "4×12", weight: 45 },
    ]
  },
  divendres: {
    name: "Divendres", short: "VIE", muscles: "Pecho · Espalda", accent: "#fb7185",
    cardio: true,
    exercises: [
      { id: "press_incl", name: "Press Banca Inclinado", sets: "4×12", weight: 14 },
      { id: "peck_deck_v", name: "Peck Deck", sets: "4×15", weight: 35 },
      { id: "jalon_v", name: "Jalón al Pecho", sets: "4×12", weight: 42 },
      { id: "remo_manc_v", name: "Remo con Mancuerna", sets: "4×10/brazo", weight: 16 },
      { id: "pullover", name: "Pull-over Polea Alta", sets: "4×15", weight: 21 },
    ]
  },
  dissabte: {
    name: "Dissabte", short: "SÁB", muscles: "Hombro · Bíceps · Tríceps", accent: "#facc15",
    cardio: true,
    exercises: [
      { id: "elev_lat_s", name: "Elevaciones Laterales", sets: "4×15", weight: 7 },
      { id: "pajaro", name: "Pájaro", sets: "4×15", weight: 5 },
      { id: "curl_barra_z", name: "Curl Bíceps Barra Z", sets: "4×12", weight: 12 },
      { id: "curl_conc", name: "Curl Concentrado", sets: "4×12/brazo", weight: 6 },
      { id: "press_frances", name: "Press Francés Mancuernas", sets: "4×12", weight: 8 },
      { id: "maq_fondos", name: "Máquina de Fondos", sets: "4×fallo", weight: 20 },
    ]
  }
};

const DAYS = ['dilluns','dimarts','dimecres','dijous','divendres','dissabte'];
const RUN_TARGETS = [0,0,0,0,3,3,4,4,5.5,5.5,7,7,8.5,8.5,10];
const ALL_EXERCISES = DAYS.flatMap(d =>
  SCHEDULE[d].exercises.filter(e => e.weight !== null).map(e => ({ ...e, day: d }))
);

const getCardioInstructions = (week) => {
  if (week <= 3) return [
    { dur: '5 min',  label: 'Caminata',                color: '#888' },
    { dur: '10 min', label: 'Trote suave (~7 km/h)',    color: '#c8ff00' },
    { dur: '5 min',  label: 'Caminata',                color: '#888' },
  ];
  if (week <= 6) return [
    { dur: '3 min',  label: 'Caminata',                color: '#888' },
    { dur: '14 min', label: 'Trote (~7-8 km/h)',        color: '#c8ff00' },
    { dur: '3 min',  label: 'Caminata',                color: '#888' },
  ];
  if (week <= 10) return [
    { dur: '2 min',  label: 'Caminata',                color: '#888' },
    { dur: '16 min', label: 'Trote continuo (~8 km/h)', color: '#c8ff00' },
    { dur: '2 min',  label: 'Caminata',                color: '#888' },
  ];
  return [
    { dur: '20 min', label: 'Intervalos: 1 min rápido / 2 min suave', color: '#f97316' },
  ];
};

// ─── Init ─────────────────────────────────────────────────────────────────────
const initAllData = () => {
  const d = {};
  for (let w = 1; w <= 15; w++) {
    d[w] = {};
    DAYS.forEach(day => {
      const exMap = {};
      SCHEDULE[day].exercises.forEach(ex => { exMap[ex.id] = ex.weight; });
      d[w][day] = { done: false, exercises: exMap, cardio_done: false, run_km: "" };
    });
  }
  return d;
};

const getWeekDates = (week) => {
  const start = new Date(2026, 2, 30);
  const wStart = new Date(start);
  wStart.setDate(start.getDate() + (week - 1) * 7);
  const wEnd = new Date(wStart);
  wEnd.setDate(wStart.getDate() + 5);
  const fmt = (d) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return `${fmt(wStart)} – ${fmt(wEnd)}`;
};

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
const SvgLineChart = ({ series, yMax, xLabels, refY, refLabel }) => {
  const W = 560, H = 180, PL = 36, PR = 12, PT = 12, PB = 28;
  const cw = W - PL - PR, ch = H - PT - PB;
  const n = xLabels.length;
  const toX = i => PL + (i / (n - 1)) * cw;
  const toY = v => PT + ch - (v / yMax) * ch;
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((yMax / 4) * i));

  const makePath = (data, connectNulls) => {
    let path = '';
    data.forEach((v, i) => {
      if (v == null) return;
      const px = toX(i), py = toY(v);
      const prevValid = connectNulls
        ? data.slice(0, i).some(val => val != null)
        : data[i - 1] != null;
      if (!prevValid || path === '') path += `M${px.toFixed(1)},${py.toFixed(1)}`;
      else path += `L${px.toFixed(1)},${py.toFixed(1)}`;
    });
    return path;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)} stroke="#222" strokeWidth="1" />
          <text x={PL - 4} y={toY(v) + 4} fill="#444" fontSize="9" textAnchor="end">{v}</text>
        </g>
      ))}
      {refY != null && (
        <>
          <line x1={PL} y1={toY(refY)} x2={W - PR} y2={toY(refY)} stroke="#333" strokeWidth="1" strokeDasharray="4,3" />
          <text x={PL + 4} y={toY(refY) - 4} fill="#444" fontSize="9">{refLabel}</text>
        </>
      )}
      {xLabels.map((label, i) => i % 2 === 0 && (
        <text key={i} x={toX(i)} y={H - 4} fill="#444" fontSize="9" textAnchor="middle">{label}</text>
      ))}
      {series.map((s, si) => (
        <g key={si}>
          <path d={makePath(s.data, s.connectNulls)} fill="none" stroke={s.color}
            strokeWidth={s.width || 2} strokeDasharray={s.dashed ? '5,4' : undefined} />
          {s.dots !== false && s.data.map((v, i) => v != null && (
            <circle key={i} cx={toX(i)} cy={toY(v)} r="4" fill={s.color} />
          ))}
        </g>
      ))}
    </svg>
  );
};

// ─── WeightInput ──────────────────────────────────────────────────────────────
const WeightInput = ({ value, onChange, accent }) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value ?? "");
  useEffect(() => { setLocal(value ?? ""); }, [value]);
  const commit = () => {
    const n = parseFloat(local);
    onChange(isNaN(n) ? value : n);
    setEditing(false);
  };
  if (value === null) return <span style={{ color: '#555', fontSize: 13 }}>—</span>;
  return editing ? (
    <input autoFocus type="number" value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      style={{ width: 54, background: '#0a0a0a', border: `1px solid ${accent}`, color: accent, borderRadius: 6, padding: '2px 6px', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 600, textAlign: 'center' }}
    />
  ) : (
    <button onClick={() => setEditing(true)}
      style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: '#fff', padding: '2px 8px', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer', minWidth: 48 }}>
      {value} <span style={{ color: '#666', fontWeight: 400 }}>kg</span>
    </button>
  );
};

// ─── DayCard ──────────────────────────────────────────────────────────────────
const DayCard = ({ dayKey, data, week, onUpdate, onToggleDone }) => {
  const sch = SCHEDULE[dayKey];
  const isDimecres = dayKey === 'dimecres';
  const runTarget = RUN_TARGETS[week - 1];

  return (
    <div className={`day-card ${data.done ? 'done-card' : ''}`} style={{
      background: data.done ? '#1a1a1a' : '#141414',
      border: `1px solid ${data.done ? '#2a2a2a' : '#222'}`,
      borderRadius: 14, padding: 16, borderTop: `3px solid ${sch.accent}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, color: data.done ? '#555' : '#fff', letterSpacing: 1, lineHeight: 1 }}>
            {sch.name}
          </div>
          <div style={{ fontSize: 11, color: sch.accent, fontWeight: 600, marginTop: 3, letterSpacing: 0.5, opacity: data.done ? 0.5 : 1 }}>
            {sch.muscles}
          </div>
        </div>
        <button className="check-btn" onClick={() => onToggleDone(dayKey)} style={{
          width: 28, height: 28, borderRadius: '50%',
          background: data.done ? '#2d5a1b' : '#1f1f1f',
          border: `2px solid ${data.done ? '#4ade80' : '#333'}`,
          cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80',
        }}>
          {data.done ? '✓' : ''}
        </button>
      </div>

      {isDimecres ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#1f1f1f', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 13, color: '#aaa', fontFamily: 'DM Sans' }}>🔥 Bootcamp — 45 min</div>
          </div>
          {runTarget > 0 ? (
            <div style={{ background: '#1f1f1f', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: '#aaa', fontFamily: 'DM Sans' }}>
                  🏃 Carrera larga — objetivo <span style={{ color: sch.accent, fontWeight: 700 }}>{runTarget} km</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="number" placeholder="km" value={data.run_km}
                    onChange={e => onUpdate(dayKey, 'run_km', e.target.value)}
                    style={{ width: 52, background: '#0a0a0a', border: `1px solid ${sch.accent}55`, borderRadius: 6, padding: '3px 6px', color: '#fff', fontSize: 13, fontFamily: 'DM Sans', textAlign: 'center' }} />
                  <span style={{ color: '#555', fontSize: 12 }}>km</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#1f1f1f', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#555', fontFamily: 'DM Sans', fontStyle: 'italic' }}>
                Semanas 1–4: solo bootcamp. La carrera empieza en semana 5.
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
            {sch.exercises.map(ex => (
              <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#1a1a1a', borderRadius: 8 }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                  <div style={{ fontSize: 12, color: data.done ? '#444' : '#ddd', fontFamily: 'DM Sans', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ex.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#555', fontFamily: 'DM Sans' }}>{ex.sets}</div>
                </div>
                <WeightInput value={data.exercises[ex.id]} onChange={v => onUpdate(dayKey, 'exercise', ex.id, v)} accent={sch.accent} />
              </div>
            ))}
          </div>
          {sch.cardio && (
            <div style={{ background: '#1a1a1a', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#777', fontFamily: 'DM Sans' }}>🏃 20 min cinta</span>
                <button onClick={() => onUpdate(dayKey, 'cardio_done', null, !data.cardio_done)} style={{
                  fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: data.cardio_done ? '#2d5a1b' : '#222', color: data.cardio_done ? '#4ade80' : '#555', transition: 'all 0.2s',
                }}>
                  {data.cardio_done ? '✓ Hecho' : 'Pendiente'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {getCardioInstructions(week).map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, textAlign: 'right', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: step.color, flexShrink: 0 }}>
                      {step.dur}
                    </div>
                    <div style={{ width: 1, height: 12, background: '#333', flexShrink: 0 }} />
                    <div style={{ fontSize: 11, color: '#666', fontFamily: 'DM Sans' }}>{step.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Progress Tab ─────────────────────────────────────────────────────────────
const ProgressTab = ({ allData }) => {
  const [selectedEx, setSelectedEx] = useState(ALL_EXERCISES[0]?.id);
  const xLabels = Array.from({ length: 15 }, (_, i) => `S${i + 1}`);
  const exInfo = ALL_EXERCISES.find(e => e.id === selectedEx);

  const weightData = xLabels.map((_, i) => {
    const v = allData[i + 1]?.[exInfo?.day]?.exercises?.[selectedEx];
    return v != null ? v : null;
  });

  const runActual = xLabels.map((_, i) => {
    const v = parseFloat(allData[i + 1]?.dimecres?.run_km);
    return isNaN(v) ? null : v;
  });
  const runTarget = RUN_TARGETS.map(v => v > 0 ? v : null);

  const maxW = Math.max(...weightData.filter(Boolean), exInfo?.weight ?? 0, 1);
  const yMaxW = Math.ceil((maxW + 5) / 5) * 5;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 14, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 20, color: '#fff' }}>📈 Progresión de Pesos</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Haz clic en el peso de cada semana para editarlo</div>
          </div>
          <select value={selectedEx} onChange={e => setSelectedEx(e.target.value)} style={{
            background: '#1f1f1f', border: '1px solid #333', color: '#fff', borderRadius: 8,
            padding: '6px 12px', fontSize: 13, fontFamily: 'DM Sans', cursor: 'pointer', outline: 'none',
          }}>
            {DAYS.filter(d => d !== 'dimecres').map(d =>
              SCHEDULE[d].exercises.filter(e => e.weight !== null).map(ex => (
                <option key={ex.id} value={ex.id}>{SCHEDULE[d].short} — {ex.name}</option>
              ))
            )}
          </select>
        </div>
        <SvgLineChart xLabels={xLabels} yMax={yMaxW} refY={exInfo?.weight} refLabel="Inicial"
          series={[{ data: weightData, color: '#c8ff00', width: 2.5 }]} />
      </div>

      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 14, padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 20, color: '#fff' }}>🏃 Progresión Running — Meta 10 km</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Registra los km del Dimecres cada semana</div>
        </div>
        <SvgLineChart xLabels={xLabels} yMax={11} refY={10} refLabel="Meta 10km"
          series={[
            { data: runTarget, color: '#444', width: 1.5, dashed: true, dots: false, connectNulls: true },
            { data: runActual, color: '#f97316', width: 2.5 },
          ]} />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666', fontFamily: 'DM Sans' }}>
            <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#444" strokeWidth="1.5" strokeDasharray="4,3" /></svg> Objetivo
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', fontFamily: 'DM Sans' }}>
            <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#f97316" strokeWidth="2.5" /></svg> Corrido
          </div>
        </div>
      </div>

      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 14, padding: 20 }}>
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 14 }}>📋 Resumen Semanal</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans', fontSize: 12 }}>
            <thead>
              <tr>
                {['Sem','Lun','Mar','Mié','Jue','Vie','Sáb','Running'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', color: '#555', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid #222', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 15 }, (_, i) => {
                const w = i + 1;
                const wd = allData[w];
                return (
                  <tr key={w} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '7px 8px', color: '#888', fontWeight: 700, textAlign: 'center' }}>S{w}</td>
                    {DAYS.map(d => (
                      <td key={d} style={{ padding: '7px 8px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', width: 20, height: 20, borderRadius: '50%',
                          background: wd?.[d]?.done ? (d === 'dimecres' ? '#7c3f0820' : '#1a3a0a') : '#1a1a1a',
                          border: `1px solid ${wd?.[d]?.done ? (d === 'dimecres' ? '#f97316' : '#4ade80') : '#2a2a2a'}`,
                          fontSize: 11, lineHeight: '20px', color: wd?.[d]?.done ? (d === 'dimecres' ? '#f97316' : '#4ade80') : '#333',
                        }}>{wd?.[d]?.done ? '✓' : ''}</span>
                      </td>
                    ))}
                    <td style={{ padding: '7px 8px', textAlign: 'center', color: wd?.dimecres?.run_km ? '#f97316' : '#333', fontWeight: 600 }}>
                      {wd?.dimecres?.run_km ? `${wd.dimecres.run_km}km` : (RUN_TARGETS[i] > 0 ? `—/${RUN_TARGETS[i]}` : '—')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function GymTracker() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('training');
  const [allData, setAllData] = useState(initAllData);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gym_tracker_v3');
      if (saved) setAllData(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setSaving(true);
    const t = setTimeout(() => {
      try { localStorage.setItem('gym_tracker_v3', JSON.stringify(allData)); } catch {}
      setSaving(false);
    }, 800);
    return () => clearTimeout(t);
  }, [allData, loaded]);

  const weekData = allData[currentWeek];

  const handleUpdate = (day, type, id, value) => {
    setAllData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (type === 'exercise') next[currentWeek][day].exercises[id] = value;
      else if (type === 'cardio_done') next[currentWeek][day].cardio_done = value;
      else if (type === 'run_km') next[currentWeek][day].run_km = id;
      return next;
    });
  };

  const handleToggleDone = (day) => {
    setAllData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[currentWeek][day].done = !next[currentWeek][day].done;
      return next;
    });
  };

  const daysCompleted = DAYS.filter(d => weekData?.[d]?.done).length;
  const progressPct = Math.round((daysCompleted / 6) * 100);
  const overallPct = Math.round(((currentWeek - 1) / 15) * 100);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'DM Sans', color: '#fff' }}>
      <FontStyle />

      <div style={{ background: '#0f0f0f', borderBottom: '1px solid #1a1a1a', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 28, letterSpacing: 1, lineHeight: 1 }}>
                GYM <span style={{ color: '#c8ff00' }}>TRACKER</span>
              </div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>
                30 Mar – 12 Jul 2026 · 15 semanas ·{' '}
                {saving ? <span style={{ color: '#c8ff0099' }}>guardando...</span> : <span style={{ color: '#2a2a2a' }}>●</span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="week-btn" onClick={() => setCurrentWeek(w => Math.max(1, w - 1))}
                style={{ width: 32, height: 32, border: '1px solid #333', background: 'transparent', color: '#888', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>‹</button>
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                  Semana {currentWeek} <span style={{ color: '#444' }}>/ 15</span>
                </div>
                <div style={{ fontSize: 10, color: '#555' }}>{getWeekDates(currentWeek)}</div>
              </div>
              <button className="week-btn" onClick={() => setCurrentWeek(w => Math.min(15, w + 1))}
                style={{ width: 32, height: 32, border: '1px solid #333', background: 'transparent', color: '#888', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>›</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginBottom: 4 }}>
                <span>Esta semana</span><span>{daysCompleted}/6 días</span>
              </div>
              <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: '#c8ff00', borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginBottom: 4 }}>
                <span>Proyecto</span><span>S{currentWeek}/15</span>
              </div>
              <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${overallPct}%`, background: '#38bdf8', borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#0f0f0f', borderBottom: '1px solid #1a1a1a', padding: '0 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex' }}>
          {[['training','🏋️ Entrenamientos'], ['progress','📈 Progresión']].map(([key, label]) => (
            <button key={key} className="tab-btn" onClick={() => setActiveTab(key)} style={{
              padding: '12px 20px', border: 'none', background: 'transparent',
              color: activeTab === key ? '#c8ff00' : '#555',
              fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              borderBottom: `2px solid ${activeTab === key ? '#c8ff00' : 'transparent'}`,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        {activeTab === 'training' ? (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
            {DAYS.map(day => (
              <DayCard key={day} dayKey={day} data={weekData?.[day]} week={currentWeek}
                onUpdate={handleUpdate} onToggleDone={handleToggleDone} />
            ))}
          </div>
        ) : (
          <ProgressTab allData={allData} />
        )}
      </div>
    </div>
  );
}
