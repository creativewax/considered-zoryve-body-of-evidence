/**
 * FitzpatrickSkinType.jsx
 *
 * Displays Fitzpatrick skin type classification
 * Features: Label and colored type indicator (I-VI)
 */

import './FitzpatrickSkinType.css'

// Skin type color and text color mapping
const SKIN_TYPE_STYLES = {
  'I': { background: '#F8D1B2', color: 'var(--colour-zoryve-black)' },
  'II': { background: '#EBB58F', color: 'var(--colour-zoryve-black)' },
  'III': { background: '#D0A07C', color: 'var(--colour-zoryve-black)' },
  'IV': { background: '#BD7851', color: 'var(--colour-white)' },
  'V': { background: '#904A3E', color: 'var(--colour-white)' },
  'VI': { background: '#3C1F1B', color: 'var(--colour-white)' },
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * FitzpatrickSkinType Component
 *
 * @param {string} type - Skin type (I-VI)
 */
const FitzpatrickSkinType = ({ type }) => {
  const styles = SKIN_TYPE_STYLES[type] || SKIN_TYPE_STYLES['I']

  return (
    <div className="fitzpatrick-skin-type">
      <div className="fitzpatrick-label">
        <div>Fitzpatrick</div>
        <div>Skin Type</div>
      </div>
      <div
        className="fitzpatrick-type"
        style={{
          backgroundColor: styles.background,
          color: styles.color
        }}
      >
        Type {type}
      </div>
    </div>
  )
}

export default FitzpatrickSkinType
