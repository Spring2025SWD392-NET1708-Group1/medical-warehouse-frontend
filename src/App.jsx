import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommonLayout from './layouts/CommonLayout'
import Homepage from "./pages/common/Homepage";
import { Login } from "./pages/common/Login";
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route element={<CommonLayout />}>
            <Route index path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/sign-up" element={<SignUp />} /> */}
            {/* <Route path="/about" element={<AboutUsPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
