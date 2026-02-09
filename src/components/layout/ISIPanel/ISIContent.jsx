/**
 * ISIContent.jsx
 * Important Safety Information and Indications text for the ISI panel.
 * Section titles in Zoryve yellow with title-shape SVG; body 60% white; specific lines full white.
 */

import { ASSETS } from '../../../constants/index.js'
import './ISIContent.css'

const SectionTitle = ({ children }) => (
  <h2 className="isi-content-section-title">
    <img src={ASSETS.ICONS.ISI_TITLE_SHAPE} alt="" className="isi-content-title-shape" />
    <span>{children}</span>
  </h2>
)

export default function ISIContent() {
  return (
    <div className="isi-content">
      <SectionTitle>IMPORTANT SAFETY INFORMATION</SectionTitle>
      <p>ZORYVE is contraindicated in patients with moderate to severe liver impairment (Child-Pugh B or C).</p>
      <p><strong>Flammability:</strong> The propellants in ZORYVE foam are flammable. Avoid fire, flame, and smoking during and immediately following application.</p>
      <p>The most common adverse reactions reported (≥1%) for ZORYVE cream 0.05% for pediatric patients with atopic dermatitis 2 to 5 years of age were upper respiratory tract infection (4.1%), diarrhea (2.5%), vomiting (2.1%), rhinitis (1.6%), conjunctivitis (1.4%), and headache (1.1%).</p>
      <p>The most common adverse reactions reported (≥1%) for ZORYVE cream 0.15% for patients with atopic dermatitis 6 years of age or older were headache (2.9%), nausea (1.9%), application site pain (1.5%), diarrhea (1.5%), and vomiting (1.5%).</p>
      <p>The most common adverse reactions reported (≥1%) for ZORYVE cream 0.3% for plaque psoriasis were diarrhea (3.1%), headache (2.4%), insomnia (1.4%), nausea (1.2%), application site pain (1.0%), upper respiratory tract infection (1.0%), and urinary tract infection (1.0%).</p>
      <p>The most common adverse reactions reported (≥1%) for ZORYVE foam 0.3% for plaque psoriasis were headache (3.1%), diarrhea (2.5%), nausea (1.7%), and nasopharyngitis (1.3%).</p>
      <p>The most common adverse reactions reported (≥1%) for ZORYVE foam 0.3% for seborrheic dermatitis were nasopharyngitis (1.5%), nausea (1.3%), and headache (1.1%).</p>
      <p><strong>Please see full Prescribing Information for ZORYVE cream and full Prescribing Information for ZORYVE foam.</strong></p>

      <SectionTitle>INDICATIONS</SectionTitle>
      <p>ZORYVE cream, 0.05%, is indicated for topical treatment of mild to moderate atopic dermatitis in pediatric patients 2 to 5 years of age.</p>
      <p>ZORYVE cream, 0.15%, is indicated for topical treatment of mild to moderate atopic dermatitis in adult and pediatric patients 6 years of age and older.</p>
      <p>ZORYVE cream, 0.3%, is indicated for topical treatment of plaque psoriasis, including intertriginous areas, in adult and pediatric patients 6 years of age and older.</p>
      <p>ZORYVE topical foam, 0.3%, is indicated for the treatment of plaque psoriasis of the scalp and body in adult and pediatric patients 12 years of age and older.</p>
      <p>ZORYVE topical foam, 0.3%, is indicated for the treatment of seborrheic dermatitis in adult and pediatric patients 9 years of age and older.</p>
    </div>
  )
}
