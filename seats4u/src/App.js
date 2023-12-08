import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './boundary/login'
import Venues from './boundary/venues'
import CreateVenue from './boundary/create_venue';
import VenueView from './boundary/venue-view';
import VenueViewConsumer from './boundary/venue-view-consumer';
import CreateShow from './boundary/create_show';
import EditBlocks from './boundary/edit_blocks';
import { Model } from './model/model'
import './App.css';
import ShowReport from './boundary/show_report';

let model = new Model();

export function getModel() {
  return model;
}




function App() {

  return (
    <BrowserRouter>
      <Routes id="main-page">
        <Route path="/" element={<Login />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/create-venue" element={<CreateVenue />} />
        <Route path="/venue-view" element={<VenueView />} />
        <Route path="/venue-view-consumer" element={<VenueViewConsumer />} />
        <Route path="/create-show" element={<CreateShow />} />
        <Route path="/edit-blocks" element={<EditBlocks/>} />
        <Route path="/show-report" element={<ShowReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
