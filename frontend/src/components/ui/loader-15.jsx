import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <style>{`
        .loader-15-gegga {
          width: 0;
          height: 0;
          position: absolute;
        }

        .loader-15-snurra {
          filter: url(#gegga);
        }

        .loader-15-stopp1 {
          stop-color: #c4b5fd;
        }

        .loader-15-stopp2 {
          stop-color: #86efac;
        }

        .loader-15-halvan {
          animation: Snurra1 10s infinite linear;
          stroke-dasharray: 180 800;
          fill: none;
          stroke: url(#gradient);
          stroke-width: 23;
          stroke-linecap: round;
        }

        .loader-15-strecken {
          animation: Snurra1 3s infinite linear;
          stroke-dasharray: 26 54;
          fill: none;
          stroke: url(#gradient);
          stroke-width: 23;
          stroke-linecap: round;
        }

        .loader-15-skugga {
          filter: blur(5px);
          opacity: 0.3;
          position: absolute;
          transform: translate(3px, 3px);
        }

        @keyframes Snurra1 {
          0% {
            stroke-dashoffset: 0;
          }

          100% {
            stroke-dashoffset: -403px;
          }
        }
      `}</style>
      <div className="relative flex items-center justify-center">
        <svg className="loader-15-gegga">
          <defs>
            <filter id="gegga">
              <feGaussianBlur in="SourceGraphic" stdDeviation={7} result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" result="inreGegga" />
              <feComposite in="SourceGraphic" in2="inreGegga" operator="atop" />
            </filter>
          </defs>
        </svg>
        <svg className="loader-15-snurra" width={160} height={160} viewBox="0 0 200 200">
          <defs>
            <linearGradient id="linjärGradient">
              <stop className="loader-15-stopp1" offset={0} />
              <stop className="loader-15-stopp2" offset={1} />
            </linearGradient>
            <linearGradient y2={160} x2={160} y1={40} x1={40} gradientUnits="userSpaceOnUse" id="gradient" xlinkHref="#linjärGradient" />
          </defs>
          <path className="loader-15-halvan" d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64" />
          <circle className="loader-15-strecken" cx={100} cy={100} r={64} />
        </svg>
        <svg className="loader-15-skugga" width={160} height={160} viewBox="0 0 200 200">
          <path className="loader-15-halvan" d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64" />
          <circle className="loader-15-strecken" cx={100} cy={100} r={64} />
        </svg>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] mt-4 animate-pulse">
        GENESIS // INITIALIZING…
      </span>
    </div>
  );
}
