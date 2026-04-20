import { useState, useEffect } from "react";
import "./Opportunities.css";
import { opportunitiesApi } from "../../api.js";
// Place Group_18.png in src/assets/ and import it:
// import logoArrow from "../../assets/Group_18.png";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "internship", label: "Internships" },
  { key: "volunteering", label: "Volunteering" },
  { key: "hackathon", label: "Hackathons" },
  { key: "conference", label: "Conferences" },
];

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

/* ── Logo component using Group_18.png ── */
function Logo() {
  return (
    <div className="opp-logo">
      {/* If you add Group_18.png to src/assets/, use:
          <img src={logoArrow} alt="" className="opp-logo-img" />
          Otherwise the SVG arrow below is used as fallback */}
      <svg className="opp-logo-img" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect width="18" height="18" rx="4" fill="#1E47F7"/>
        <path d="M5 13L13 5M13 5H8M13 5V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Eduplat
    </div>
  );
}

export default function Opportunities({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => { loadSaved(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadEvents(), 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  const loadSaved = async () => {
    try {
      const data = await opportunitiesApi.getSaved();
      setSavedIds((Array.isArray(data) ? data : []).map(e => e.id));
    } catch {}
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeCategory) filters.type = activeCategory;
      if (search) filters.search = search;
      const data = await opportunitiesApi.getAll(filters);
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (event) => {
    const isSaved = savedIds.includes(event.id);
    try {
      if (isSaved) {
        await opportunitiesApi.unsave(event.id);
        setSavedIds(prev => prev.filter(id => id !== event.id));
        setToast("Removed from saved");
      } else {
        await opportunitiesApi.save(event.id);
        setSavedIds(prev => [...prev, event.id]);
        setToast("Saved to profile ✓");
      }
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast("Error: " + err.message);
      setTimeout(() => setToast(""), 2500);
    }
  };

  const handleNav = (key) => { if (onNavigate) onNavigate(key); };

  return (
    <div className="opp-root">
      {/* Mobile header */}
      <div className="opp-header">
        <Logo />
      </div>

      <div className="opp-page-wrap">
        {/* Desktop sidebar */}
        <aside className="opp-sidebar">
          <div className="opp-sidebar-logo"><Logo /></div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`opp-sidebar-item ${item.key === "opportunities" ? "opp-sidebar-item--active" : ""}`}
              onClick={() => handleNav(item.key)}
            >
              {item.icon(item.key === "opportunities")}
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        <main className="opp-main">
          <div className="opp-title-row">
            <h1 className="opp-title">Opportunities</h1>
          </div>

          {/* Search */}
          <div className="opp-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"
              style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="opp-search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="opp-cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`opp-cat-btn ${activeCategory === cat.key ? "opp-cat-btn--active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="opp-list">
            {loading ? (
              <div className="opp-loading">Loading...</div>
            ) : events.length === 0 ? (
              <div className="opp-empty">No events found</div>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  saved={savedIds.includes(event.id)}
                  onSave={() => toggleSave(event)}
                  onDetail={() => handleNav("opp-detail", event.id)}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {toast && (
        <div className="opp-toast">
          <span className="opp-toast-check">✓</span> {toast}
        </div>
      )}

      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${item.key === "opportunities" ? "bottom-nav-item--active" : ""}`}
            onClick={() => handleNav(item.key)}
          >
            {item.icon(item.key === "opportunities")}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Event Card with working image loading ── */
function EventCard({ event, saved, onSave, onDetail }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="event-card">
      <div className="event-card-inner">
        <div className="event-img-wrap">
          {event.image_url && !imgError ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="event-img"
              onError={() => setImgError(true)}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="event-img-placeholder">
              <span className="event-img-placeholder-icon">
                {event.type === "internship" ? "💼" :
                 event.type === "volunteering" ? "🤝" :
                 event.type === "hackathon" ? "💻" :
                 event.type === "conference" ? "🎤" : "🎓"}
              </span>
            </div>
          )}
        </div>

        <div className="event-content">
          <div className="event-top">
            <div className="event-title">{event.title}</div>
            <button className="event-save-btn" onClick={onSave}>
              {saved ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1E47F7" stroke="#1E47F7" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
              )}
            </button>
          </div>

          {event.type && (
            <span className="event-type-badge">
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          )}

          <div className="event-desc">{event.short_description}</div>

          <div className="event-dates">
            {event.event_date && (
              <span className="event-date-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {event.event_date}
              </span>
            )}
            {event.deadline && (
              <span className="event-date-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Deadline: {event.deadline}
              </span>
            )}
          </div>

          <button className="event-more-btn" onClick={onDetail}>Learn More</button>
        </div>
      </div>
    </div>
  );
}