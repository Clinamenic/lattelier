import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ExportIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    width={size} 
    height={size}
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 12 L16 4 24 12" />
  </svg>
);

export const ImportIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    width={size} 
    height={size}
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16" />
  </svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

export const SaveIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    width={size} 
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M26,29H6a3,3,0,0,1-3-3V6A3,3,0,0,1,6,3H20.26a3,3,0,0,1,1.95.72L28,8.64A3,3,0,0,1,29,10.92V26A3,3,0,0,1,26,29ZM6,5A1,1,0,0,0,5,6V26a1,1,0,0,0,1,1H26a1,1,0,0,0,1-1V10.92a1,1,0,0,0-.35-.76L20.91,5.24A1,1,0,0,0,20.26,5Z"/>
    <path d="M18,10H10A2,2,0,0,1,8,8V4A1,1,0,0,1,9,3H19a1,1,0,0,1,1,1V8A2,2,0,0,1,18,10ZM10,5V8h8V5Z"/>
    <path d="M23,29H9a1,1,0,0,1-1-1V17a2,2,0,0,1,2-2H22a2,2,0,0,1,2,2V28A1,1,0,0,1,23,29ZM10,27H22V17H10Z"/>
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const RightSidebarHideIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <rect height="16" rx="2" width="16" x="4" y="4"/>
    <path d="M15 4v16"/>
    <path d="M10 10l-2 2l2 2"/>
  </svg>
);

export const RightSidebarShowIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <rect height="16" rx="2" width="16" x="4" y="4"/>
    <path d="M15 4v16"/>
    <path d="M9 10l2 2l-2 2"/>
  </svg>
);

export const LeftSidebarHideIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <rect height="16" rx="2" width="16" x="4" y="4"/>
    <path d="M9 4v16"/>
    <path d="M14 14l2 -2l-2 -2"/>
  </svg>
);

export const LeftSidebarShowIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <rect height="16" rx="2" width="16" x="4" y="4"/>
    <path d="M9 4v16"/>
    <path d="M15 14l-2 -2l2 -2"/>
  </svg>
);

export const PanIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 50.001 50.001"
    className={className}
    fill="currentColor"
  >
    <path d="M19.001,27.001v-4h-11l5-5l-3-3l-10,10l10,10l3-3l-5-5H19.001z M23.001,8.001v11h4v-11l5,5l3-3L25,0L15,10.001l3,3L23.001,8.001z M27,42.001v-11h-4v11l-5-5l-3,3l10,10l10-10l-3-3L27,42.001z M40,15.001l-3,3l5,5H31v4h11l-5,5l3,3l10-10L40,15.001z"/>
  </svg>
);

export const PlaceWellIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 420.75 420.75"
    className={className}
    fill="currentColor"
  >
    <path d="M210.375,153C177.862,153,153,177.862,153,210.375s24.862,57.375,57.375,57.375s57.375-24.862,57.375-57.375S242.888,153,210.375,153z M210.375,248.625c-21.038,0-38.25-17.213-38.25-38.25c0-21.038,17.212-38.25,38.25-38.25c21.037,0,38.25,17.212,38.25,38.25C248.625,231.412,231.412,248.625,210.375,248.625z"/>
    <path d="M210.375,76.5C135.788,76.5,76.5,135.788,76.5,210.375c0,74.588,59.288,133.875,133.875,133.875c74.588,0,133.875-59.287,133.875-133.875C344.25,135.788,284.963,76.5,210.375,76.5z M210.375,325.125c-63.112,0-114.75-51.638-114.75-114.75s51.638-114.75,114.75-114.75s114.75,51.638,114.75,114.75S273.487,325.125,210.375,325.125z"/>
    <path d="M210.375,0C93.712,0,0,93.712,0,210.375C0,327.037,93.712,420.75,210.375,420.75c116.662,0,210.375-93.713,210.375-210.375C420.75,93.712,327.037,0,210.375,0z M210.375,401.625c-105.188,0-191.25-86.062-191.25-191.25s86.062-191.25,191.25-191.25s191.25,86.062,191.25,191.25S315.562,401.625,210.375,401.625z"/>
  </svg>
);

export const EyeOpenIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const EyeClosedIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export const CancelIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="9" rx="2" ry="2" />
    <path d="M9 11V8a3 3 0 0 1 6 0v3" />
  </svg>
);

export const UnlockIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="9" rx="2" ry="2" />
    <path d="M9 11V8a3 3 0 0 1 4.9-2.35" />
    <path d="M13 11h2" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const AttractIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M1 12h5l-2-3" />
    <path d="M1 12h5l-2 3" />
    <path d="M23 12h-5l2-3" />
    <path d="M23 12h-5l2 3" />
  </svg>
);

export const RepelIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M7 12h-5l2-3" />
    <path d="M7 12h-5l2 3" />
    <path d="M17 12h5l-2-3" />
    <path d="M17 12h5l-2 3" />
  </svg>
);
