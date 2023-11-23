import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Login from './boundary/login'
import Venues from './boundary/venues'
import CreateVenue from './boundary/create_venue';
import './App.css';

function App() {

  return (
    <BrowserRouter>
        <div>
          <NavLink to="/">Login</NavLink>
          <NavLink to="/venues">----Venues</NavLink>
          <NavLink to="/create-venue">----Create Venue</NavLink>
        </div>
      <Routes id="main-page">
        <Route path="/" element={<Login />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/create-venue" element={<CreateVenue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
