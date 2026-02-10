import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

const STORAGE_KEY = "rehab-tracker-data";

const DEFAULT_EXERCISES = [
  { name: "Single Leg Extension", unit: "kg" },
  { name: "Split Squats", unit: "kg" },
  { name: "Spanish Squats", unit: "kg" },
  { name: "SL Heel Raise", unit: "kg" },
  { name: "Weighted Step-ups", unit: "kg" },
  { name: "Reverse Nordic Curl", unit: "reps" },
  { name: "Goblet Squat", unit: "kg" },
];

const PAIN_LABELS = ["None", "Minimal", "Mild", "Moderate", "Significant", "Moderate-High", "High", "Very High", "Severe", "Very Severe", "Worst"];
const PAIN_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString("en-IE", { day: "numeric", month: "short" });
};

const formatFullDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString("en-IE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const today = () => new Date().toISOString().split("T")[0];

const loadData = () => {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { sessions: [], cycles: [], notes: [] };
  } catch {
    return { sessions: [], cycles: [], notes: [] };
  }
};

const saveData = (data) => {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

// Tabs
const TABS = ["Dashboard", "Log Session", "Log Cycle", "History", "Export"];

export default function RehabTracker() {
  const [data, setData] = useState({ sessions: [], cycles: [], notes: [] });
  const [tab, setTab] = useState("Dashboard");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveData(data);
  }, [data, loaded]);

  const addSession = (session) => setData((d) => ({ ...d, sessions: [...d.sessions, session] }));
  const addCycle = (cycle) => setData((d) => ({ ...d, cycles: [...d.cycles, cycle] }));

  const deleteSession = (index) => {
    setData((d) => ({ ...d, sessions: d.sessions.filter((_, i) => i !== index) }));
  };

  const deleteCycle = (index) => {
    setData((d) => ({ ...d, cycles: d.cycles.filter((_, i) => i !== index) }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1a 0%, #0d1929 50%, #0a1628 100%)", color: "#e2e8f0", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
        input, select, textarea { font-family: 'JetBrains Mono', monospace; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e3a5f", padding: "20px 24px", background: "rgba(10,15,26,0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>◆</div>
            <div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: "#f0fdf4", letterSpacing: "-0.5px" }}>Rehab Tracker</h1>
              <p style={{ fontSize: 11, color: "#64748b", letterSpacing: 1 }}>QUADRICEPS TENDINOSIS · JASON COGHLAN</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5, whiteSpace: "nowrap",
                background: tab === t ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
                color: tab === t ? "#0a0f1a" : "#64748b",
                transition: "all 0.2s"
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" }}>
        {tab === "Dashboard" && <DashboardTab data={data} />}
        {tab === "Log Session" && <LogSessionTab onSave={addSession} />}
        {tab === "Log Cycle" && <LogCycleTab onSave={addCycle} />}
        {tab === "History" && <HistoryTab data={data} onDeleteSession={deleteSession} onDeleteCycle={deleteCycle} />}
        {tab === "Export" && <ExportTab data={data} setData={setData} />}
      </div>
    </div>
  );
}

// ─── CARD COMPONENT ───
function Card({ title, children, accent = "#10b981", style = {} }) {
  return (
    <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid #1e3a5f", borderRadius: 12, padding: 20, backdropFilter: "blur(8px)", ...style }}>
      {title && <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: accent, marginBottom: 16, letterSpacing: "-0.3px" }}>{title}</h3>}
      {children}
    </div>
  );
}

// ─── STAT BOX ───
function Stat({ label, value, unit, color = "#10b981" }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color }}>{value}</div>
      {unit && <div style={{ fontSize: 11, color: "#475569" }}>{unit}</div>}
    </div>
  );
}

// ─── DASHBOARD TAB ───
function DashboardTab({ data }) {
  const { sessions, cycles } = data;

  const totalSessions = sessions.length;
  const totalCycles = cycles.length;
  const totalKm = cycles.reduce((s, c) => s + (parseFloat(c.distance) || 0), 0);
  const avgPain = sessions.length ? (sessions.reduce((s, sess) => s + (sess.painDuring || 0), 0) / sessions.length).toFixed(1) : "—";

  // Weight progression data
  const weightData = sessions.map((s) => {
    const entry = { date: formatDate(s.date) };
    (s.exercises || []).forEach((ex) => {
      if (ex.weight) entry[ex.name] = parseFloat(ex.weight);
    });
    return entry;
  });

  // Pain trend data
  const painData = sessions.map((s) => ({
    date: formatDate(s.date),
    during: s.painDuring || 0,
    after: s.painAfter || 0,
    nextDay: s.painNextDay || 0,
  }));

  // Cycling data
  const cycleData = cycles.map((c) => ({
    date: formatDate(c.date),
    distance: parseFloat(c.distance) || 0,
    power: parseInt(c.avgPower) || 0,
    cadence: parseInt(c.avgCadence) || 0,
    hr: parseInt(c.avgHR) || 0,
  }));

  const exerciseNames = [...new Set(sessions.flatMap((s) => (s.exercises || []).filter((e) => e.weight).map((e) => e.name)))];
  const lineColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

  if (!sessions.length && !cycles.length) {
    return (
      <Card title="Welcome to Your Rehab Tracker">
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 13 }}>
          Start by logging your first loading session or cycle ride. Your dashboard will populate with charts and metrics as you add data.
        </p>
        <div style={{ marginTop: 16, padding: 16, background: "rgba(16,185,129,0.08)", borderRadius: 8, border: "1px solid rgba(16,185,129,0.2)" }}>
          <p style={{ color: "#10b981", fontSize: 12, fontWeight: 500 }}>Session order reminder:</p>
          <p style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>Collagen + Vit C → Warm-up → Loading → Cycle → Cool down</p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <Card><Stat label="Sessions" value={totalSessions} /></Card>
        <Card><Stat label="Cycles" value={totalCycles} color="#3b82f6" /></Card>
        <Card><Stat label="Total KM" value={totalKm.toFixed(1)} color="#f59e0b" /></Card>
        <Card><Stat label="Avg Pain" value={avgPain} unit="/10" color={parseFloat(avgPain) <= 3 ? "#10b981" : parseFloat(avgPain) <= 5 ? "#f59e0b" : "#ef4444"} /></Card>
      </div>

      {/* Weight progression */}
      {weightData.length > 0 && (
        <Card title="Weight Progression (kg)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {exerciseNames.map((name, i) => (
                <Line key={name} type="monotone" dataKey={name} stroke={lineColors[i % lineColors.length]} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Pain trend */}
      {painData.length > 0 && (
        <Card title="Pain Trend (0-10)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={painData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="during" name="During Session" stroke="#f59e0b" fill="rgba(245,158,11,0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="after" name="After Session" stroke="#ef4444" fill="rgba(239,68,68,0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="nextDay" name="Next Day" stroke="#8b5cf6" fill="rgba(139,92,246,0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Cycling metrics */}
      {cycleData.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="Cycling Distance (km)">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="distance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Cycling Metrics">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="power" name="Power (W)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="cadence" name="Cadence (RPM)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hr" name="HR (BPM)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Target zones reminder */}
      <Card title="Target Zones">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12 }}>
          <div>
            <p style={{ color: "#10b981", fontWeight: 600, marginBottom: 8 }}>Post-Loading Cycle</p>
            <div style={{ color: "#94a3b8", lineHeight: 1.8 }}>
              <div>Power: <span style={{ color: "#e2e8f0" }}>75-95W</span></div>
              <div>Cadence: <span style={{ color: "#e2e8f0" }}>85-95 RPM</span></div>
              <div>Heart Rate: <span style={{ color: "#e2e8f0" }}>100-118 BPM</span></div>
              <div>Effort: <span style={{ color: "#e2e8f0" }}>4-5 / Moderate</span></div>
            </div>
          </div>
          <div>
            <p style={{ color: "#3b82f6", fontWeight: 600, marginBottom: 8 }}>Pain Guidelines</p>
            <div style={{ color: "#94a3b8", lineHeight: 1.8 }}>
              <div>During: <span style={{ color: "#10b981" }}>0-3 acceptable</span></div>
              <div>Above 5: <span style={{ color: "#f59e0b" }}>Reduce load 20%</span></div>
              <div>Next day worse: <span style={{ color: "#ef4444" }}>Scale back</span></div>
              <div>Settles in 24hr: <span style={{ color: "#10b981" }}>Good zone</span></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── INPUT COMPONENT ───
function Input({ label, type = "text", value, onChange, placeholder, min, max, step, style: extraStyle = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...extraStyle }}>
      {label && <label style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        min={min} max={max} step={step}
        style={{ padding: "10px 12px", background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%" }} />
    </div>
  );
}

// ─── PAIN SLIDER ───
function PainSlider({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 600, color: PAIN_COLORS[value] }}>{value}/10 — {PAIN_LABELS[value]}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button key={n} onClick={() => onChange(n)} style={{
            flex: 1, height: 32, border: "none", borderRadius: 4, cursor: "pointer", fontSize: 10, fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            background: value === n ? PAIN_COLORS[n] : "rgba(30,58,95,0.4)",
            color: value === n ? "#0a0f1a" : "#475569",
            transition: "all 0.15s"
          }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

// ─── LOG SESSION TAB ───
function LogSessionTab({ onSave }) {
  const [date, setDate] = useState(today());
  const [sessionType, setSessionType] = useState("Mon/Fri Core");
  const [exercises, setExercises] = useState(
    DEFAULT_EXERCISES.map((e) => ({ name: e.name, unit: e.unit, weight: "", reps: "", sets: "" }))
  );
  const [painDuring, setPainDuring] = useState(0);
  const [painAfter, setPainAfter] = useState(0);
  const [painNextDay, setPainNextDay] = useState(0);
  const [warmth, setWarmth] = useState(false);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const updateExercise = (i, field, val) => {
    setExercises((ex) => ex.map((e, j) => (j === i ? { ...e, [field]: val } : e)));
  };

  const handleSave = () => {
    const filledExercises = exercises.filter((e) => e.weight || e.reps);
    onSave({ date, sessionType, exercises: filledExercises, painDuring, painAfter, painNextDay, warmth, notes, timestamp: Date.now() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Log Loading Session">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <Input label="Date" type="date" value={date} onChange={setDate} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Session Type</label>
            <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}
              style={{ padding: "10px 12px", background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", fontSize: 13 }}>
              <option>Mon/Fri Core</option>
              <option>Wed New Exercises</option>
            </select>
          </div>
        </div>

        <h4 style={{ fontSize: 12, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Exercises</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, alignItems: "end" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", padding: "10px 0" }}>{ex.name}</div>
              <Input label={i === 0 ? `Weight (${ex.unit})` : ""} type="number" value={ex.weight} onChange={(v) => updateExercise(i, "weight", v)} placeholder="kg" min="0" step="0.5" />
              <Input label={i === 0 ? "Sets" : ""} type="number" value={ex.sets} onChange={(v) => updateExercise(i, "sets", v)} placeholder="3" min="0" />
              <Input label={i === 0 ? "Reps" : ""} type="number" value={ex.reps} onChange={(v) => updateExercise(i, "reps", v)} placeholder="8" min="0" />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Pain & Discomfort">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <PainSlider label="During Session" value={painDuring} onChange={setPainDuring} />
          <PainSlider label="After Session" value={painAfter} onChange={setPainAfter} />
          <PainSlider label="Next Day (update later)" value={painNextDay} onChange={setPainNextDay} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setWarmth(!warmth)} style={{
              width: 20, height: 20, borderRadius: 4, border: "1px solid #1e3a5f", cursor: "pointer",
              background: warmth ? "#f59e0b" : "transparent", transition: "all 0.15s"
            }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Warmth / heat felt above kneecap</span>
          </div>
        </div>
      </Card>

      <Card title="Notes">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did the session feel? Any form observations, technique notes..."
          style={{ width: "100%", minHeight: 80, padding: 12, background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "'JetBrains Mono', monospace" }} />
      </Card>

      <button onClick={handleSave} style={{
        padding: "14px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
        fontFamily: "'Outfit', sans-serif", letterSpacing: 0.5,
        background: saved ? "#059669" : "linear-gradient(135deg, #10b981, #059669)",
        color: "#0a0f1a", transition: "all 0.2s"
      }}>{saved ? "✓ Session Saved" : "Save Session"}</button>
    </div>
  );
}

// ─── LOG CYCLE TAB ───
function LogCycleTab({ onSave }) {
  const [date, setDate] = useState(today());
  const [rideType, setRideType] = useState("Post-Loading");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [avgPower, setAvgPower] = useState("");
  const [avgCadence, setAvgCadence] = useState("");
  const [avgHR, setAvgHR] = useState("");
  const [avgSpeed, setAvgSpeed] = useState("");
  const [elevation, setElevation] = useState("");
  const [calories, setCalories] = useState("");
  const [effort, setEffort] = useState("");
  const [kneePain, setKneePain] = useState(0);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ date, rideType, distance, duration, avgPower, avgCadence, avgHR, avgSpeed, elevation, calories, effort, kneePain, notes, timestamp: Date.now() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Zone indicators
  const powerZone = avgPower ? (parseFloat(avgPower) >= 75 && parseFloat(avgPower) <= 95 ? "✓" : parseFloat(avgPower) < 75 ? "↓" : "↑") : "";
  const cadenceZone = avgCadence ? (parseFloat(avgCadence) >= 85 && parseFloat(avgCadence) <= 95 ? "✓" : parseFloat(avgCadence) < 85 ? "↓" : "↑") : "";
  const hrZone = avgHR ? (parseFloat(avgHR) >= 100 && parseFloat(avgHR) <= 118 ? "✓" : parseFloat(avgHR) < 100 ? "↓" : "↑") : "";

  const zoneColor = (z) => z === "✓" ? "#10b981" : z === "↑" ? "#ef4444" : z === "↓" ? "#f59e0b" : "transparent";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Log Cycle Ride">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Date" type="date" value={date} onChange={setDate} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Ride Type</label>
            <select value={rideType} onChange={(e) => setRideType(e.target.value)}
              style={{ padding: "10px 12px", background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", fontSize: 13 }}>
              <option>Post-Loading</option>
              <option>Standalone</option>
              <option>Recovery</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Apple Fitness Metrics">
        <p style={{ fontSize: 11, color: "#475569", marginBottom: 12 }}>Enter values from your Apple Watch workout summary</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Input label="Distance (km)" type="number" value={distance} onChange={setDistance} step="0.01" />
          <Input label="Duration (mins)" type="number" value={duration} onChange={setDuration} />
          <Input label="Elevation (m)" type="number" value={elevation} onChange={setElevation} />
          <div>
            <Input label="Avg Power (W)" type="number" value={avgPower} onChange={setAvgPower} />
            {powerZone && <span style={{ fontSize: 10, color: zoneColor(powerZone), marginTop: 2, display: "block" }}>
              {powerZone === "✓" ? "In zone (75-95W)" : powerZone === "↑" ? "Above target" : "Below target"}
            </span>}
          </div>
          <div>
            <Input label="Avg Cadence (RPM)" type="number" value={avgCadence} onChange={setAvgCadence} />
            {cadenceZone && <span style={{ fontSize: 10, color: zoneColor(cadenceZone), marginTop: 2, display: "block" }}>
              {cadenceZone === "✓" ? "In zone (85-95)" : cadenceZone === "↑" ? "Above target" : "Below target — lighter gear"}
            </span>}
          </div>
          <div>
            <Input label="Avg HR (BPM)" type="number" value={avgHR} onChange={setAvgHR} />
            {hrZone && <span style={{ fontSize: 10, color: zoneColor(hrZone), marginTop: 2, display: "block" }}>
              {hrZone === "✓" ? "In zone (100-118)" : hrZone === "↑" ? "Too high — ease off" : "Below target"}
            </span>}
          </div>
          <Input label="Avg Speed (km/h)" type="number" value={avgSpeed} onChange={setAvgSpeed} step="0.1" />
          <Input label="Active Calories" type="number" value={calories} onChange={setCalories} />
          <Input label="Effort (1-10)" type="number" value={effort} onChange={setEffort} min="1" max="10" />
        </div>
      </Card>

      <Card title="Knee Response">
        <PainSlider label="Knee Pain During Ride" value={kneePain} onChange={setKneePain} />
        <div style={{ marginTop: 12 }}>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Route notes, how knee felt on climbs, gear choices..."
            style={{ width: "100%", minHeight: 60, padding: 12, background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "'JetBrains Mono', monospace" }} />
        </div>
      </Card>

      <button onClick={handleSave} style={{
        padding: "14px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
        fontFamily: "'Outfit', sans-serif",
        background: saved ? "#2563eb" : "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "#fff", transition: "all 0.2s"
      }}>{saved ? "✓ Cycle Saved" : "Save Cycle"}</button>
    </div>
  );
}

// ─── HISTORY TAB ───
function HistoryTab({ data, onDeleteSession, onDeleteCycle }) {
  const [view, setView] = useState("sessions");

  const allEntries = view === "sessions"
    ? data.sessions.map((s, i) => ({ ...s, type: "session", idx: i })).sort((a, b) => new Date(b.date) - new Date(a.date))
    : data.cycles.map((c, i) => ({ ...c, type: "cycle", idx: i })).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setView("sessions")} style={{
          padding: "8px 16px", borderRadius: 6, border: "1px solid #1e3a5f", cursor: "pointer", fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          background: view === "sessions" ? "#10b981" : "transparent",
          color: view === "sessions" ? "#0a0f1a" : "#64748b"
        }}>Sessions ({data.sessions.length})</button>
        <button onClick={() => setView("cycles")} style={{
          padding: "8px 16px", borderRadius: 6, border: "1px solid #1e3a5f", cursor: "pointer", fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          background: view === "cycles" ? "#3b82f6" : "transparent",
          color: view === "cycles" ? "#fff" : "#64748b"
        }}>Cycles ({data.cycles.length})</button>
      </div>

      {allEntries.length === 0 && (
        <Card><p style={{ color: "#64748b", fontSize: 13 }}>No {view} logged yet.</p></Card>
      )}

      {allEntries.map((entry, i) => (
        <Card key={i} accent={entry.type === "session" ? "#10b981" : "#3b82f6"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", fontFamily: "'Outfit', sans-serif" }}>
                {formatFullDate(entry.date)}
              </span>
              {entry.sessionType && <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>({entry.sessionType})</span>}
              {entry.rideType && <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>({entry.rideType})</span>}
            </div>
            <button onClick={() => entry.type === "session" ? onDeleteSession(entry.idx) : onDeleteCycle(entry.idx)}
              style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "4px 8px" }}>✕</button>
          </div>

          {entry.type === "session" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 6, marginBottom: 12 }}>
                {(entry.exercises || []).map((ex, j) => (
                  <div key={j} style={{ fontSize: 11, color: "#94a3b8", padding: "6px 8px", background: "rgba(30,58,95,0.3)", borderRadius: 4 }}>
                    <span style={{ color: "#e2e8f0" }}>{ex.name}</span>: {ex.weight}{ex.unit || "kg"} × {ex.sets || "3"}×{ex.reps || "?"}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                <span>During: <span style={{ color: PAIN_COLORS[entry.painDuring || 0], fontWeight: 600 }}>{entry.painDuring || 0}/10</span></span>
                <span>After: <span style={{ color: PAIN_COLORS[entry.painAfter || 0], fontWeight: 600 }}>{entry.painAfter || 0}/10</span></span>
                <span>Next day: <span style={{ color: PAIN_COLORS[entry.painNextDay || 0], fontWeight: 600 }}>{entry.painNextDay || 0}/10</span></span>
                {entry.warmth && <span style={{ color: "#f59e0b" }}>🔥 Warmth</span>}
              </div>
            </>
          )}

          {entry.type === "cycle" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, fontSize: 11 }}>
              {entry.distance && <div style={{ color: "#94a3b8" }}>Distance: <span style={{ color: "#e2e8f0" }}>{entry.distance}km</span></div>}
              {entry.duration && <div style={{ color: "#94a3b8" }}>Duration: <span style={{ color: "#e2e8f0" }}>{entry.duration}min</span></div>}
              {entry.avgPower && <div style={{ color: "#94a3b8" }}>Power: <span style={{ color: "#e2e8f0" }}>{entry.avgPower}W</span></div>}
              {entry.avgCadence && <div style={{ color: "#94a3b8" }}>Cadence: <span style={{ color: "#e2e8f0" }}>{entry.avgCadence}RPM</span></div>}
              {entry.avgHR && <div style={{ color: "#94a3b8" }}>HR: <span style={{ color: "#e2e8f0" }}>{entry.avgHR}BPM</span></div>}
              {entry.elevation && <div style={{ color: "#94a3b8" }}>Elevation: <span style={{ color: "#e2e8f0" }}>{entry.elevation}m</span></div>}
              {entry.effort && <div style={{ color: "#94a3b8" }}>Effort: <span style={{ color: "#e2e8f0" }}>{entry.effort}/10</span></div>}
            </div>
          )}

          {entry.notes && <p style={{ fontSize: 11, color: "#64748b", marginTop: 8, fontStyle: "italic" }}>{entry.notes}</p>}
        </Card>
      ))}
    </div>
  );
}

// ─── EXPORT TAB ───
function ExportTab({ data, setData }) {
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");

  const exportData = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rehab-tracker-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Exported successfully");
    setTimeout(() => setMsg(""), 3000);
  };

  const exportCSV = () => {
    let csv = "Type,Date,Exercise/Ride,Weight/Distance,Sets,Reps,Pain During,Pain After,Pain Next Day,Notes\n";
    data.sessions.forEach((s) => {
      (s.exercises || []).forEach((ex) => {
        csv += `Session,${s.date},"${ex.name}",${ex.weight || ""},${ex.sets || ""},${ex.reps || ""},${s.painDuring || 0},${s.painAfter || 0},${s.painNextDay || 0},"${(s.notes || "").replace(/"/g, '""')}"\n`;
      });
    });
    data.cycles.forEach((c) => {
      csv += `Cycle,${c.date},"${c.rideType || ""}",${c.distance || ""}km,,${c.avgPower || ""}W/${c.avgCadence || ""}RPM/${c.avgHR || ""}BPM,${c.kneePain || 0},,,"${(c.notes || "").replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rehab-tracker-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("CSV exported");
    setTimeout(() => setMsg(""), 3000);
  };

  const importData = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.sessions && parsed.cycles) {
        setData(parsed);
        setMsg("Data imported successfully");
        setImportText("");
      } else {
        setMsg("Invalid format — needs sessions and cycles arrays");
      }
    } catch {
      setMsg("Invalid JSON");
    }
    setTimeout(() => setMsg(""), 3000);
  };

  const clearData = () => {
    if (window.confirm("Are you sure? This will delete all tracked data.")) {
      setData({ sessions: [], cycles: [], notes: [] });
      setMsg("All data cleared");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="Export Data">
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Download your tracking data to share with Patrick or Professor Falvey, or to back up your progress.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={exportData} style={{ padding: "10px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", background: "#10b981", color: "#0a0f1a" }}>
            Export JSON
          </button>
          <button onClick={exportCSV} style={{ padding: "10px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", background: "#3b82f6", color: "#fff" }}>
            Export CSV
          </button>
        </div>
      </Card>

      <Card title="Import Data">
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Paste previously exported JSON data to restore your tracking history.</p>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste JSON data here..."
          style={{ width: "100%", minHeight: 80, padding: 12, background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", fontSize: 12, resize: "vertical", outline: "none", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }} />
        <button onClick={importData} style={{ padding: "10px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", background: "#f59e0b", color: "#0a0f1a" }}>
          Import
        </button>
      </Card>

      <Card title="Danger Zone" accent="#ef4444">
        <button onClick={clearData} style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid #ef4444", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", background: "transparent", color: "#ef4444" }}>
          Clear All Data
        </button>
      </Card>

      {msg && (
        <div style={{ padding: "10px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontSize: 12, color: "#10b981" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
