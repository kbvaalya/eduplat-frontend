import { useState, useEffect } from "react";
import "./Profile.css";
import { userApi } from "../../api.js";

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