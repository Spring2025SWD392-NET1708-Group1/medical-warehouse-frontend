import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommonLayout from './layouts/CommonLayout'
import Homepage from "./pages/common/Homepage";
import { Login } from "./pages/common/Login";
import { Signup } from "./pages/common/Signup";
import { About } from "./pages/common/About";
import { ForgotPassword } from "./pages/common/ForgotPassword";
import { UpdatePassword } from "./pages/common/UpdatePassword";
import MedicalItemList from "./pages/common/MedicalItemList";
import StaffDashboard from "./pages/common/StaffDashboard";
import ManagerDashboard from "./pages/common/ManagerDasboard";
import TrackInventoryMovement from "./pages/common/TrackInventoryMovement";
import AdminDashBoard from "./pages/common/AdminDashboard";
import { AdminLayout } from "./layouts/AdminLayout";
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
            <Route path="/forgot-password" element={<ForgotPassword />} ></Route>
            <Route path="/update-password" element={<UpdatePassword />} ></Route>
            <Route path="/item" element={<MedicalItemList />} ></Route>
            <Route path="/admin" element={<AdminDashBoard />} ></Route>
            <Route path="/staff" element={<StaffDashboard />} ></Route>
            <Route path="/manager" element={<ManagerDashboard />} ></Route>
            <Route path="/track-inventory" element={<TrackInventoryMovement />} ></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
