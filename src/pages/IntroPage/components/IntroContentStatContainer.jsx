/**
 * IntroContentStatContainer.jsx
 *
 * Grid container for stat cards
 */

import IntroContentStat from './IntroContentStat.jsx'
import './IntroContentStatContainer.css'

const IntroContentStatContainer = ({ stats }) => {
  return (
    <div className="intro-content-stat-container">
      {stats.map((stat, index) => (
        <IntroContentStat
          key={index}
          title={stat.title}
          zoryvePercent={stat['zoryve-percent']}
          vehiclePercent={stat['vehicle-percent']}
          zoryveCount={stat['zoryve-count']}
          vehicleCount={stat['vehicle-count']}
        />
      ))}
    </div>
  )
}

export default IntroContentStatContainer
