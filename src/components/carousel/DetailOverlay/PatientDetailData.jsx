/**
 * PatientDetailData.jsx
 *
 * Renders patient info in the detail overlay: 9 fields in 3 columns of 3.
 * Type, Condition, Formulation | Gender, Age, Race | Body Area, Treatments, Ethnicity.
 * Uses N/A for missing or "Not Reported" values.
 */

import { FILTER_OPTIONS, GENDER_CODE, PATIENT_SCHEMA } from '../../../constants/index.js'
import { isValidValue } from '../../../utils/patientDataSplitter.js'
import './PatientDetailData.css'

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function displayValue(value) {
  if (isValidValue(value, false)) return value
  return 'N/A'
}

// ---------------------------------------------------------------------------
// INFO ITEM
// ---------------------------------------------------------------------------

const InfoItem = ({ label, value }) => (
  <div className="detail-overlay-info-item">
    <span className="detail-overlay-info-label">{label}:</span>
    <span className="detail-overlay-info-value">{value}</span>
  </div>
)

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const PatientDetailData = ({ patient }) => {
  const genderDisplay = patient[PATIENT_SCHEMA.GENDER] === GENDER_CODE.MALE ? FILTER_OPTIONS.GENDER.MALE : FILTER_OPTIONS.GENDER.FEMALE
  console.log('PatientDetailData patient:', patient, 'genderDisplay:', genderDisplay, 'patient[PATIENT_SCHEMA.GENDER]:', patient[PATIENT_SCHEMA.GENDER])

  const column1 = [
    { label: 'Type', value: displayValue(patient.type) },
    { label: 'Condition', value: displayValue(patient.condition) },
    { label: 'Formulation', value: displayValue(patient.formulation) },
  ]
  const column2 = [
    { label: 'Gender', value: genderDisplay },
    { label: 'Age', value: displayValue(patient.age) },
    { label: 'Race', value: displayValue(patient.race) },
  ]
  const column3 = [
    { label: 'Body Area', value: displayValue(patient.bodyArea) },
    // { label: 'Treatments Tried and Failed', value: displayValue(patient.treatmentsTriedAndFailed) },
    { label: 'Ethnicity', value: displayValue(patient.ethnicity) },
  ]

  return (
    <div className="detail-overlay-data-panel">
      <div className="detail-overlay-info">
        <div className="detail-overlay-info-column">
          {column1.map(({ label, value }) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </div>
        <div className="detail-overlay-info-column">
          {column2.map(({ label, value }) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </div>
        <div className="detail-overlay-info-column">
          {column3.map(({ label, value }) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientDetailData
