/**
 * IntroContentStat.jsx
 *
 * Individual stat card with ZORYVE vs Vehicle comparison
 */

import './IntroContentStat.css'

const IntroContentStat = ({ title, zoryvePercent, vehiclePercent, zoryveCount, vehicleCount }) => {
  return (
    <div className="intro-content-stat">
      <div className="intro-content-stat-title">{title}</div>
      
      <div className="intro-content-stat-divider" />
      
      <div className="intro-content-stat-values">
        {/* ZORYVE column */}
        <div className="intro-content-stat-column">
          <div className="intro-content-stat-label zoryve-label">ZORYVE</div>
          <div className="intro-content-stat-percent zoryve-percent">{zoryvePercent}%</div>
          <div className="intro-content-stat-count">n={zoryveCount}</div>
        </div>
        
        {/* Vehicle column */}
        <div className="intro-content-stat-column">
          <div className="intro-content-stat-label vehicle-label">Vehicle</div>
          <div className="intro-content-stat-percent vehicle-percent">{vehiclePercent}%</div>
          <div className="intro-content-stat-count">n={vehicleCount}</div>
        </div>
      </div>
    </div>
  )
}

export default IntroContentStat
