import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import Layout from "@/components/Layout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import StudentSchedule from "./pages/student/Schedule";
import StudentProfile from "./pages/student/Profile";

// Teacher pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherStudents from "./pages/teacher/Students";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminStudents from "./pages/admin/Students";
import AdminTeachers from "./pages/admin/Teachers";
import AddUser from "./pages/admin/AddUser";
import CreateCourse from "./pages/admin/CreateCourse";

// Course pages
import CourseDetail from "./pages/course/CourseDetail";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "teacher") {
      return <Navigate to="/teacher" replace />;
    }
    if (user.role === "student") {
      return <Navigate to="/student" replace />;
    }
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CourseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={<Index />} 
              />
              <Route 
                path="/login" 
                element={<Login />} 
              />
              <Route 
                path="/signup" 
                element={<SignUp />} 
              />
              
              {/* Student routes */}
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Layout>
                      <StudentDashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/courses" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Layout>
                      <StudentCourses />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/schedule" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Layout>
                      <StudentSchedule />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/profile" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Layout>
                      <StudentProfile />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Teacher routes */}
              <Route 
                path="/teacher" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <Layout>
                      <TeacherDashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/courses" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <Layout>
                      <TeacherCourses />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/students" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <Layout>
                      <TeacherStudents />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/courses" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminCourses />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/students" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminStudents />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/teachers" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminTeachers />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/add-user" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AddUser />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/create-course" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <CreateCourse />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Shared routes */}
              <Route 
                path="/course/:courseId" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CourseDetail />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CourseProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
