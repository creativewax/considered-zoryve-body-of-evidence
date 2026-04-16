/**
 * ReferencesModal.jsx
 *
 * References and definitions modal for the Footer.
 * Subclasses Modal with fixed title and references content.
 */

import Modal from './Modal.jsx'
import './ReferencesModal.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ReferencesModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="References &amp; Definitions">
    <div className="references-definitions">
      B-IGA=Body Investigator Global Assessment, BSA=body surface area, IGA=Investigator Global Assessment, I-IGA=Intertriginous Investigator Global Assessment, S-IGA=Scalp Investigator Global Assessment, SI-NRS=Scalp Itch Numeric Rating Scale, vIGA-AD=validated Investigator Global Assessment-Atopic Dermatitis, WI-NRS=Worst Itch Numeric Rating Scale.
    </div>
    <div className="references-source">
      Reference: Data on File. Arcutis Biotherapeutics, Inc.
    </div>
  </Modal>
)

export default ReferencesModal
