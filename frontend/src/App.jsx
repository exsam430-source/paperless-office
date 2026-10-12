import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUIStore } from "@store/uiStore";


//Home page
import Home from "./pages/Home";
// Auth Pages
import Login from "../src/pages/auth/Login";
// Departments
import DepartmentsList from "./pages/departments/DepartmentsList";
import CreateDepartment from "./pages/departments/CreateDepartment";

// Layouts
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Users
import UsersList from "./pages/users/UsersList";
import CreateUser from "./pages/users/CreateUser";
import UserProfile from "./pages/users/UserProfile";

// Workflows
import WorkflowList from "./pages/workflows/WorkflowsList";
import CreateWorkflow from "./pages/workflows/CreateWorkflow";


// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
// Dashboard / Reports
import Analytics from "./pages/dashboard/Analytics";
import Reports from "./pages/dashboard/Reports";

// File Pages
import AllFiles from "./pages/files/AllFiles";
import MyFiles from "./pages/files/MyFiles";
import PendingFiles from "./pages/files/PendingFiles";
import CreateFile from "./pages/files/CreateFile";
import EditFile from '@pages/files/EditFile';  // ✅ Add this
import FileDetails from "./pages/files/FileDetails";

// Notification Pages
import Notifications from "./pages/notifications/Notifications";

// Error Pages
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Settings
import Settings from "./pages/settings/Settings";
import Profile from "./pages/settings/Profile";
import Preferences from "./pages/settings/Preferences";

const App = () => {
  const { theme } = useUIStore();

  // Apply theme on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Files */}
        <Route
          path="/files"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AllFiles />
            </ProtectedRoute>
          }
        />
        <Route path="/files/:id" element={<FileDetails />} />
        <Route path="/files/create" element={<CreateFile />} />
        <Route path="/files/:id/edit" element={<EditFile />} />  {/* ✅ Add this */}
        <Route path="/my-files" element={<MyFiles />} />
        <Route path="/pending" element={<PendingFiles />} />

        {/* Notifications */}
        <Route path="/notifications" element={<Notifications />} />

        {/* Placeholder routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DepartmentsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CreateDepartment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflows"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <WorkflowList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflows/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CreateWorkflow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "DIRECTOR", "VC"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "DIRECTOR", "VC"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <div className="text-2xl font-bold">Settings (Coming Soon)</div>
          }
        />
        {/* Settings pages (authenticated users) */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
