import { useState, useEffect } from "react";
import "./Home.css";
import { universitiesApi } from "../../api.js";

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

const DIFFICULTY_LABELS = {
  "Легко": "easy",
  "Среднее": "medium",
  "Сложно": "hard",
};

const DIFFICULTY_COLORS = {
  "Легко": { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "Среднее": { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "Сложно": { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "yellow": { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "green": { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "red": { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
};

export default function Home({ onNavigate }) {
  const [activePage, setActivePage] = useState("home");
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterCountry, setFilterCountry] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterGpa, setFilterGpa] = useState("");

  const [openFilter, setOpenFilter] = useState(null); // "country" | "difficulty" | "gpa"

  useEffect(() => {
    loadCountries();
    loadUniversities();
  }, []);

  useEffect(() => {
    loadUniversities();
  }, [filterCountry, filterDifficulty, filterGpa]);

  const loadCountries = async () => {
    try {
      const data = await universitiesApi.getCountries();
      setCountries(Array.isArray(data) ? data : ["Австралия", "Великобритания", "Канада", "США"]);
    } catch {
      setCountries(["Австралия", "Великобритания", "Канада", "США"]);
    }
  };

  const loadUniversities = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (filterCountry) filters.country = filterCountry;
      if (filterDifficulty) filters.difficulty = DIFFICULTY_LABELS[filterDifficulty] || filterDifficulty;
      if (filterGpa) filters.minGpa = filterGpa;
      const data = await universitiesApi.getAll(filters);
      setUniversities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyStyle = (label, color) => {
    const key = label || color;
    return DIFFICULTY_COLORS[key] || { bg: "#f5f5f5", text: "#666", border: "#ddd" };
  };

  const handleNav = (key) => {
    setActivePage(key);
    if (onNavigate && key !== "home") onNavigate(key);
  };

  const clearFilters = () => {
    setFilterCountry("");
    setFilterDifficulty("");
    setFilterGpa("");
    setOpenFilter(null);
  };

  const hasFilters = filterCountry || filterDifficulty || filterGpa;

  return (
    <div className="home-root">
      {/* Header */}
      <div className="home-header">
        <div className="home-logo"><span className="home-logo-arrow">↗</span>Eduplat</div>
      </div>

      {/* Page title */}
      <div className="home-title-row">
        <h1 className="home-title">Добавить университет</h1>
        <p className="home-subtitle">Ищите и добавляйте университеты в свою доску</p>
      </div>

      {/* Back btn */}
      <div className="home-back-row">
        <button className="home-back-btn" onClick={() => onNavigate && onNavigate("back")}>
          ‹ Назад
        </button>
      </div>

      {/* Search */}
      <div className="home-search-wrap">
        <svg className="home-search-icon" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="#aaa" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input className="home-search" placeholder="Поиск" />
      </div>

      {/* Filters */}
      <div className="home-filters-label">Фильтрация по</div>
      <div className="home-filters-row">
        {/* Country filter */}
        <div className="filter-wrap">
          <button
            className={`filter-btn ${filterCountry ? "filter-btn--active" : ""}`}
            onClick={() => setOpenFilter(openFilter === "country" ? null : "country")}
          >
            {filterCountry || "Странам"} ▾
          </button>
          {openFilter === "country" && (
            <div className="filter-dropdown">
              <div className="filter-option" onClick={() => { setFilterCountry(""); setOpenFilter(null); }}>
                Все страны
              </div>
              {countries.map((c) => (
                <div key={c} className="filter-option"
                  onClick={() => { setFilterCountry(c); setOpenFilter(null); }}>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty filter */}
        <div className="filter-wrap">
          <button
            className={`filter-btn ${filterDifficulty ? "filter-btn--active" : ""}`}
            onClick={() => setOpenFilter(openFilter === "difficulty" ? null : "difficulty")}
          >
            {filterDifficulty || "Сложности"} ▾
          </button>
          {openFilter === "difficulty" && (
            <div className="filter-dropdown">
              <div className="filter-option" onClick={() => { setFilterDifficulty(""); setOpenFilter(null); }}>
                Все
              </div>
              {["Легко", "Среднее", "Сложно"].map((d) => (
                <div key={d} className="filter-option"
                  onClick={() => { setFilterDifficulty(d); setOpenFilter(null); }}>
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GPA filter */}
        <div className="filter-wrap">
          <button
            className={`filter-btn ${filterGpa ? "filter-btn--active" : ""}`}
            onClick={() => setOpenFilter(openFilter === "gpa" ? null : "gpa")}
          >
            GPA {filterGpa ? `${filterGpa}+` : ""} ▾
          </button>
          {openFilter === "gpa" && (
            <div className="filter-dropdown">
              <div className="filter-option" onClick={() => { setFilterGpa(""); setOpenFilter(null); }}>
                Любой GPA
              </div>
              {["2.0", "2.5", "3.0", "3.5", "3.8"].map((g) => (
                <div key={g} className="filter-option"
                  onClick={() => { setFilterGpa(g); setOpenFilter(null); }}>
                  {g}+
                </div>
              ))}
            </div>
          )}
        </div>

        {hasFilters && (
          <button className="filter-btn filter-btn--clear" onClick={clearFilters}>
            ✕
          </button>
        )}
      </div>

      {/* University list */}
      <div className="home-list">
        {loading ? (
          <div className="home-loading">Загрузка...</div>
        ) : error ? (
          <div className="home-error">{error}</div>
        ) : universities.length === 0 ? (
          <div className="home-empty">Университеты не найдены</div>
        ) : (
          universities.map((uni) => {
            const diffStyle = getDifficultyStyle(uni.label, uni.color);
            return (
              <div key={uni.id} className="uni-card">
                <div className="uni-card-top">
                  <div className="uni-card-left">
                    <div className="uni-name">{uni.name}</div>
                    <div className="uni-location">{uni.city}, {uni.country}</div>
                  </div>
                  <div className="uni-card-right">
                    <span className="uni-prob">{uni.probability}%</span>
                    <span className="uni-badge" style={{
                      background: diffStyle.bg,
                      color: diffStyle.text,
                      border: `1px solid ${diffStyle.border}`,
                    }}>
                      {uni.label}
                    </span>
                  </div>
                </div>

                <div className="uni-stats">
                  <div className="uni-stat">
                    <span className="uni-stat-label">Вероятность</span>
                    <span className="uni-stat-value">{uni.probability}%</span>
                  </div>
                  <div className="uni-stat">
                    <span className="uni-stat-label">GPA</span>
                    <span className="uni-stat-value">{uni.min_gpa}+</span>
                  </div>
                  <div className="uni-stat">
                    <span className="uni-stat-label">SAT</span>
                    <span className="uni-stat-value">{uni.min_sat}+</span>
                  </div>
                </div>

                <button className="uni-add-btn">Добавить</button>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom navigation */}
      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${activePage === item.key ? "bottom-nav-item--active" : ""}`}
            onClick={() => handleNav(item.key)}
          >
            {item.icon(activePage === item.key)}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}