import React from 'react';
import HomePage from './pages/HomePage';
import CodingPage from './pages/CodingPage';
import EducationPage from './pages/EducationPage';
import { Route, Routes } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route exact={true} path="/" element={<HomePage />}></Route>
          <Route exact={true} path="/coding" element={<CodingPage />}></Route>
          <Route exact={true} path="/education" element={<EducationPage />}></Route>
        </Routes>
      </div>
    );
  }
}


export default App;
