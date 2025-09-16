

import React from 'react';

type SVGProps = React.SVGProps<SVGSVGElement>;

export const SparklesIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.9 4.2-4.2 1.9 4.2 1.9L12 15l1.9-4.2 4.2-1.9-4.2-1.9L12 3z" />
    <path d="M5 13 3 17l4 2 2-4-4-2" />
    <path d="M19 13 17 9l-4 2 2 4 4-2" />
  </svg>
);

export const LoadingSpinnerIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const ImageIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const InstagramIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

export const DownloadIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const ShareIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

export const XIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const GoogleIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    {/* Fixed typo in closing tag from pATH to path */}
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

export const AppleIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540.85 666.71" {...props}>
    <path fill="currentColor" d="M494.85,583.33c-27.67,41.33-57,81.67-101.67,82.33-44.67,1-59-26.33-109.67-26.33s-66.67,25.67-109,27.33c-43.67,1.67-76.67-44-104.67-84.33C12.85,500-30.81,348.33,27.85,246.33c29-50.67,81-82.67,137.33-83.67,42.67-.67,83.33,29,109.67,29s75.33-35.67,127-30.33c21.67,1,82.33,8.67,121.33,66-3,2-72.33,42.67-71.67,127,1,100.67,88.33,134.33,89.33,134.67-1,2.33-14,48-46,94.33ZM304.52,50C328.85,22.33,369.19,1.33,402.52,0c4.33,39-11.33,78.33-34.67,106.33-23,28.33-61,50.33-98.33,47.33-5-38.33,13.67-78.33,35-103.67Z"/>
  </svg>
);

export const TshirtIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 772.58 772.58" {...props}>
    <defs>
      <style>
        {`
          .cls-1 {
            fill: #f1c894;
          }

          .cls-1, .cls-2, .cls-4 {
            stroke-width: 0px;
          }

          .cls-2 {
            fill: #18bbb4;
          }

          .cls-2, .cls-4 {
            mix-blend-mode: multiply;
          }

          .cls-5 {
            isolation: isolate;
          }

          .cls-4 {
            fill: #ec4642;
          }
        `}
      </style>
    </defs>
    <g className="cls-5">
      <g id="Capa_1" data-name="Capa 1">
        <g>
          <polygon className="cls-1" points="230.81 251.64 75.33 520.94 386.29 520.94 230.81 251.64"/>
          <polygon className="cls-4" points="386.29 251.64 230.81 520.94 541.77 520.94 386.29 251.64"/>
          <polygon className="cls-2" points="541.77 251.64 386.29 520.94 697.25 520.94 541.77 251.64"/>
        </g>
      </g>
    </g>
  </svg>
);