/// 페이지 사이의 이동(Navigate)을 여기에서 정의

import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import "./styles/App.css"

// import Login from "./pages/Login"
// import Register from "./pages/Register"
//import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
