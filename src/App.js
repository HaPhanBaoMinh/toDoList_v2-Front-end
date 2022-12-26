import React, { useContext } from 'react'
import Container from './Components/Container'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css"
import LoginPage from './Components/Login-Page/LoginPage';
import AuthContext from './context/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Components/Loading/Loading';

function App() {
  const { Auth } = useContext(AuthContext)
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage exact />}></Route>
          <Route path="/loading" element={<Loading exact />}></Route>
          <Route path="/" element={!Auth.token && !localStorage.getItem('token') ? <Navigate to="/login" /> : <Container />}> </Route>
          <Route path="*" element={<h1>404</h1>}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App