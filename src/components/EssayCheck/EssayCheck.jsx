import { useState } from "react";
import "./EssayCheck.css";

const BASE_URL = "http://localhost:8000/api/v1";

const NAV_ITEMS = [
  {
    key: "home",
    label: "Главная",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1E47F7" : "none"}
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    key: "opportunities",
    label: "Возможности",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
      </svg>
    ),
  },
  {
    key: "essay",
    label: "Проверка эссе",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Профиль",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1E47F7" : "none"}
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

// Gauge colors map to backend color field
const GAUGE_COLORS = {
  green:  "#4caf50",
  yellow: "#ffa726",
  red:    "#e53935",
};

function ScoreGauge({ score, color }) {
  const size = 82;
  const sw = 8;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 10) * circ;
  const strokeColor = GAUGE_COLORS[color] || "#1E47F7";

  return (
    <div className="score-gauge-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="#f0f0f0" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={strokeColor} strokeWidth={sw}
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeLinecap="round" />
      </svg>
      <div className="score-center">
        <span className="score-number">{score}</span>
        <span className="score-denom">из 10</span>
      </div>
    </div>
  );
}

function ResultSection({ title, items, type, dotColor }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`result-section section-${type}`}>
      <div className="result-section-header">
        <div className="result-dot" style={{ background: dotColor }} />
        <span className="result-section-title">{title}</span>
      </div>
      <div className="result-items">
        {items.map((item, i) => (
          <div key={i} className="result-item">{item}</div>
        ))}
      </div>
    </div>
  );
}

export default function EssayCheck({ onNavigate }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const MIN_CHARS = 100;
  const MAX_CHARS = 10000;
  const charCount = text.length;
  const isReady = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const charClass = charCount === 0
    ? ""
    : charCount < MIN_CHARS
    ? "warn"
    : "ok";

  const handleAnalyze = async () => {
    if (!isReady) return;
    setError("");
    setLoading(true);
    setResult(null);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/essay/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = Array.isArray(data?.detail)
          ? data.detail.map((e) => e.msg).join(", ")
          : data?.detail || "Ошибка сервера";
        throw new Error(msg);
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setText("");
    setError("");
  };

  const handleNav = (key) => {
    if (onNavigate) onNavigate(key);
  };

  return (
    <div className="essay-root">

      {/* Header */}
      <div className="essay-header">
        <div className="essay-logo">
          <span className="essay-logo-arrow">↗</span>Eduplat
        </div>
      </div>

      {/* Title */}
      <div className="essay-title-row">
        <h1 className="essay-title">Проверка эссе 🎓</h1>
        <p className="essay-subtitle">ИИ оценит мотивационное письмо и даст советы</p>
      </div>

      {/* ── INPUT STATE ── */}
      {!result && !loading && (
        <>
          <div className="essay-card">
            <div className="essay-card-label-row">
              <span className="essay-card-label">Мотивационное письмо</span>
              <span className={`essay-char-count ${charClass}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              className="essay-textarea"
              placeholder="Я хочу поступить в этот университет, потому что..."
              value={text}
              maxLength={MAX_CHARS}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
            />
            <div className="essay-hint">
              {charCount < MIN_CHARS
                ? `Минимум ${MIN_CHARS} символов (осталось ${MIN_CHARS - charCount})`
                : "Готово к анализу"}
            </div>
          </div>

          {error && <div className="essay-error">{error}</div>}

          <button
            className="essay-btn"
            onClick={handleAnalyze}
            disabled={!isReady}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            Проверить письмо
          </button>
        </>
      )}

      {/* ── LOADING STATE ── */}
      {loading && (
        <div className="essay-loading-wrap">
          <div className="essay-spinner" />
          <div className="essay-loading-text">Анализируем...</div>
        </div>
      )}

      {/* ── RESULT STATE ── */}
      {result && (
        <div className="essay-result">

          {/* Score card */}
          <div className="score-card">
            <ScoreGauge score={result.score} color={result.color} />
            <div className="score-info">
              <span className={`score-badge ${result.color || "yellow"}`}>
                {result.label}
              </span>
              {result.summary && (
                <div className="score-summary">{result.summary}</div>
              )}
            </div>
          </div>

          {/* Strengths */}
          <ResultSection
            title="Сильные стороны"
            items={result.strengths}
            type="strengths"
            dotColor="#4caf50"
          />

          {/* Weaknesses */}
          <ResultSection
            title="Слабые стороны"
            items={result.weaknesses}
            type="weaknesses"
            dotColor="#ffa726"
          />

          {/* Suggestions */}
          <ResultSection
            title="Советы по улучшению"
            items={result.suggestions}
            type="suggestions"
            dotColor="#1E47F7"
          />

          {/* Reset */}
          <button className="essay-reset-btn" onClick={handleReset}>
            Проверить другое письмо
          </button>

        </div>
      )}

      {/* Bottom navigation */}
      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${item.key === "essay" ? "bottom-nav-item--active" : ""}`}
            onClick={() => handleNav(item.key)}
          >
            {item.icon(item.key === "essay")}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}