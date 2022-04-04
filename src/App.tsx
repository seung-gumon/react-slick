import React from 'react';
import { BrowserRouter  , Routes , Route , Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate replace to="/login"/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
