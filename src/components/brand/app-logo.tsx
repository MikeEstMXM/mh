type AppLogoProps = {
  className?: string;
  title?: string;
};

export function AppLogo({ className, title = "App logo" }: AppLogoProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      className={className}
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      viewBox="0 0 1024 1024"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="app-logo-sunset" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#4f2f8a" />
          <stop offset="47%" stopColor="#ff6b4d" />
          <stop offset="100%" stopColor="#ffe36b" />
        </linearGradient>
      </defs>
      <circle cx="512" cy="474" fill="url(#app-logo-sunset)" r="278" />
      <path
        d="M509 258c-16 3-34 8-51 16-31 4-46 19-56 39-23 29-43 76-33 145 5 31 17 58 29 82-14 17-30 36-46 54-18 20-36 40-51 60-10 14-18 28-20 46 17 16 38 28 55 44 10 11 21 20 31 30 8 8 17 16 22 26 22 2 44-2 66 0 29 1 59-2 88 2 18 3 38 10 56 19 13 7 27 14 42 15-2-17-12-31-19-46-8-17-7-34-5-53 2-20 8-41 1-61-14-11-32-18-48-27-20-10-40-20-61-27 36-8 71-16 103-34 28-16 48-40 62-68 5-10 11-20 20-28 11-10 15-23 12-37-3-13-14-22-21-32-12-16-22-33-36-48-8-9-17-17-25-26-3-18-9-36-17-52-11-22-32-41-54-53-19-11-41-15-62-15-7-3-15-4-24-2-7-7-15-11-26-11-5 0-11 1-16 3zm120 45c16 6 31 16 44 29 7 7 17 12 18 22-9-1-17-7-25-11-16-8-33-11-50-11-16-2-31 3-45 8-11 5-24 6-35 10 8-15 25-23 39-32 17-8 36-17 54-15zm132 175c10 8 7 20-2 29-7 7-15 14-19 24-12 23-24 49-45 65-14 12-31 19-47 28-17 8-35 14-53 20-7 2-18 7-24 1-5-7 4-16 8-22 19-21 41-39 55-64 11-18 17-40 33-55 15-14 32-27 52-35 15-4 30-1 42 9z"
        fill="#141047"
      />
    </svg>
  );
}
