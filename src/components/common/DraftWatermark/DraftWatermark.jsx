/**
 * DraftWatermark.jsx
 * Diagonal "DRAFT" watermark overlay.
 * Remove this component when deploying to production.
 */

import './DraftWatermark.css'

export default function DraftWatermark() {
  return (
    <div className="draft-watermark">
      <span className="draft-watermark-text">DRAFT</span>
    </div>
  )
}
