import { useState, useEffect } from "react";
import "./Opportunities.css";
import { opportunitiesApi } from "../../../api.js";

const CATEGORIES = [
  { key: "", label: "Все" },
  { key: "internship", label: "Стажировки" },
  { key: "volunteering", label: "Волонтерство" },
  { key: "hackathon", label: "Хакатоны" },
  { key: "conference", label: "Конференции" },
];

export default function Opportunities() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [activeCategory]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await opportunitiesApi.getAll(activeCategory ? { type: activeCategory } : {});
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      showToast();
      return [...prev, id];
    });
  };

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="opp-root">
      {/* Header */}
      <div className="opp-header">
        <div className="opp-logo"><span className="opp-logo-arrow">↗</span>Eduplat</div>
      </div>

      {/* Title */}
      <div className="opp-title-row">
        <h1 className="opp-title">Возможности</h1>
      </div>

      {/* Category filter */}
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
          <div className="opp-loading">Загрузка...</div>
        ) : events.length === 0 ? (
          <div className="opp-empty">Мероприятия не найдены</div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved={savedIds.includes(event.id)}
              onSave={() => toggleSave(event.id)}
            />
          ))
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="opp-toast">
          <span className="opp-toast-check">✓</span> Сохранено в профиле
        </div>
      )}
    </div>
  );
}

function EventCard({ event, saved, onSave }) {
  return (
    <div className="event-card">
      <div className="event-card-inner">
        {/* Image */}
        <div className="event-img-wrap">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="event-img" />
          ) : (
            <div className="event-img-placeholder" />
          )}
        </div>

        {/* Content */}
        <div className="event-content">
          <div className="event-top">
            <div className="event-title">{event.title}</div>
            <button
              className={`event-save-btn ${saved ? "event-save-btn--saved" : ""}`}
              onClick={onSave}
            >
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

          <div className="event-desc">{event.short_description}</div>

          <div className="event-dates">
            <span className="event-date-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {event.event_date}
            </span>
            <span className="event-date-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {event.deadline}
            </span>
          </div>

          <button className="event-more-btn">Подробнее</button>
        </div>
      </div>
    </div>
  );
}