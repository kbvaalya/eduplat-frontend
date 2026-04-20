import { useState } from "react";
import "./Premium.css";

const FEATURES = [
  {
    icon: "🎓",
    title: "Unlimited Universities",
    sub: "Add and track without any limit",
  },
  {
    icon: "🔍",
    title: "Advanced Analysis",
    sub: "Deep evaluation of your profile and chances",
  },
  {
    icon: "🤖",
    title: "AI Recommendations",
    sub: "Personalized advice based on your data",
  },
  {
    icon: "📄",
    title: "20 AI Essay Checks",
    sub: "Essay review and improvement powered by AI",
  },
  {
    icon: "🚀",
    title: "Full Access to Opportunities",
    sub: "All features without limits with personal notifications",
  },
];

export default function Premium({ onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState("annual");

  return (
    <div className="prem-root">

      {/* Back */}
      <div className="prem-back">
        <button className="prem-back-btn" onClick={() => onNavigate("back")}>
          ‹ Back
        </button>
      </div>

      {/* Hero */}
      <div className="prem-hero">
        <div className="prem-glow">✨</div>
        <h1 className="prem-title">Upgrade to Premium</h1>
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
          <div className="prem-plan-badge">Save 45%</div>
          <div className="prem-plan-period">Annual</div>
          <div className="prem-plan-price">$39.90</div>
          <div className="prem-plan-desc">Popular among users for great value</div>
        </button>

        {/* Monthly */}
        <button
          className={`prem-plan ${selectedPlan === "monthly" ? "prem-plan--active" : ""}`}
          onClick={() => setSelectedPlan("monthly")}
        >
          <div className="prem-plan-period">Monthly</div>
          <div className="prem-plan-price">$5.90</div>
          <div className="prem-plan-desc">Perfect for short-term preparation</div>
        </button>
      </div>

      {/* CTA */}
      <div className="prem-cta">
        <button className="prem-cta-btn">
          Get Premium
        </button>
      </div>

    </div>
  );
}