import React from 'react';
import HomePage from './pages/Home';
import BowlOfFishPage from './pages/BowlOfFish';
// import EducationPage from './pages/EducationPage';
import { Route, Routes } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route exact={true} path="/" element={<HomePage />}></Route>
          <Route exact={true} path="/BowlOfFish" element={<BowlOfFishPage />}></Route>
        </Routes>
      </div>
    );
  }
}


export default App;
