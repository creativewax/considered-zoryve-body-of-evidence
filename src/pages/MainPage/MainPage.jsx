/**
 * MainPage.jsx
 *
 * Two-pane layout: filter panel on the left, 3D carousel on the right.
 */

import FilterPanel from '../../components/filters/FilterPanel/FilterPanel.jsx'
import MainContainer from '../../views/MainContainer/MainContainer.jsx'
import './MainPage.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const MainPage = () => {
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="main-page">
      <FilterPanel />
      <MainContainer />
    </div>
  )
}

export default MainPage
