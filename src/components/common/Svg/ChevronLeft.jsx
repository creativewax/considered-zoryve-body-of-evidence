/**
 * ChevronLeft.jsx
 * Reusable left-pointing chevron icon (e.g. carousel previous).
 */

const ChevronLeft = ({ width = 24, height = 24, className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ChevronLeft
