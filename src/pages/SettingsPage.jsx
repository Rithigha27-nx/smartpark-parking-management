import React, { useState } from 'react';
import {
  Settings,
  Building2,
  DollarSign,
  User,
  Database,
  RotateCcw,
  Sparkles,
  Save,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export default function SettingsPage() {
  const { settings, setSettings, loadDemoData, resetToEmpty, addNotification } = useParking();

  const [formSettings, setFormSettings] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRateChange = (vehicleType, value) => {
    setFormSettings((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        hourlyRates: {
          ...prev.rates.hourlyRates,
          [vehicleType]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formSettings);
    setSavedSuccess(true);
    addNotification('System configuration parameters successfully saved.', 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          Facility Administration & Tariff Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure commercial tariff schedules, operational shift parameters, and memory state
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Facility Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Facility Identification</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Facility Name</label>
              <input
                type="text"
                value={formSettings.facilityName}
                onChange={(e) => handleInputChange('facilityName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Facility Code / ID</label>
              <input
                type="text"
                value={formSettings.facilityCode}
                onChange={(e) => handleInputChange('facilityCode', e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tariff & Billing Rates */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              Hourly Tariff Schedule & Grace Period
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Standard Car Rate ($/hr)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formSettings.rates.hourlyRates.Car}
                onChange={(e) => handleRateChange('Car', e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">SUV / Van Rate ($/hr)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formSettings.rates.hourlyRates.SUV}
                onChange={(e) => handleRateChange('SUV', e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Motorbike Rate ($/hr)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formSettings.rates.hourlyRates.Bike}
                onChange={(e) => handleRateChange('Bike', e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Free Grace Period (Minutes)
              </label>
              <input
                type="number"
                min="0"
                value={formSettings.rates.gracePeriodMinutes}
                onChange={(e) =>
                  setFormSettings((prev) => ({
                    ...prev,
                    rates: { ...prev.rates, gracePeriodMinutes: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Exits within this window incur $0.00 fee
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Minimum Billable Fee ($)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formSettings.rates.minimumFee}
                onChange={(e) =>
                  setFormSettings((prev) => ({
                    ...prev,
                    rates: { ...prev.rates, minimumFee: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operator Shift Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <User className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">Current Shift Operator</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Operator Name</label>
              <input
                type="text"
                value={formSettings.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Designation / Role</label>
              <input
                type="text"
                value={formSettings.operatorRole}
                onChange={(e) => handleInputChange('operatorRole', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Shift Hours</label>
              <input
                type="text"
                value={formSettings.shift}
                onChange={(e) => handleInputChange('shift', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Settings successfully updated!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Save Settings</span>
          </button>
        </div>
      </form>

      {/* Section 4: Data State & Demo Reset Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Database className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            Memory Data & Simulation State Controls
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          Reset state or load realistic demo vehicles to test Min-Heap allocation, Hash Table lookup, and Circular Queue overflow behaviors.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={loadDemoData}
            className="w-full sm:w-auto py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Load Demo Operational Data (16 Parked, 3 Queued, 7 Txns)</span>
          </button>

          <button
            type="button"
            onClick={resetToEmpty}
            className="w-full sm:w-auto py-2.5 px-4 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Bays to Empty State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
