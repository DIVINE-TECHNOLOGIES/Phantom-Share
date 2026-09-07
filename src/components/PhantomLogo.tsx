import React from 'react';

interface PhantomLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: boolean;
  textColor?: 'dark' | 'light';
  separateWords?: boolean;
  useImage?: boolean;
}

export const PhantomLogo: React.FC<PhantomLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  subtitle = false,
  textColor = 'dark',
  separateWords = true,
  useImage = false,
}) => {
  const sizeMap = {
    sm: { 
      icon: 'w-8 h-8', 
      text: 'text-lg', 
      sub: 'text-[8.5px] tracking-[0.2em]',
      gap: 'gap-2.5'
    },
    md: { 
      icon: 'w-10 h-10', 
      text: 'text-xl sm:text-2xl', 
      sub: 'text-[9.5px] tracking-[0.22em]',
      gap: 'gap-3'
    },
    lg: { 
      icon: 'w-16 h-16', 
      text: 'text-3xl sm:text-4xl', 
      sub: 'text-xs tracking-[0.25em]',
      gap: 'gap-4'
    },
    xl: { 
      icon: 'w-24 h-24', 
      text: 'text-5xl sm:text-6xl', 
      sub: 'text-sm tracking-[0.28em]',
      gap: 'gap-5'
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Logo Icon Mark */}
      <div className={`relative ${currentSize.icon} shrink-0 rounded-2xl overflow-hidden shadow-sm select-none`}>
        {useImage ? (
          <img
            src="/logo.jpg"
            alt="Phantom Share"
            className="w-full h-full object-cover rounded-2xl"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-Fidelity Scalable Vector Emblem of Phantom Share */
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full rounded-2xl"
          >
            <defs>
              <linearGradient id="ps-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="ps-purple-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="35%" stopColor="#818cf8" />
                <stop offset="70%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <linearGradient id="ps-fold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <linearGradient id="ps-ribbon" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>

              <filter id="ps-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background container with rounded corners */}
            <rect width="100" height="100" rx="22" fill="url(#ps-bg)" />

            {/* Main Document Body in P shape */}
            <path
              d="M32 20C26.5 20 22 24.5 22 30V75C22 77.2 23.8 79 26 79C28.2 79 30 77.2 30 75V52H52C63 52 72 43 72 32C72 25.4 66.6 20 60 20H32Z"
              fill="url(#ps-purple-cyan)"
            />

            {/* Top-Right Page Fold Corner */}
            <path
              d="M58 20V32C58 33.1 58.9 34 60 34H72L58 20Z"
              fill="url(#ps-fold)"
              opacity="0.95"
            />

            {/* Ghost Shadow Silhouette in the hollow */}
            <path
              d="M34 32C34 26 38 24 45 24C52 24 55 28 55 34C55 42 46 43 42 43C37 43 34 39 34 34V32Z"
              fill="#060911"
            />

            {/* Ghost Glowing Eyes */}
            <ellipse cx="40.5" cy="33.5" rx="2.2" ry="1.2" transform="rotate(-15 40.5 33.5)" fill="#ffffff" filter="url(#ps-glow)" />
            <ellipse cx="48.5" cy="33.5" rx="2.2" ry="1.2" transform="rotate(15 48.5 33.5)" fill="#ffffff" filter="url(#ps-glow)" />

            {/* Lower 3D Ribbon Swoop of the P */}
            <path
              d="M24 58C28 50 36 38 52 38C61 38 68 44 68 50C68 56 61 63 48 68L30 74C26 75.3 22 71.5 24 67L24 58Z"
              fill="url(#ps-ribbon)"
              opacity="0.95"
            />

            {/* Floating digital byte / pixel cubes on the right */}
            <rect x="74" y="32" width="5.5" height="5.5" rx="1" fill="#38bdf8" />
            <rect x="82" y="32" width="5.5" height="5.5" rx="1" fill="#67e8f9" />
            <rect x="78" y="40" width="5.5" height="5.5" rx="1" fill="#38bdf8" />
            <rect x="74" y="48" width="4.5" height="4.5" rx="1" fill="#0284c7" />
            <rect x="81" y="48" width="4.5" height="4.5" rx="1" fill="#38bdf8" />
            <rect x="74" y="56" width="3.5" height="3.5" rx="0.8" fill="#818cf8" />
          </svg>
        )}
      </div>

      {/* Text Branding */}
      {showText && (
        <div className="flex flex-col justify-center select-none text-left">
          {/* Main Title: Phantom Share */}
          <div className={`font-black tracking-tight flex items-baseline leading-none ${currentSize.text}`}>
            <span className={textColor === 'dark' ? 'text-gray-900 dark:text-white font-extrabold transition-colors' : 'text-white font-extrabold'}>
              Phantom
            </span>
            {separateWords && <span className="inline-block w-1.5 sm:w-2"></span>}
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#c084fc] bg-clip-text text-transparent font-extrabold">
              Share
            </span>
          </div>

          {/* Subtitle: SECURE FILE SHARING & CONVERSION */}
          {subtitle && (
            <span className={`font-bold uppercase mt-1 text-gray-500 dark:text-slate-400 font-sans transition-colors ${currentSize.sub}`}>
              Secure File Sharing & Conversion
            </span>
          )}
        </div>
      )}
    </div>
  );
};
