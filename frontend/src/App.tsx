import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetails from './pages/ApplicationDetails';
import Incidents from './pages/Incidents';
import IncidentForm from './pages/IncidentForm';
import Users from './pages/Users';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              
              <Route path="/applications" element={<Applications />} />
              <Route path="/applications/:id" element={<ApplicationDetails />} />
              
              <Route element={<ProtectedRoute roles={['admin', 'operator']} />}>
                <Route path="/applications/new" element={<ApplicationForm />} />
                <Route path="/applications/:id/edit" element={<ApplicationForm />} />
                
                <Route path="/incidents/new" element={<IncidentForm />} />
                <Route path="/incidents/:id/edit" element={<IncidentForm />} />
              </Route>

              <Route path="/incidents" element={<Incidents />} />
              
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;