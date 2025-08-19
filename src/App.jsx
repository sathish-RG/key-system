import React from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "./redux/features/auth/authSlice";

// Import All Page Components
import AdminCourses from "./admin/AdminCourses";
import AdminChapter from "./admin/AdminChapter";
import MemberDashboard from "./member/MemberDashboard";
import Courses from "./pages/Courses"; // Public/Member list of all courses
import Chapters from "./pages/Chapters"; // Public/Member list of a course's chapters
import Chapter from "./pages/Chapter"; // Public/Member view a specific chapter
import AdminDashboard from "./admin/AdminDashboard";
import { SidebarProvider } from "./context/SidebarContext";
import AdminMembers from "./admin/AdminMembers";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return (
    
    <BrowserRouter>
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-[#f2f2f3]">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            {/* --- Core & Auth Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* --- Member Routes --- */}
            <Route path="/member" element={<MemberDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<Chapters />} />
            <Route path="/courses/:courseId/chapters/:chapterId" element={<Chapter />} />
            
            {/* --- Admin Routes --- */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/courses/:courseId/chapters" element={<AdminChapter />} />

          </Routes>
        </main>
        <Footer />
      </div>
      </SidebarProvider>
    </BrowserRouter>
    
  );
};

export default App;