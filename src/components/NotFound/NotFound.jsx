import "./NotFound.css";

export default function NotFound({ onNavigate }) {
  return (
    <div className="nf-root">
      <div className="nf-blob1" />
      <div className="nf-blob2" />
      <div className="nf-number">4<span>?</span>4</div>
      <div className="nf-title">Oops. Page not found</div>
      <div className="nf-sub">
        But your path to university is still on track.<br />
        Continue from where you left off.
      </div>
      <button className="nf-btn" onClick={() => onNavigate("dashboard")}>
        Back to Home
      </button>
    </div>
  );
}