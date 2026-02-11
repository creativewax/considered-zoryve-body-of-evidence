/**
 * PatientDetailDataPracticeBased.jsx
 *
 * Renders patient info for Practice-Based patients
 * Shows: indication, formulation, gender, age, treatments tried and failed, body area
 */

import { FILTER_OPTIONS, GENDER_CODE } from '../../../../constants/index.js'
import './PatientDetailDataPracticeBased.css'

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
  <div className="patient-detail-pb-item">
    <div className="patient-detail-pb-label">{label}:</div>
    <div className="patient-detail-pb-value">{value}</div>
  </div>
)

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const PatientDetailDataPracticeBased = ({ patient }) => {
  const genderDisplay = patient.gender === GENDER_CODE.MALE ? FILTER_OPTIONS.GENDER.MALE : FILTER_OPTIONS.GENDER.FEMALE

  const column1 = [
    { label: 'Indication', value: displayValue(patient.condition) },
    { label: 'Formulation', value: displayValue(patient.formulation) },
    { label: 'Gender', value: genderDisplay },
  ]

  const column2 = [
    { label: 'Age', value: displayValue(patient.age) },
    { label: 'Body Area', value: displayValue(patient.bodyArea) },
    { label: 'Treatments Tried and Failed', value: displayValue(patient.treatmentsTriedAndFailed) },
  ]

  return (
    <div className="patient-detail-pb">
      <div className="patient-detail-pb-column">
        {column1.map(({ label, value }) => (
          <InfoItem key={label} label={label} value={value} />
        ))}
      </div>
      <div className="patient-detail-pb-column">
        {column2.map(({ label, value }) => (
          <InfoItem key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  )
}

export default PatientDetailDataPracticeBased
