import loadable from '@loadable/component';
import { BrowserRouter  , Routes , Route , Navigate } from 'react-router-dom';


const Login = loadable(() => import('./pages/Login'));
const SignUp = loadable(() => import('./pages/SignUp'));


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
