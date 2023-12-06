import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Login from './boundary/login'
import Venues from './boundary/venues'
import CreateVenue from './boundary/create_venue';
import VenueView from './boundary/venue-view';
import CreateShow from './boundary/create_show';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes id="main-page">
        <Route path="/" element={<Login />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/create-venue" element={<CreateVenue />} />
        <Route path="/venue-view" element={<VenueView />} />
        <Route path="/create-show" element={<CreateShow />} />
        <Route path="/edit-blocks" element={<EditBlocks/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
