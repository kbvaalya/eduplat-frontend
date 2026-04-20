import { useState, useEffect } from "react";
import "./UniversityDetail.css";
import { universitiesApi } from "../../api.js";

const LABEL_COLORS = {
  "Сложно": { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "Средне":  { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "Реально": { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  "hard":    { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "medium":  { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "easy":    { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
};

function getLabelStyle(label) {
  return LABEL_COLORS[label] || { bg: "#f5f5f5", text: "#666", border: "#ddd" };
}

export default function UniversityDetail({ uniId, onNavigate }) {
  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (uniId) loadUni();
  }, [uniId]);

  const loadUni = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await universitiesApi.getById(uniId);
      setUni(data);
    } catch (err) {
      setError(err.message || "Loading error");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = uni ? getLabelStyle(uni.label) : {};

  const ambition = uni ? Math.min(100, Math.round((1 - uni.probability / 100) * 60 + 20)) : 0;
  const match = uni ? Math.round(uni.probability) : 0;
  const hit = uni ? Math.min(100, Math.round(uni.probability * 0.85)) : 0;

  return (
    <div className="ud-root">

      {/* Header */}
      <div className="ud-header">
        <div className="ud-logo"><span className="ud-logo-arrow">↗</span>Eduplat</div>
      </div>

      {/* Back + title */}
      <div className="ud-back-row">
        <button className="ud-back-btn" onClick={() => onNavigate("back")}>
          ‹ Back
        </button>
      </div>
      <div className="ud-page-title">University Details</div>

      {loading && (
        <div className="ud-loading">
          <div className="ud-spinner" />
          Loading...
        </div>
      )}

      {error && <div className="ud-error">{error}</div>}

      {uni && (
        <>
          {/* Hero */}
          <div className="ud-hero">
            <div className="ud-hero-top">
              <div className="ud-hero-left">
                <div className="ud-uni-name">{uni.name}</div>
                <div className="ud-uni-location">{uni.city}, {uni.country}</div>
              </div>
              <div className="ud-hero-right">
                <span className="ud-prob">{uni.probability}%</span>
                <span className="ud-badge" style={{
                  background: labelStyle.bg,
                  color: labelStyle.text,
                  border: `1px solid ${labelStyle.border}`,
                }}>
                  {uni.label}
                </span>
              </div>
            </div>

            <div className="ud-stats">
              <div className="ud-stat">
                <div className="ud-stat-label">Probability</div>
                <div className="ud-stat-value">{uni.probability}%</div>
              </div>
              <div className="ud-stat">
                <div className="ud-stat-label">GPA</div>
                <div className="ud-stat-value">{uni.min_gpa}+</div>
              </div>
              <div className="ud-stat">
                <div className="ud-stat-label">SAT</div>
                <div className="ud-stat-value">{uni.min_sat}+</div>
              </div>
            </div>

            {uni.website && (
              <button
                className="ud-official-btn"
                onClick={() => window.open(uni.website, "_blank")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Official Website
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="ud-tabs">
            <button
              className={`ud-tab ${activeTab === "info" ? "ud-tab--active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              University
            </button>
            <button
              className={`ud-tab ${activeTab === "ai" ? "ud-tab--active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              AI Analysis
            </button>
          </div>

          {/* Tab content */}
          <div className="ud-content">

            {/* ── INFO TAB ── */}
            {activeTab === "info" && (
              <>
                {uni.description && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">🏛️</span>
                      <span className="ud-section-title">About University</span>
                    </div>
                    <div className="ud-section-body">
                      <p>{uni.description}</p>
                      {uni.ranking && <p>🏆 World ranking: <strong>#{uni.ranking}</strong></p>}
                      {uni.students_count && <p>👨‍🎓 Students: <strong>{uni.students_count.toLocaleString()}</strong></p>}
                      {uni.founded_year && <p>📅 Founded: <strong>{uni.founded_year}</strong></p>}
                    </div>
                  </div>
                )}

                {uni.programs && uni.programs.length > 0 && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">📚</span>
                      <span className="ud-section-title">Main Programs</span>
                    </div>
                    <ul className="ud-list">
                      {uni.programs.map((p, i) => (
                        <li key={i} className="ud-list-item">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(uni.tuition_min || uni.tuition_max || uni.tuition) && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">💰</span>
                      <span className="ud-section-title">Admission & Tuition</span>
                    </div>
                    <div className="ud-section-body">
                      {uni.tuition && <p>Tuition fee: <strong>{uni.tuition}</strong></p>}
                      {uni.tuition_min && uni.tuition_max && (
                        <p>Cost: <strong>${uni.tuition_min.toLocaleString()} – ${uni.tuition_max.toLocaleString()}/year</strong></p>
                      )}
                      {uni.application_fee && <p>Application fee: <strong>${uni.application_fee}</strong></p>}
                    </div>
                  </div>
                )}

                {uni.scholarships && uni.scholarships.length > 0 && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">🎓</span>
                      <span className="ud-section-title">Scholarships</span>
                    </div>
                    <ul className="ud-list">
                      {uni.scholarships.map((s, i) => (
                        <li key={i} className="ud-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="ud-section">
                  <div className="ud-section-header">
                    <span className="ud-section-icon">📋</span>
                    <span className="ud-section-title">Admission Requirements</span>
                  </div>
                  <ul className="ud-list">
                    {uni.min_gpa && <li className="ud-list-item">GPA: minimum <strong>{uni.min_gpa}</strong></li>}
                    {uni.min_sat && <li className="ud-list-item">SAT: minimum <strong>{uni.min_sat}</strong></li>}
                    {uni.min_ielts && <li className="ud-list-item">IELTS: minimum <strong>{uni.min_ielts}</strong></li>}
                    {uni.min_toefl && <li className="ud-list-item">TOEFL: minimum <strong>{uni.min_toefl}</strong></li>}
                    {uni.requirements && uni.requirements.map((r, i) => (
                      <li key={i} className="ud-list-item">{r}</li>
                    ))}
                  </ul>
                </div>

                {(uni.deadline || uni.deadlines) && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">📅</span>
                      <span className="ud-section-title">Application Deadlines</span>
                    </div>
                    <div className="ud-section-body">
                      {uni.deadline && <p>Main deadline: <strong>{uni.deadline}</strong></p>}
                      {Array.isArray(uni.deadlines) && uni.deadlines.map((d, i) => (
                        <p key={i}>{d}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── AI TAB ── */}
            {activeTab === "ai" && (
              <>
                <div className="ud-ai-card">
                  <div className="ud-ai-title">
                    <span>🤖</span> AI Analysis
                  </div>
                  <div className="ud-ai-body">
                    {uni.ai_analysis
                      ? uni.ai_analysis
                      : `Admission chances are estimated at ${uni.probability}%. Improving your profile (e.g. raising GPA or adding extracurriculars) could significantly increase your chances. Focus on crafting a motivation letter that highlights your unique qualities.`
                    }
                  </div>

                  <div className="ud-ai-stats">
                    <div className="ud-ai-stat-row">
                      <span className="ud-ai-stat-label">Ambition</span>
                      <div className="ud-ai-stat-bar">
                        <div className="ud-ai-stat-fill"
                          style={{ width: `${ambition}%`, background: "#ffa726" }} />
                      </div>
                      <span className="ud-ai-stat-val">{ambition}%</span>
                    </div>
                    <div className="ud-ai-stat-row">
                      <span className="ud-ai-stat-label">Match</span>
                      <div className="ud-ai-stat-bar">
                        <div className="ud-ai-stat-fill"
                          style={{ width: `${match}%`, background: "#4caf50" }} />
                      </div>
                      <span className="ud-ai-stat-val">{match}%</span>
                    </div>
                    <div className="ud-ai-stat-row">
                      <span className="ud-ai-stat-label">Fit</span>
                      <div className="ud-ai-stat-bar">
                        <div className="ud-ai-stat-fill"
                          style={{ width: `${hit}%`, background: "#1E47F7" }} />
                      </div>
                      <span className="ud-ai-stat-val">{hit}%</span>
                    </div>
                  </div>
                </div>

                <div className="ud-ai-card ud-ai-strengths">
                  <div className="ud-ai-title">
                    <span>✅</span> Your Strengths
                  </div>
                  <div className="ud-ai-items">
                    {(uni.user_strengths || [
                      "GPA above average",
                      "Time to improve your profile",
                      "Motivation to enter a strong university",
                    ]).map((s, i) => (
                      <div key={i} className="ud-ai-item">{s}</div>
                    ))}
                  </div>
                </div>

                <div className="ud-ai-card ud-ai-recs">
                  <div className="ud-ai-title">
                    <span>💡</span> Recommendations
                  </div>
                  <div className="ud-ai-items">
                    {(uni.recommendations || [
                      "Improve your GPA if possible",
                      "Add more extracurricular activities",
                      "Write a compelling motivation letter",
                    ]).map((r, i) => (
                      <div key={i} className="ud-ai-item">{r}</div>
                    ))}
                  </div>
                </div>

                {uni.deadline && (
                  <div className="ud-ai-card ud-ai-deadlines">
                    <div className="ud-ai-title">
                      <span>⏰</span> Deadline
                    </div>
                    <div className="ud-ai-items">
                      <div className="ud-ai-item">Main deadline: <strong>{uni.deadline}</strong></div>
                      {uni.min_gpa && <div className="ud-ai-item">Average GPA: {uni.min_gpa}</div>}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </>
      )}

    </div>
  );
}