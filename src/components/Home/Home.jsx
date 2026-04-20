import { useState, useEffect } from "react";
import "./Home.css";
import { universitiesApi } from "../../api.js";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Home",
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
    label: "Opportunities",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
      </svg>
    ),
  },
  {
    key: "essay",
    label: "AI Chat",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
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
  "Средне": { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "Реально": { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "hard":   { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "medium": { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "easy":   { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
};

export default function Home({ onNavigate }) {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => {
    loadCountries();
    loadSaved();
    loadUniversities();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadUniversities(), 300);
    return () => clearTimeout(timer);
  }, [search, filterCountry, filterLabel, sortBy]);

  const loadCountries = async () => {
    try {
      const data = await universitiesApi.getCountries();
      setCountries(Array.isArray(data) ? data : ["Australia", "UK", "Canada", "USA"]);
    } catch {
      setCountries(["Australia", "UK", "Canada", "USA"]);
    }
  };

  const loadSaved = async () => {
    try {
      const data = await universitiesApi.getSaved();
      setSavedIds((Array.isArray(data) ? data : []).map(u => u.id));
    } catch {}
  };

  const loadUniversities = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (filterCountry) filters.country = filterCountry;
      if (filterLabel)   filters.label = filterLabel;
      if (sortBy)        filters.sort_by = sortBy;
      if (search)        filters.search = search;
      const data = await universitiesApi.getAll(filters);
      setUniversities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (uni) => {
    const isSaved = savedIds.includes(uni.id);
    try {
      if (isSaved) {
        await universitiesApi.unsave(uni.id);
        setSavedIds(prev => prev.filter(id => id !== uni.id));
        showToast("Removed from board");
      } else {
        await universitiesApi.save(uni.id);
        setSavedIds(prev => [...prev, uni.id]);
        showToast("Added to board ✓");
      }
    } catch (err) {
      showToast("Error: " + err.message);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const getLabelStyle = (label) =>
    LABEL_COLORS[label] || { bg: "#f5f5f5", text: "#666", border: "#ddd" };

  const clearFilters = () => {
    setFilterCountry("");
    setFilterLabel("");
    setSortBy("");
    setSearch("");
    setOpenFilter(null);
  };

  const hasFilters = filterCountry || filterLabel || sortBy || search;
  const handleNav = (key) => { if (onNavigate) onNavigate(key); };

  return (
    <div className="home-root" onClick={() => openFilter && setOpenFilter(null)}>
      {/* Header */}
      <div className="home-header">
        <button className="home-back-btn" onClick={() => handleNav("dashboard")}>
          ‹ Back
        </button>
        <div className="home-logo"><span className="home-logo-arrow">↗</span>Eduplat</div>
      </div>

      {/* Title */}
      <div className="home-title-row">
        <h1 className="home-title">Add University</h1>
        <p className="home-subtitle">Search and add universities to your board</p>
      </div>

      {/* Search + Filters */}
      <div className="home-controls">
        <div className="home-search-wrap">
          <svg className="home-search-icon" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="home-search"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          {search && (
            <button className="home-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="home-filters-row" onClick={(e) => e.stopPropagation()}>

          {/* Country */}
          <div className="filter-wrap">
            <button
              className={`filter-btn ${filterCountry ? "filter-btn--active" : ""}`}
              onClick={() => setOpenFilter(openFilter === "country" ? null : "country")}
            >
              {filterCountry || "Country"} ▾
            </button>
            {openFilter === "country" && (
              <div className="filter-dropdown">
                <div className="filter-option" onClick={() => { setFilterCountry(""); setOpenFilter(null); }}>
                  All countries
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

          {/* Label */}
          <div className="filter-wrap">
            <button
              className={`filter-btn ${filterLabel ? "filter-btn--active" : ""}`}
              onClick={() => setOpenFilter(openFilter === "label" ? null : "label")}
            >
              {filterLabel || "Difficulty"} ▾
            </button>
            {openFilter === "label" && (
              <div className="filter-dropdown">
                <div className="filter-option" onClick={() => { setFilterLabel(""); setOpenFilter(null); }}>
                  All
                </div>
                {["hard", "medium", "easy"].map((d) => (
                  <div key={d} className="filter-option"
                    onClick={() => { setFilterLabel(d); setOpenFilter(null); }}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="filter-wrap">
            <button
              className={`filter-btn ${sortBy ? "filter-btn--active" : ""}`}
              onClick={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
            >
              {sortBy === "probability" ? "Probability" : sortBy === "min_gpa" ? "GPA" : sortBy === "min_sat" ? "SAT" : sortBy === "ranking" ? "Ranking" : "Sort"} ▾
            </button>
            {openFilter === "sort" && (
              <div className="filter-dropdown">
                <div className="filter-option" onClick={() => { setSortBy(""); setOpenFilter(null); }}>
                  Default
                </div>
                {[
                  { key: "probability", label: "By probability" },
                  { key: "min_gpa", label: "By GPA" },
                  { key: "min_sat", label: "By SAT" },
                  { key: "ranking", label: "By ranking" },
                ].map((s) => (
                  <div key={s.key} className="filter-option"
                    onClick={() => { setSortBy(s.key); setOpenFilter(null); }}>
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasFilters && (
            <button className="filter-btn filter-btn--clear" onClick={clearFilters}>✕ Reset</button>
          )}
        </div>
      </div>

      {/* University list */}
      <div className="home-list">
        {loading ? (
          <div className="home-loading">Loading...</div>
        ) : error ? (
          <div className="home-error">{error}</div>
        ) : universities.length === 0 ? (
          <div className="home-empty">No universities found</div>
        ) : (
          universities.map((uni) => {
            const labelStyle = getLabelStyle(uni.label);
            const isSaved = savedIds.includes(uni.id);
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
                      background: labelStyle.bg,
                      color: labelStyle.text,
                      border: `1px solid ${labelStyle.border}`,
                    }}>
                      {uni.label}
                    </span>
                  </div>
                </div>

                <div className="uni-stats">
                  <div className="uni-stat">
                    <span className="uni-stat-label">Probability</span>
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

                <button
                  className={`uni-add-btn ${isSaved ? "uni-add-btn--saved" : ""}`}
                  onClick={() => toggleSave(uni)}
                >
                  {isSaved ? "✓ On board" : "Add"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {toast && <div className="home-toast">{toast}</div>}

      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className="bottom-nav-item"
            onClick={() => handleNav(item.key)}
          >
            {item.icon(false)}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}