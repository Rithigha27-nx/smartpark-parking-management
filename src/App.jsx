import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import VehicleEntryPage from './pages/VehicleEntryPage';
import VehicleExitPage from './pages/VehicleExitPage';
import ParkingLayoutPage from './pages/ParkingLayoutPage';
import WaitingQueuePage from './pages/WaitingQueuePage';
import VehicleRecordsPage from './pages/VehicleRecordsPage';
import ReportsPage from './pages/ReportsPage';
import DSAInsightsPage from './pages/DSAInsightsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="entry" element={<VehicleEntryPage />} />
            <Route path="exit" element={<VehicleExitPage />} />
            <Route path="layout" element={<ParkingLayoutPage />} />
            <Route path="queue" element={<WaitingQueuePage />} />
            <Route path="records" element={<VehicleRecordsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="dsa" element={<DSAInsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}
