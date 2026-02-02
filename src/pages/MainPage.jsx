import FilterPanel from '../components/FilterPanel/FilterPanel.jsx'
import MainContainer from '../components/MainContainer/MainContainer.jsx'
import './MainPage.css'

const MainPage = () => {
  return (
    <div className="main-page">
      <FilterPanel />
      <MainContainer />
    </div>
  )
}

export default MainPage
