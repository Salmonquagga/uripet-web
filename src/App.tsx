import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/ProtectedRoute";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const MainPage = lazy(() => import("./pages/MainPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AddPetPage = lazy(() => import("./pages/AddPetPage"));
const PetProfilePage = lazy(() => import("./pages/PetProfilePage"));
const EditPetPage = lazy(() => import("./pages/EditPetPage"));
const QrPage = lazy(() => import("./pages/QrPage"));
const PublicPetPage = lazy(() => import("./pages/PublicPetPage"));
const CaregiversPage = lazy(() => import("./pages/CaregiversPage"));
const HealthRecordsPage = lazy(() => import("./pages/HealthRecordsPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PetsPage = lazy(() => import("./pages/PetsPage"));
const VaccinationsPage = lazy(() => import("./pages/VaccinationsPage"));
const MedicalRecordsPage = lazy(() => import("./pages/MedicalRecordsPage"));

function AppLoading() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <p className="eyebrow">UriPet</p>
        <h2>Loading page...</h2>
        <p>Please wait a moment.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          <Route path="/public/pets/:pid" element={<PublicPetPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <PetsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vaccinations"
            element={
              <ProtectedRoute>
                <VaccinationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/medical-records"
            element={
              <ProtectedRoute>
                <MedicalRecordsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-pet"
            element={
              <ProtectedRoute>
                <AddPetPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:pid"
            element={
              <ProtectedRoute>
                <PetProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:pid/edit"
            element={
              <ProtectedRoute>
                <EditPetPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:pid/qr"
            element={
              <ProtectedRoute>
                <QrPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:pid/caregivers"
            element={
              <ProtectedRoute>
                <CaregiversPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:pid/health-records"
            element={
              <ProtectedRoute>
                <HealthRecordsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;