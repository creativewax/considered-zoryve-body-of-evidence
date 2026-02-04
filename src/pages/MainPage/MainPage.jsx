/**
 * MainPage.jsx
 *
 * Primary application page displaying the 3D carousel with filtering capabilities
 * Combines the filter panel on the left with the main carousel container
 * Manages the overall layout for browsing and filtering evidence items
 */

// #region Imports
import FilterPanel from '../../components/filters/FilterPanel/FilterPanel.jsx'
import MainContainer from '../../views/MainContainer/MainContainer.jsx'
import './MainPage.css'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * MainPage Component
 *
 * Main application page that combines filter controls with the 3D carousel viewer.
 * Provides a two-pane layout with filter options on the side and the main content area.
 *
 * @component
 * @returns {React.ReactElement} Main page with filter panel and carousel container
 */
// #region Component
const MainPage = () => {
  // #region Render
  return (
    <div className="main-page">
      {/* Left sidebar with filtering options (Age, Gender, Condition, Data Source) */}
      <FilterPanel />

      {/* Main content area with 3D carousel and interactive controls */}
      <MainContainer />
    </div>
  )
  // #endregion
}
// #endregion

export default MainPage
