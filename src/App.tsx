import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/layout/home'
import SearchResults from './components/layout/search-results'
import AuctionDetail from './components/layout/auction-detail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Routes>
    </Router>
  )
}

export default App
