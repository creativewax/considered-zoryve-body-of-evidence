import { motion } from 'framer-motion'
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations.js'
import ConditionFilter from '../Filters/ConditionFilter.jsx'
import FormulationFilter from '../Filters/FormulationFilter.jsx'
import BodyAreaFilter from '../Filters/BodyAreaFilter.jsx'
import BaselineSeverityFilter from '../Filters/BaselineSeverityFilter.jsx'
import AgeFilter from '../Filters/AgeFilter.jsx'
import GenderFilter from '../Filters/GenderFilter.jsx'
import './FilterBody.css'

const FilterBody = ({ currentSource, filters }) => {
  return (
    <motion.div 
      className="filter-body"
      key={currentSource}
      initial={ANIMATIONS.FADE_IN.initial}
      animate={ANIMATIONS.FADE_IN.animate}
      transition={TRANSITIONS.NORMAL}
    >
      <div className="filter-body-content">
        <ConditionFilter currentSource={currentSource} selected={filters.condition} />
        <FormulationFilter currentSource={currentSource} selected={filters.formulation} />
        <BodyAreaFilter currentSource={currentSource} selected={filters.bodyArea} />
        <BaselineSeverityFilter currentSource={currentSource} selected={filters.baselineSeverity} />
        <AgeFilter currentSource={currentSource} selected={filters.age} />
        <GenderFilter currentSource={currentSource} selected={filters.gender} />
      </div>
    </motion.div>
  )
}

export default FilterBody
