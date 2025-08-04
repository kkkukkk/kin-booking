interface MediaIconProps {
  className?: string;
}

export const PlayIcon = ({ className = "w-5 h-5" }: MediaIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`bi bi-play-fill ${className}`} viewBox="0 0 16 16">
    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
  </svg>
);

export const MicIcon = ({ className = "w-5 h-5" }: MediaIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`bi bi-mic-fill ${className}`} viewBox="0 0 16 16">
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
  </svg>
); 