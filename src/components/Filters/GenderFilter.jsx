import { motion } from 'framer-motion'
import { FILTER_OPTIONS, ASSETS } from '../../constants/index.js'
import { ANIMATION_PROPS } from '../../constants/animations.js'
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
        {genders.map((gender) => {
          const isSelected = selected === gender.value
          return (
            <motion.button
              key={gender.value}
              className={`gender-button ${isSelected ? 'gender-button--selected' : ''}`}
              onClick={() => handleSelect(gender.value)}
              {...ANIMATION_PROPS.INTERACTIVE}
            >
              <img 
                src={gender.icon} 
                alt={gender.value}
                className={`gender-button__icon ${isSelected ? 'gender-button__icon--selected' : 'gender-button__icon--unselected'}`}
              />
              <span className={`gender-button__text ${isSelected ? 'gender-button__text--selected' : ''}`}>
                {gender.value}
              </span>
            </motion.button>
          )
        })}
      </div>
    </FilterComponent>
  )
}

export default GenderFilter
