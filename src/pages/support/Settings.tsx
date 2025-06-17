import React, { useState } from 'react';
import { 
  Save, 
  Bell, 
  Mail, 
  Shield, 
  Users, 
  Palette,
  Globe,
  Clock,
  MessageSquare,
  Check
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'AirDrive Support',
      supportEmail: 'support@airdrive.com',
      timezone: 'America/New_York',
      language: 'en',
      autoAssignment: true,
      businessHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'America/New_York'
      }
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newTicketAlert: true,
      ticketUpdaamberert: true,
      dailyDigest: true
    },
    team: {
      maxTicketsPerAgent: 10,
      autoAssignToOnlineAgents: true,
      allowAgentTransfer: true,
      requireApprovalForClosure: false
    },
    appearance: {
      theme: 'light',
      primaryColor: '#00AFA7',
      logoUrl: '',
      favicon: ''
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'team', name: 'Team Settings', icon: Users },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Handle save logic here
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            general: { ...prev.general, siteName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Support Email
        </label>
        <input
          type="email"
          value={settings.general.supportEmail}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            general: { ...prev.general, supportEmail: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, timezone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, language: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Auto-Assignment</h4>
          <p className="text-sm text-gray-600">Automatically assign new tickets to available agents</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.general.autoAssignment}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, autoAssignment: e.target.checked }
            }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Business Hours</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={settings.general.businessHours.start}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { 
                  ...prev.general, 
                  businessHours: { ...prev.general.businessHours, start: e.target.value }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={settings.general.businessHours.end}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { 
                  ...prev.general, 
                  businessHours: { ...prev.general.businessHours, end: e.target.value }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {[
        { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive notifications via email' },
        { key: 'smsNotifications', title: 'SMS Notifications', description: 'Receive notifications via SMS' },
        { key: 'pushNotifications', title: 'Push Notifications', description: 'Receive browser push notifications' },
        { key: 'newTicketAlert', title: 'New Ticket Alerts', description: 'Get notified when new tickets are created' },
        { key: 'ticketUpdaamberert', title: 'Ticket Update Alerts', description: 'Get notified when tickets are updated' },
        { key: 'dailyDigest', title: 'Daily Digest', description: 'Receive daily summary of support activities' },
      ].map((setting) => (
        <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{setting.title}</h4>
            <p className="text-sm text-gray-600">{setting.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications[setting.key as keyof typeof settings.notifications]}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [setting.key]: e.target.checked }
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Tickets Per Agent
        </label>
        <input
          type="number"
          value={settings.team.maxTicketsPerAgent}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            team: { ...prev.team, maxTicketsPerAgent: parseInt(e.target.value) }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          min="1"
          max="50"
        />
        <p className="text-sm text-gray-500 mt-1">Maximum number of active tickets an agent can handle</p>
      </div>

      {[
        { key: 'autoAssignToOnlineAgents', title: 'Auto-assign to Online Agents', description: 'Only assign tickets to agents who are currently online' },
        { key: 'allowAgentTransfer', title: 'Allow Agent Transfer', description: 'Allow agents to transfer tickets to other agents' },
        { key: 'requireApprovalForClosure', title: 'Require Approval for Closure', description: 'Require supervisor approval before closing tickets' },
      ].map((setting) => (
        <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{setting.title}</h4>
            <p className="text-sm text-gray-600">{setting.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.team[setting.key as keyof typeof settings.team] as boolean}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                team: { ...prev.team, [setting.key]: e.target.checked }
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      ))}
    </div>
  );



  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <select
          value={settings.appearance.theme}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, theme: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={settings.appearance.primaryColor}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              appearance: { ...prev.appearance, primaryColor: e.target.value }
            }))}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={settings.appearance.primaryColor}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              appearance: { ...prev.appearance, primaryColor: e.target.value }
            }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo URL
        </label>
        <input
          type="url"
          value={settings.appearance.logoUrl}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, logoUrl: e.target.value }
          }))}
          placeholder="https://example.com/logo.png"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Favicon URL
        </label>
        <input
          type="url"
          value={settings.appearance.favicon}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, favicon: e.target.value }
          }))}
          placeholder="https://example.com/favicon.ico"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your support system preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'team' && renderTeamSettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;