import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Reservations from "./components/Reservations";
import SamplePage from "./components/SamplePage";
import Reserve from "./components/Reserve";
import ReserveTable from "./components/ReserveTable";
import Login from "./components/Login";
import Debug from "./components/Debug";

import './styles/global.css';
import Order from "./components/Order";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/debug/:collectionKey" element={<Debug />} />
        <Route path="/login/:collectionKey" element={<Login />} />
        <Route path="/reserve/:collectionKey/:mode" element={<Reserve />} />
        <Route path="/reservations/:collectionKey" element={<Reservations />} />
        <Route path="/order/:collectionKey/:selectedDate/:reservationId" element={<Order/>} />
        <Route path="/reserve/:collectionKey/:reservationDate/:reservationStartTimeIndex/:reservationEndTimeIndex/:tableNumber" element={<ReserveTable/>} />
        <Route path="/reserve/:collectionKey/vr" element={<SamplePage redirectToSample={false} modelPath="https://giannismparous.github.io/test_vr/"/>} /> 
      </Routes>
    </div>
  );
}

export default App;
