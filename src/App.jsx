import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommonLayout from './layouts/CommonLayout'
import Homepage from "./pages/common/Homepage";
import { Login } from "./pages/common/Login";
import { Signup } from "./pages/common/Signup";
import { About } from "./pages/common/About";
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route element={<CommonLayout />}>
            <Route index path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
