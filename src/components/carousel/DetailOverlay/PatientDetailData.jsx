/**
 * PatientDetailData.jsx
 *
 * Renders patient info in the detail overlay: 9 fields in 3 columns of 3.
 * Type, Condition, Formulation | Gender, Age, Race | Body Area, Treatments, Ethnicity.
 * Uses N/A for missing or "Not Reported" values.
 */

import { DATA_SOURCE, FILTER_OPTIONS, GENDER_CODE } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const NOT_REPORTED = /^not reported\.?$/i

function displayValue(value) {
  if (value == null || value === '') return 'N/A'
  const s = String(value).trim()
  if (s === '' || NOT_REPORTED.test(s)) return 'N/A'
  return s
}

// ---------------------------------------------------------------------------
// INFO ITEM
// ---------------------------------------------------------------------------

const InfoItem = ({ label, value }) => (
  <div className="detail-overlay-info-item">
    <div className="detail-overlay-info-label">{label}:</div>
    <div className="detail-overlay-info-value">{value}</div>
  </div>
)

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const PatientDetailData = ({ patient }) => {
  const source = appStateManager.getSource()
  const typeLabel = source === DATA_SOURCE.CLINICAL_TRIAL ? 'Clinical Trial Patient' : 'Practice-Based Patient'
  const genderDisplay = patient.gender === GENDER_CODE.MALE ? FILTER_OPTIONS.GENDER.MALE : FILTER_OPTIONS.GENDER.FEMALE

  const column1 = [
    { label: 'Type', value: typeLabel },
    { label: 'Condition', value: displayValue(patient.indication) },
    { label: 'Formulation', value: displayValue(patient.formulation) },
  ]
  const column2 = [
    { label: 'Gender', value: genderDisplay },
    { label: 'Age', value: displayValue(patient.age) },
    { label: 'Race', value: displayValue(patient.race) },
  ]
  const column3 = [
    { label: 'Body Area', value: displayValue(patient.bodyArea) },
    { label: 'Treatments Tried and Failed', value: displayValue(patient.treatmentsTriedAndFailed) },
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
