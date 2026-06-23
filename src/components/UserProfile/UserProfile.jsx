import styles from "./UserProfile.module.css";

const PROFILES = {
  business:   { label: "사업기획",    icon: "📊", persona: "사업기획팀장" },
  marketing:  { label: "영업·마케팅", icon: "📣", persona: "영업마케팅팀장" },
  rnd:        { label: "R&D",         icon: "🔬", persona: "연구개발팀장" },
  production: { label: "생산·품질",   icon: "🏭", persona: "생산품질파트장" },
  executive:  { label: "경영진",      icon: "📈", persona: "대표이사" },
};

export default function UserProfile({ selectedProfile, onProfileChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>직무 프로필</span>
      <div className={styles.tabs}>
        {Object.entries(PROFILES).map(([key, { label, icon }]) => (
          <button
            key={key}
            className={`${styles.tab} ${selectedProfile === key ? styles.active : ""}`}
            onClick={() => onProfileChange(key)}
            title={PROFILES[key].persona}
          >
            <span className={styles.icon}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
