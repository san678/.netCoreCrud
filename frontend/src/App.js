import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ResponsiveAppBar from './components/ResponsiveAppBar';

import AddStudent from './components/AddStudent';
import MarksMgmt from './components/MarksMgmt';
function App() {
  return (
    <div>
      <Router>
        <ResponsiveAppBar/>
        <Routes>
          <Route exact path="/add" element={<AddStudent/>}/>
          <Route exact path="/marks" element={<MarksMgmt/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
