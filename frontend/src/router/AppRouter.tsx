import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PetsPage } from '../pages/PetsPage';
import { CitasPage } from '../pages/CitasPage';
import { MascotaDetallePage } from '../pages/MascotaDetallePage';
import { ListaEsperaPage } from '../pages/ListaEsperaPage';
import { useAuth } from '../context/AuthContext';

export const AppRouter = () => {
  const { user } = useAuth();

  const isAuth = !!user;

  return (
    <Routes>
      {/* raíz: redirige según si está logueado o no */}
      <Route
        path="/"
        element={
          isAuth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Auth */}
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/register"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={isAuth ? <DashboardPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/mascotas"
        element={isAuth ? <PetsPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/mascotas/:id"
        element={isAuth ? <MascotaDetallePage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/citas"
        element={isAuth ? <CitasPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/lista-espera"
        element={isAuth ? <ListaEsperaPage /> : <Navigate to="/login" replace />}
      />

      {/* Comodín: cualquier otra ruta */}
      <Route
        path="*"
        element={
          isAuth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
