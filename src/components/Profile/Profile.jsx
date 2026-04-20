import { useState, useEffect } from "react";
import "./Profile.css";
import { userApi } from "../../api.js";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Home",
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
    label: "Opportunities",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
      </svg>
    ),
  },
  {
    key: "essay",
    label: "AI Chat",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#1E47F7" : "#888"} strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
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
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onNavigate("welcome");
  };

  const handleNav = (key) => {
    if (onNavigate) onNavigate(key);
  };

  const name = user?.about?.name || "User";
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
        <ProfileRow icon="👤" label="Profile Settings" onPress={() => {}} />
        <ProfileRow icon="🔖" label="Saved" onPress={() => {}} />
        <ProfileRow icon="💳" label="Subscription" onPress={() => {}} />
      </div>

      {/* Section 2 */}
      <div className="profile-section">
        <ProfileRow icon="⚙️" label="General Settings" onPress={() => {}} />
        <div className="profile-row">
          <div className="profile-row-left">
            <span className="profile-row-icon">🌙</span>
            <span className="profile-row-label">Dark Mode</span>
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
            <span className="profile-row-label">Disable Notifications</span>
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
        <ProfileRow icon="🌐" label="Language" onPress={() => {}} />
      </div>

      {/* Section 3 */}
      <div className="profile-section">
        <ProfileRow icon="💬" label="Support" onPress={() => {}} />
        <ProfileRow icon="🔒" label="Privacy Policy" onPress={() => {}} />
      </div>

      {/* Logout */}
      <div className="profile-section">
        <button className="profile-logout" onClick={handleLogout}>
          <span>→</span> Log Out
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