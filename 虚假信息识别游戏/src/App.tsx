import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import InvestigationPage from './pages/InvestigationPage'
import EndingPage from './pages/EndingPage'
import EndingClearPage from './pages/EndingClearPage'
import EndingTruthPage from './pages/EndingTruthPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/investigation" element={<InvestigationPage />} />
          <Route path="/ending" element={<EndingPage />} />
          <Route path="/ending-clear" element={<EndingClearPage />} />
          <Route path="/ending-truth" element={<EndingTruthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
