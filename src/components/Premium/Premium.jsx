import { useState } from "react";
import "./Premium.css";

const FEATURES = [
  {
    icon: "🎓",
    title: "Неограниченные университеты",
    sub: "Добавляй и отслеживай без лимита",
  },
  {
    icon: "🔍",
    title: "Расширенный анализ",
    sub: "Глубокая оценка профиля и шансов",
  },
  {
    icon: "🤖",
    title: "AI рекомендации",
    sub: "Персональные советы на основе твоих данных",
  },
  {
    icon: "📄",
    title: "20 AI проверок эссе",
    sub: "Проверка и улучшение эссе при помощи ИИ",
  },
  {
    icon: "🚀",
    title: "Полный доступ к возможностям",
    sub: "Все функции без ограничений с персональными уведомлениями",
  },
];

export default function Premium({ onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState("annual");

  return (
    <div className="prem-root">

      {/* Back */}
      <div className="prem-back">
        <button className="prem-back-btn" onClick={() => onNavigate("back")}>
          ‹ Назад
        </button>
      </div>

      {/* Hero */}
      <div className="prem-hero">
        <div className="prem-glow">✨</div>
        <h1 className="prem-title">Переходи на Premium</h1>
      </div>

      {/* Features */}
      <div className="prem-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="prem-feature">
            <div className="prem-feature-icon">{f.icon}</div>
            <div className="prem-feature-text">
              <div className="prem-feature-title">{f.title}</div>
              <div className="prem-feature-sub">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="prem-plans">
        {/* Annual */}
        <button
          className={`prem-plan ${selectedPlan === "annual" ? "prem-plan--active" : ""}`}
          onClick={() => setSelectedPlan("annual")}
        >
          <div className="prem-plan-badge">Экономия в 45%</div>
          <div className="prem-plan-period">Годовой</div>
          <div className="prem-plan-price">$39.90</div>
          <div className="prem-plan-desc">Популярно у пользователей из-за большой выгоды</div>
        </button>

        {/* Monthly */}
        <button
          className={`prem-plan ${selectedPlan === "monthly" ? "prem-plan--active" : ""}`}
          onClick={() => setSelectedPlan("monthly")}
        >
          <div className="prem-plan-period">Месячный</div>
          <div className="prem-plan-price">$5.90</div>
          <div className="prem-plan-desc">Идеально для пользователей с краткосрочной подготовкой</div>
        </button>
      </div>

      {/* CTA */}
      <div className="prem-cta">
        <button className="prem-cta-btn">
          Получить Premium
        </button>
      </div>

    </div>
  );
}