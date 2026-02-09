/**
 * ChevronRight.jsx
 * Reusable right-pointing chevron icon (e.g. carousel next).
 */

const ChevronRight = ({ width = 24, height = 24, className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ChevronRight
