import { Route, Routes } from 'react-router-dom'

import TvPage from './[5] PAGES/TvPage'

import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route index element={<TvPage />} />
        <Route path="/tv" element={<TvPage />} />
      </Routes>
    </>
  )
}

export default App
