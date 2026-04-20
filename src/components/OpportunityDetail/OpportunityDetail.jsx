import { useState, useEffect } from "react";
import "./OpportunityDetail.css";
import { opportunitiesApi } from "../../api.js";

const TYPE_LABELS = {
  internship: "Internship",
  volunteering: "Volunteering",
  hackathon: "Hackathon",
  conference: "Conference",
};

export default function OpportunityDetail({ oppId, onNavigate }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (oppId) loadEvent();
  }, [oppId]);

  const loadEvent = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await opportunitiesApi.getById(oppId);
      setEvent(data);
    } catch (err) {
      setError(err.message || "Loading error");
    } finally {
      setLoading(false);
    }
  };

  const hasImage = event?.image_url && !imgError;

  return (
    <div className="od-root">

      {/* Hero image (if exists and no error) */}
      {!loading && event && hasImage ? (
        <div className="od-img-wrap">
          <img
            src={event.image_url}
            alt={event.title}
            className="od-img"
            onError={() => setImgError(true)}
            crossOrigin="anonymous"
          />
          <button className="od-back-over" onClick={() => onNavigate("back")}>
            ‹ Back
          </button>
        </div>
      ) : !loading && event && !hasImage ? (
        <>
          <div className="od-header">
            <div className="od-logo"><span className="od-logo-arrow">↗</span>Eduplat</div>
          </div>
          <div className="od-back-row">
            <button className="od-back-btn" onClick={() => onNavigate("back")}>‹ Back</button>
          </div>
        </>
      ) : null}

      {/* Loading */}
      {loading && (
        <>
          <div className="od-header">
            <div className="od-logo"><span className="od-logo-arrow">↗</span>Eduplat</div>
          </div>
          <div className="od-back-row">
            <button className="od-back-btn" onClick={() => onNavigate("back")}>‹ Back</button>
          </div>
          <div className="od-loading">
            <div className="od-spinner" />
            Loading...
          </div>
        </>
      )}

      {error && <div className="od-error">{error}</div>}

      {event && (
        <div className="od-content">
          {/* Title block */}
          <div className="od-title-block">
            {event.type && (
              <div className="od-type-badge">{TYPE_LABELS[event.type] || event.type}</div>
            )}
            <div className="od-title">{event.title}</div>

            <div className="od-meta">
              {event.event_date && (
                <div className="od-meta-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {event.event_date}
                </div>
              )}
              {event.deadline && (
                <div className="od-meta-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Deadline: {event.deadline}
                </div>
              )}
              {event.location && (
                <div className="od-meta-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {event.location}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="od-body">

            {/* Description */}
            {(event.description || event.short_description) && (
              <div>
                <div className="od-section-title"><span>📄</span> Details</div>
                <div className="od-desc">{event.description || event.short_description}</div>
              </div>
            )}

            {/* Info grid */}
            {(event.format || event.time || event.age_range || event.duration) && (
              <div className="od-info-grid">
                {event.format && (
                  <div className="od-info-cell">
                    <div className="od-info-label">Format</div>
                    <div className="od-info-value">{event.format}</div>
                  </div>
                )}
                {event.time && (
                  <div className="od-info-cell">
                    <div className="od-info-label">Time</div>
                    <div className="od-info-value">{event.time}</div>
                  </div>
                )}
                {event.age_range && (
                  <div className="od-info-cell">
                    <div className="od-info-label">Age</div>
                    <div className="od-info-value">{event.age_range}</div>
                  </div>
                )}
                {event.duration && (
                  <div className="od-info-cell">
                    <div className="od-info-label">Duration</div>
                    <div className="od-info-value">{event.duration}</div>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            {event.benefits && event.benefits.length > 0 && (
              <div>
                <div className="od-section-title"><span>🎁</span> What you'll get</div>
                <ul className="od-list">
                  {event.benefits.map((b, i) => (
                    <li key={i} className="od-list-item">{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div>
                <div className="od-section-title"><span>📋</span> Requirements</div>
                <ul className="od-list">
                  {event.requirements.map((r, i) => (
                    <li key={i} className="od-list-item">{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Free badge */}
            {event.is_free && (
              <div className="od-free-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Free event
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div>
                <div className="od-section-title"><span>🏢</span> Organizer</div>
                <div className="od-desc">{event.organizer}</div>
              </div>
            )}

          </div>

          {/* CTA */}
          <div className="od-cta">
            <button
              className="od-cta-btn"
              onClick={() => event.link && window.open(event.link, "_blank")}
            >
              Apply Now
            </button>
          </div>

        </div>
      )}
    </div>
  );
}