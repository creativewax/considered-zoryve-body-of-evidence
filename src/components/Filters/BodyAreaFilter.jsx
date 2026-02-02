import { motion } from 'framer-motion'
import { FILTER_OPTIONS, ASSETS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import './RadioFilter.css'
import './BodyAreaFilter.css'

const BodyAreaFilter = ({ currentSource, selected }) => {
  const bodyAreas = [
    FILTER_OPTIONS.BODY_AREA.HEAD_NECK,
    FILTER_OPTIONS.BODY_AREA.TORSO,
    FILTER_OPTIONS.BODY_AREA.ARMS_HANDS,
    FILTER_OPTIONS.BODY_AREA.LEGS_FEET,
  ]

  const handleSelect = (bodyArea) => {
    appStateManager.setFilter('bodyArea', bodyArea === selected ? null : bodyArea)
  }

  return (
    <FilterComponent title="Body Area" currentSource={currentSource}>
      <div className="body-area-filter">
        <div 
          className="body-area-filter__background"
          style={{
            backgroundImage: `url(${ASSETS.ICONS.BODY_AREA_PERSON})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom left'
          }}
        />
        <div className="radio-filter body-area-filter__options">
          {bodyAreas.map((bodyArea) => (
            <motion.button
              key={bodyArea}
              className="radio-option"
              onClick={() => handleSelect(bodyArea)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`radio-button ${selected === bodyArea ? 'radio-button--selected' : ''}`}>
                {selected === bodyArea && (
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <path
                      d="M4 8 L7 11 L12 4"
                      stroke="var(--color-zoryve-black)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </div>
              <span className={`radio-option__text ${selected === bodyArea ? 'radio-option__text--selected' : ''}`}>
                {bodyArea}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </FilterComponent>
  )
}

export default BodyAreaFilter
