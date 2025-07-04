import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { adminSettingsApi, AdminSetting } from '@/store/adminSettings';

const SystemSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const adminSettings = useSelector((state: RootState) => state.adminSettings.list) as AdminSetting[];
  const adminSettingsLoading = useSelector((state: RootState) => state.adminSettings.isLoading);
  const [settingsForm, setSettingsForm] = useState({
    roi_percent: '',
    bonus_percent_per_level: '',
    maintenance_mode: 'off',
  });

  useEffect(() => {
    dispatch(adminSettingsApi.get());
  }, [dispatch]);

  useEffect(() => {
    if (adminSettings && adminSettings.length > 0) {
      const map: any = {};
      adminSettings.forEach(s => { map[s.key] = s.value; });
      setSettingsForm({
        roi_percent: map['roi_percent'] || '',
        bonus_percent_per_level: map['bonus_percent_per_level'] || '',
        maintenance_mode: map['maintenance_mode'] || 'off',
      });
    }
  }, [adminSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettingsForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'on' : 'off') : value,
    }));
  };

  const handleSave = async () => {
    for (const key of Object.keys(settingsForm)) {
      const setting = adminSettings.find(s => s.key === key);
      if (setting && setting.value !== settingsForm[key]) {
        await dispatch(adminSettingsApi.put({ ...setting, value: settingsForm[key] }));
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded shadow p-6 w-[90%] min-w-[900px]">
        <div className="mb-4 text-lg font-semibold text-green-700">System Settings</div>
        {adminSettingsLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <form className="space-y-6">
            <div className="flex items-center gap-6">
              <label className="w-48 font-medium">ROI %</label>
              <input
                type="number"
                name="roi_percent"
                value={settingsForm.roi_percent}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-40"
                min={0}
                step={0.01}
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="w-48 font-medium">Bonus % per Level</label>
              <input
                type="text"
                name="bonus_percent_per_level"
                value={settingsForm.bonus_percent_per_level}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-64"
                placeholder="e.g. 5,3,2,1,1"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="w-48 font-medium">Maintenance Mode</label>
              <input
                type="checkbox"
                name="maintenance_mode"
                checked={settingsForm.maintenance_mode === 'on'}
                onChange={handleChange}
                className="h-5 w-5"
              />
              <span className="text-gray-500 text-sm">{settingsForm.maintenance_mode === 'on' ? 'ON (users cannot buy/stake/register)' : 'OFF (system fully open)'}</span>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSave}
              >Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SystemSettings; 