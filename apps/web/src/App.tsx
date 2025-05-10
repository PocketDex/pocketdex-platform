import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WatchStream from './pages/watch/[roomID]';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/watch/:roomId" element={<WatchStream />} />
        {/* Optionally add a home route here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
