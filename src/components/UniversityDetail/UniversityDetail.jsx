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
      setError(err.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = uni ? getLabelStyle(uni.label) : {};

  // AI analysis stats computed from uni data
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
          ‹ Назад
        </button>
      </div>
      <div className="ud-page-title">Подробная информация</div>

      {loading && (
        <div className="ud-loading">
          <div className="ud-spinner" />
          Загрузка...
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
                <div className="ud-stat-label">Вероятность</div>
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
                Перейти на официальный сайт
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="ud-tabs">
            <button
              className={`ud-tab ${activeTab === "info" ? "ud-tab--active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Университет
            </button>
            <button
              className={`ud-tab ${activeTab === "ai" ? "ud-tab--active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              Анализ ИИ
            </button>
          </div>

          {/* Tab content */}
          <div className="ud-content">

            {/* ── INFO TAB ── */}
            {activeTab === "info" && (
              <>
                {/* About */}
                {uni.description && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">🏛️</span>
                      <span className="ud-section-title">О университете</span>
                    </div>
                    <div className="ud-section-body">
                      <p>{uni.description}</p>
                      {uni.ranking && <p>🏆 Мировой рейтинг: <strong>#{uni.ranking}</strong></p>}
                      {uni.students_count && <p>👨‍🎓 Студентов: <strong>{uni.students_count.toLocaleString()}</strong></p>}
                      {uni.founded_year && <p>📅 Основан: <strong>{uni.founded_year}</strong></p>}
                    </div>
                  </div>
                )}

                {/* Programs */}
                {uni.programs && uni.programs.length > 0 && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">📚</span>
                      <span className="ud-section-title">Основные направления</span>
                    </div>
                    <ul className="ud-list">
                      {uni.programs.map((p, i) => (
                        <li key={i} className="ud-list-item">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tuition */}
                {(uni.tuition_min || uni.tuition_max || uni.tuition) && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">💰</span>
                      <span className="ud-section-title">Поступление и стоимость</span>
                    </div>
                    <div className="ud-section-body">
                      {uni.tuition && <p>Стоимость обучения: <strong>{uni.tuition}</strong></p>}
                      {uni.tuition_min && uni.tuition_max && (
                        <p>Стоимость: <strong>${uni.tuition_min.toLocaleString()} – ${uni.tuition_max.toLocaleString()}/год</strong></p>
                      )}
                      {uni.application_fee && <p>Взнос за заявку: <strong>${uni.application_fee}</strong></p>}
                    </div>
                  </div>
                )}

                {/* Scholarships */}
                {uni.scholarships && uni.scholarships.length > 0 && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">🎓</span>
                      <span className="ud-section-title">Стипендии</span>
                    </div>
                    <ul className="ud-list">
                      {uni.scholarships.map((s, i) => (
                        <li key={i} className="ud-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                <div className="ud-section">
                  <div className="ud-section-header">
                    <span className="ud-section-icon">📋</span>
                    <span className="ud-section-title">Требования для поступления</span>
                  </div>
                  <ul className="ud-list">
                    {uni.min_gpa && <li className="ud-list-item">GPA: минимум <strong>{uni.min_gpa}</strong></li>}
                    {uni.min_sat && <li className="ud-list-item">SAT: минимум <strong>{uni.min_sat}</strong></li>}
                    {uni.min_ielts && <li className="ud-list-item">IELTS: минимум <strong>{uni.min_ielts}</strong></li>}
                    {uni.min_toefl && <li className="ud-list-item">TOEFL: минимум <strong>{uni.min_toefl}</strong></li>}
                    {uni.requirements && uni.requirements.map((r, i) => (
                      <li key={i} className="ud-list-item">{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Deadlines */}
                {(uni.deadline || uni.deadlines) && (
                  <div className="ud-section">
                    <div className="ud-section-header">
                      <span className="ud-section-icon">📅</span>
                      <span className="ud-section-title">Сроки подачи документов</span>
                    </div>
                    <div className="ud-section-body">
                      {uni.deadline && <p>Основной дедлайн: <strong>{uni.deadline}</strong></p>}
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
                {/* Analysis text */}
                <div className="ud-ai-card">
                  <div className="ud-ai-title">
                    <span>🤖</span> Анализ ИИ
                  </div>
                  <div className="ud-ai-body">
                    {uni.ai_analysis
                      ? uni.ai_analysis
                      : `Шансы поступления оцениваются в ${uni.probability}%, но при улучшении профиля (например, повышении GPA или добавлении внеучебных активностей) шансы могут значительно возрасти. Cфокусируйся на подготовке мотивационного письма, которое подчёркивает твои уникальные качества.`
                    }
                  </div>

                  <div className="ud-ai-stats">
                    <div className="ud-ai-stat-row">
                      <span className="ud-ai-stat-label">Амбициозность</span>
                      <div className="ud-ai-stat-bar">
                        <div className="ud-ai-stat-fill"
                          style={{ width: `${ambition}%`, background: "#ffa726" }} />
                      </div>
                      <span className="ud-ai-stat-val">{ambition}%</span>
                    </div>
                    <div className="ud-ai-stat-row">
                      <span className="ud-ai-stat-label">Соответствие</span>
                      <div className="ud-ai-stat-bar">
                        <div className="ud-ai-stat-fill"
                          style={{ width: `${match}%`, background: "#4caf50" }} />
                      </div>
                      <span className="ud-ai-stat-val">{match}%</span>
                    </div>
                    <div className="ud-ai-stat-row">
                      <span className="ud-ai-stat-label">Попадание</span>
                      <div className="ud-ai-stat-bar">
                        <div className="ud-ai-stat-fill"
                          style={{ width: `${hit}%`, background: "#1E47F7" }} />
                      </div>
                      <span className="ud-ai-stat-val">{hit}%</span>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="ud-ai-card ud-ai-strengths">
                  <div className="ud-ai-title">
                    <span>✅</span> Твои сильные стороны
                  </div>
                  <div className="ud-ai-items">
                    {(uni.user_strengths || [
                      "GPA выше среднего",
                      "Есть время улучшить профиль",
                      "Мотивация поступить в сильный университет",
                    ]).map((s, i) => (
                      <div key={i} className="ud-ai-item">{s}</div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="ud-ai-card ud-ai-recs">
                  <div className="ud-ai-title">
                    <span>💡</span> Рекомендации
                  </div>
                  <div className="ud-ai-items">
                    {(uni.recommendations || [
                      "GPA выше среднего",
                      "Есть время улучшить профиль",
                      "Мотивация поступить в сильный университет",
                    ]).map((r, i) => (
                      <div key={i} className="ud-ai-item">{r}</div>
                    ))}
                  </div>
                </div>

                {/* Deadline reminder */}
                {uni.deadline && (
                  <div className="ud-ai-card ud-ai-deadlines">
                    <div className="ud-ai-title">
                      <span>⏰</span> Дедлайн
                    </div>
                    <div className="ud-ai-items">
                      <div className="ud-ai-item">Основной дедлайн: <strong>{uni.deadline}</strong></div>
                      {uni.min_gpa && <div className="ud-ai-item">GPA среднего: {uni.min_gpa}</div>}
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