import './NavigationArrows.css'

const NavigationArrows = ({ onLeftClick, onRightClick }) => {
  return (
    <div className="navigation-arrows">
      <button 
        className="navigation-arrow navigation-arrow-left"
        onClick={onLeftClick}
        aria-label="Previous column"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        className="navigation-arrow navigation-arrow-right"
        onClick={onRightClick}
        aria-label="Next column"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default NavigationArrows
