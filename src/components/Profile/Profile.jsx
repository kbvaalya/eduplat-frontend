import { useState, useEffect } from "react";
import "./Profile.css";
import { userApi } from "../../api.js";

const NAV_ITEMS = [
  {
    key: "home",
    label: "Главная",
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
    label: "Возможности",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
      </svg>
    ),
  },
  {
    key: "essay",
    label: "AI чат",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Профиль",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1E47F7" : "none"}
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function Profile({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await userApi.getMe();
      setUser(data);
    } catch {
      // если не удалось загрузить — показываем пустой профиль
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onNavigate("welcome");
  };

  const handleNav = (key) => {
    if (onNavigate) onNavigate(key);
  };

  const name = user?.about?.name || "Пользователь";
  const email = user?.email || "";

  return (
    <div className="profile-root">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-logo"><span className="profile-logo-arrow">↗</span>Eduplat</div>
      </div>

      {/* User info */}
      <div className="profile-user">
        <div className="profile-name">{name}</div>
        <div className="profile-email">@{email}</div>
      </div>

      {/* Section 1 */}
      <div className="profile-section">
        <ProfileRow icon="👤" label="Настройки профиля" onPress={() => {}} />
        <ProfileRow icon="🔖" label="Сохранённые" onPress={() => {}} />
        <ProfileRow icon="💳" label="Подписка" onPress={() => {}} />
      </div>

      {/* Section 2 */}
      <div className="profile-section">
        <ProfileRow icon="⚙️" label="Общие настройки" onPress={() => {}} />
        <div className="profile-row">
          <div className="profile-row-left">
            <span className="profile-row-icon">🌙</span>
            <span className="profile-row-label">Тёмный режим</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="profile-row">
          <div className="profile-row-left">
            <span className="profile-row-icon">🔔</span>
            <span className="profile-row-label">Отключить уведомления</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
        <ProfileRow icon="🌐" label="Язык" onPress={() => {}} />
      </div>

      {/* Section 3 */}
      <div className="profile-section">
        <ProfileRow icon="💬" label="Поддержка" onPress={() => {}} />
        <ProfileRow icon="🔒" label="Политика конфиденциальности" onPress={() => {}} />
      </div>

      {/* Logout */}
      <div className="profile-section">
        <button className="profile-logout" onClick={handleLogout}>
          <span>→</span> Выйти с аккаунта
        </button>
      </div>

      {/* Bottom navigation */}
      <div className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${item.key === "profile" ? "bottom-nav-item--active" : ""}`}
            onClick={() => handleNav(item.key)}
          >
            {item.icon(item.key === "profile")}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, onPress }) {
  return (
    <button className="profile-row profile-row--btn" onClick={onPress}>
      <div className="profile-row-left">
        <span className="profile-row-icon">{icon}</span>
        <span className="profile-row-label">{label}</span>
      </div>
      <span className="profile-row-arrow">›</span>
    </button>
  );
}