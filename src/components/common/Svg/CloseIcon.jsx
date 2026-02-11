/**
 * CloseIcon.jsx
 *
 * Inline SVG close (X) icon. Pass bgClassName and fgClassName to override fills via your CSS (e.g. using existing vars).
 */

const CloseIcon = ({
  width = 72,
  height = 72,
  className = '',
  bgClassName = '',
  fgClassName = ''
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 72"
    width={width}
    height={height}
    className={`close-icon ${className}`.trim()}
    aria-hidden
  >
    <path
      className={`close-icon-bg ${bgClassName}`.trim()}
      d="M55.48,55.37c-10.79,10.79-28.29,10.79-39.09,0s-10.79-28.29,0-39.09,28.29-10.79,39.09,0c11.21,10.83,11.28,28.33,0,39.09Z"
    />
    <path
      className={`close-icon-fg ${fgClassName}`.trim()}
      d="M61.46,10.54C47.4-3.52,24.6-3.52,10.54,10.54c-14.06,14.06-14.06,36.85,0,50.91,14.06,14.06,36.85,14.06,50.91,0,14.06-14.06,14.06-36.85,0-50.91ZM46.94,51.11l-10.94-10.94-10.94,10.94c-1.15,1.15-3.01,1.15-4.16,0s-1.15-3.01,0-4.16l10.94-10.94-10.94-10.94c-1.15-1.15-1.15-3.01,0-4.16s3.01-1.15,4.16,0l10.94,10.94,10.94-10.94c1.15-1.15,3.01-1.15,4.16,0s1.15,3.01,0,4.16l-10.94,10.94,10.94,10.94c1.15,1.15,1.15,3.01,0,4.16s-3.01,1.15-4.16,0Z"
    />
  </svg>
)

export default CloseIcon
