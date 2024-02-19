import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Fixed_Page_List_Products from "./pages/Fixed_Page_List_Products";
import Fixed_Page_Commit_Leadtime from "./pages/Fixed_Page_Commit_Leadtime";
import Fixed_Page_Upload_Master from "./pages/Fixed_Page_Upload_Master";
import Fixed_Page_List_Products_Routing from "./pages/Fixed_Page_List_Products_Routing";

export default function App() {
  
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Navbar />} />
              <Route path="/fixed_page_list_products" element={<Fixed_Page_List_Products />}/>
              <Route path="/fixed_page_commit_leadtime" element={<Fixed_Page_Commit_Leadtime />}/>
              <Route path="/fixed_page_upload_master" element={<Fixed_Page_Upload_Master />}/>
              <Route path="/fixed_page_list_products_routing" element={<Fixed_Page_List_Products_Routing />}/>
            </Route>
        </Routes>
  );
}
