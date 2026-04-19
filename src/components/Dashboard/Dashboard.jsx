import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { universitiesApi, userApi, dashboardApi } from "../../api.js";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Главная",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1E47F7" : "none"}
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
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
    label: "AI чат",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
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

const LABEL_COLORS = {
  "Сложно": { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "Среднее": { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "Средне":  { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "Легко":   { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "Реально": { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "hard":    { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "medium":  { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "easy":    { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
};

function getLabelStyle(label) {
  return LABEL_COLORS[label] || { bg: "#f5f5f5", text: "#666", border: "#ddd" };
}

export default function Dashboard({ onNavigate }) {
  const [userName, setUserName] = useState("");
  const [savedUnis, setSavedUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // Закрывать меню при клике снаружи
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userRes, savedRes] = await Promise.allSettled([
        userApi.getMe(),
        universitiesApi.getSaved(),
      ]);

      if (userRes.status === "fulfilled") {
        const u = userRes.value;
        setUserName(u?.about?.name || u?.email?.split("@")[0] || "");
      }

      if (savedRes.status === "fulfilled") {
        setSavedUnis(Array.isArray(savedRes.value) ? savedRes.value : []);
      }
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (uni) => {
    try {
      await universitiesApi.unsave(uni.id);
      setSavedUnis((prev) => prev.filter((u) => u.id !== uni.id));
    } catch (err) {
      console.error("Delete error:", err);
    }
    setOpenMenuId(null);
  };

  const handleNav = (key) => {
    if (onNavigate) onNavigate(key);
  };

  // Считаем дни до ближайшего дедлайна (если есть)
  const nearestDeadlineDays = (() => {
    if (!savedUnis.length) return null;
    const today = new Date();
    let min = Infinity;
    savedUnis.forEach((u) => {
      if (u.deadline) {
        const d = new Date(u.deadline);
        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        if (diff > 0 && diff < min) min = diff;
      }
    });
    return min === Infinity ? null : min;
  })();

  return (
    <div className="dash-root" onClick={() => setOpenMenuId(null)}>

      {/* Header */}
      <div className="dash-header">
        <div className="dash-logo">
          <span className="dash-logo-arrow">↗</span>Eduplat
        </div>
        <button className="dash-notif-btn" aria-label="Уведомления">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#111" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </div>

      {/* Greeting */}
      <div className="dash-greeting-row">
        <div className="dash-greeting">
          Привет, {userName || "друг"}👋
        </div>
        <div className="dash-deadline">
          {nearestDeadlineDays !== null
            ? <>До ближайшего дедлайна <strong>{nearestDeadlineDays} дней</strong></>
            : "Добавьте университеты чтобы следить за дедлайнами"}
        </div>
      </div>

      {/* Premium banner */}
      <div className="dash-premium-banner" onClick={() => handleNav("premium")}>
        <div className="dash-premium-text">
          <div className="dash-premium-title">
            Хочешь добавить<br />больше университетов?<br />
            <span style={{ fontWeight: 800 }}>Premium всего за $5.90</span>
          </div>
          <button className="dash-premium-link" onClick={(e) => { e.stopPropagation(); handleNav("premium"); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Подробнее
          </button>
        </div>
        <div className="dash-premium-img">✨</div>
      </div>

      {/* Section header */}
      <div className="dash-section-header">
        <span className="dash-section-title">Мои университеты</span>
        <button className="dash-add-btn" onClick={() => handleNav("home")}>
          Добавить +
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="dash-loading">Загрузка...</div>
      ) : savedUnis.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">🎓</div>
          <div className="dash-empty-title">Список пуст</div>
          <div className="dash-empty-sub">
            Добавьте университеты, которые вас интересуют, чтобы следить за вероятностью поступления и дедлайнами
          </div>
          <button className="dash-empty-btn" onClick={() => handleNav("home")}>
            Найти университеты
          </button>
        </div>
      ) : (
        <div className="dash-list" ref={menuRef}>
          {savedUnis.map((uni) => {
            const labelStyle = getLabelStyle(uni.label);
            const isMenuOpen = openMenuId === uni.id;

            return (
              <div key={uni.id} className="dash-card"
                onClick={(e) => e.stopPropagation()}>
                <div className="dash-card-inner">
                  <div className="dash-card-top">
                    <div className="dash-card-left">
                      <div className="dash-card-name">{uni.name}</div>
                      <div className="dash-card-location">{uni.country}, {uni.city}</div>
                    </div>
                    <div className="dash-card-right">
                      <span className="dash-card-prob">{uni.probability}%</span>
                      <span className="dash-card-badge" style={{
                        background: labelStyle.bg,
                        color: labelStyle.text,
                        border: `1px solid ${labelStyle.border}`,
                      }}>
                        {uni.label}
                      </span>
                    </div>
                    {/* 3-dot menu */}
                    <div className="dash-card-menu-wrap">
                      <button
                        className="dash-card-dots"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : uni.id);
                        }}
                      >
                        ⋮
                      </button>
                      {isMenuOpen && (
                        <div className="dash-card-dropdown">
                          <button
                            className="dash-card-dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(uni);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                              stroke="#e53935" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                            </svg>
                            Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="dash-card-stats">
                    <div className="dash-stat">
                      <div className="dash-stat-label">Вероятность</div>
                      <div className="dash-stat-value">{uni.probability}%</div>
                    </div>
                    <div className="dash-stat">
                      <div className="dash-stat-label">GPA</div>
                      <div className="dash-stat-value">{uni.min_gpa}+</div>
                    </div>
                    <div className="dash-stat">
                      <div className="dash-stat-label">SAT</div>
                      <div className="dash-stat-value">{uni.min_sat}+</div>
                    </div>
                  </div>

                  <button className="dash-detail-btn">Узнать подробнее</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom nav */}
      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${item.key === "dashboard" ? "bottom-nav-item--active" : ""}`}
            onClick={() => handleNav(item.key)}
          >
            {item.icon(item.key === "dashboard")}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}