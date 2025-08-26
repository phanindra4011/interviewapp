import type { SVGProps } from "react";

export const CoachMascot = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse cx="90" cy="90" rx="80" ry="80" fill="#F0F4FF" />
    <ellipse cx="90" cy="110" rx="55" ry="45" fill="#667eea" />
    <ellipse cx="90" cy="90" rx="40" ry="40" fill="#fff" />
    <ellipse cx="90" cy="100" rx="28" ry="22" fill="#764ba2" />
    <ellipse cx="75" cy="95" rx="5" ry="7" fill="#fff" />
    <ellipse cx="105" cy="95" rx="5" ry="7" fill="#fff" />
    <ellipse cx="90" cy="110" rx="10" ry="6" fill="#fff" />
    <path d="M80 120 Q90 130 100 120" stroke="#fff" strokeWidth="3" fill="none" />
    <circle cx="90" cy="80" r="6" fill="#667eea" />
    <ellipse cx="90" cy="80" rx="2" ry="3" fill="#fff" />
    <ellipse cx="90" cy="80" rx="1" ry="1.5" fill="#764ba2" />
    <ellipse cx="70" cy="85" rx="3" ry="2" fill="#764ba2" />
    <ellipse cx="110" cy="85" rx="3" ry="2" fill="#764ba2" />
    <ellipse cx="70" cy="85" rx="1" ry="1" fill="#fff" />
    <ellipse cx="110" cy="85" rx="1" ry="1" fill="#fff" />
    <ellipse cx="90" cy="140" rx="18" ry="6" fill="#e0e0f8" />
  </svg>
);
