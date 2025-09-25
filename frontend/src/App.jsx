
import { useLocation } from 'react-router-dom'
import { userDataContext } from './contexts/UserContext.jsx'
import {useContext } from 'react'
import { Routes,Route } from 'react-router'
import { Navigate } from 'react-router'

import './App.css'
import Register from './pages/Register.jsx'
import User from './pages/User.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Word from './pages/Word.jsx'
import Sentence from './pages/Sentence.jsx'
import Paragraph from './pages/Paragraph.jsx'
import Nav from './components/Nav.jsx'

function App() {
   let {userData} = useContext(userDataContext);
  let location = useLocation();


  return (
    <>
    {userData && <Nav />}
    <Routes>
      <Route path="/login" element={userData ? <Navigate to={location.state?.from || "/"} /> : <Login />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
      <Route path="/word" element={userData ? <Word /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
      <Route path="/sentence" element={userData ? <Sentence /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
      <Route path="/paragraph" element={userData ? <Paragraph/> : <Navigate to="/login" state={{ from: location.pathname }} />} />
      <Route path="/progress" element={userData ? <User/> : <Navigate to="/login" state={{ from: location.pathname }} />} />
      
      <Route path="/register" element={<Register />} />
    </Routes>
    </>
  )
}

export default App
