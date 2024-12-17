import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
