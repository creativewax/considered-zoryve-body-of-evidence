import { motion } from 'framer-motion'
import { FILTER_OPTIONS, ASSETS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import './GenderFilter.css'

const GenderFilter = ({ currentSource, selected }) => {
  const genders = [
    { value: FILTER_OPTIONS.GENDER.MALE, icon: ASSETS.ICONS.MALE },
    { value: FILTER_OPTIONS.GENDER.FEMALE, icon: ASSETS.ICONS.FEMALE },
  ]

  const handleSelect = (gender) => {
    appStateManager.setFilter('gender', gender === selected ? null : gender)
  }

  return (
    <FilterComponent title="Gender" currentSource={currentSource}>
      <div className="gender-filter">
        {genders.map((gender) => (
          <motion.button
            key={gender.value}
            className={`gender-button ${selected === gender.value ? 'gender-button--selected' : ''}`}
            onClick={() => handleSelect(gender.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src={gender.icon} 
              alt={gender.value}
              className="gender-button__icon"
              style={{
                filter: selected === gender.value 
                  ? 'brightness(0)' 
                  : 'brightness(1)'
              }}
            />
            <span className={`gender-button__text ${selected === gender.value ? 'gender-button__text--selected' : ''}`}>
              {gender.value}
            </span>
          </motion.button>
        ))}
      </div>
    </FilterComponent>
  )
}

export default GenderFilter
