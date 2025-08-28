import { Route, Routes } from 'react-router-dom'

import ScrollToTop from './[6] UTILS/ScrollToTop'
import TvPage from './[5] PAGES/TvPage'

import './App.css'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route index element={<TvPage />} />
        <Route path="/tv" element={<TvPage />} />
        <Route path="/tv/:channelKey" element={<TvPage />} />
      </Routes>
    </>
  );
}

export default App
