function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export default function SystemThemeIndicator() {
  const label = "Theme follows your system setting";

  return (
    <span
      className="system-theme-indicator"
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="system-theme-icon system-theme-icon-light" aria-hidden="true">
        <SunIcon />
      </span>
      <span className="system-theme-icon system-theme-icon-dark" aria-hidden="true">
        <MoonIcon />
      </span>
    </span>
  );
}
