import "./NotFound.css";

export default function NotFound({ onNavigate }) {
  return (
    <div className="nf-root">
      <div className="nf-blob1" />
      <div className="nf-blob2" />
      <div className="nf-number">4<span>?</span>4</div>
      <div className="nf-title">Упс. страница не найдена</div>
      <div className="nf-sub">
        Но пока путь к университету — под контролем.<br />
        Продолжай с того, где ты остановился.
      </div>
      <button className="nf-btn" onClick={() => onNavigate("dashboard")}>
        Вернуться на главную
      </button>
    </div>
  );
}