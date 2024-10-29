import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Homepage';
import StudentDetails from './component/StudentDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/details/:id' element={<StudentDetails />} />
      </Routes>
    </Router>
  )
}

export default App;