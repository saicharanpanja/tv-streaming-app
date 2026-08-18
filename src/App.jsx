import { Route, Routes } from 'react-router-dom'

import TvPage from './[5] PAGES/TvPage';
import useAutoScrollTop from './[6] UTILS/useAutoScrollTop';

import './App.css';

function App() {
  useAutoScrollTop();
  return (
    <>
      <Routes>
        <Route index element={<TvPage />} />
        <Route path="/tv" element={<TvPage />} />
        <Route path="/tv/:channelKey" element={<TvPage />} />
      </Routes>
    </>
  );
}

export default App;