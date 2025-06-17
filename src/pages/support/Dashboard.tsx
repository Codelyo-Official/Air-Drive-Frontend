import React from 'react';
import { 
  Ticket, 
  MessageCircle, 
  Users, 
  Car, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockAnalytics, mockTickets, mockChatSessions } from '../../data/supportData';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Open Tickets',
      value: mockAnalytics.ticketStats.open.toString(),
      icon: Ticket,
      color: 'bg-blue-500',
      change: '+2.1%',
      changeType: 'increase'
    },
    {
      name: 'Active Chats',
      value: mockChatSessions.filter(c => c.status === 'active').length.toString(),
      icon: MessageCircle,
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      name: 'Avg Resolution Time',
      value: mockAnalytics.ticketStats.avgResolutionTime,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-8.2%',
      changeType: 'decrease'
    },
    {
      name: 'Satisfaction Rate',
      value: `${mockAnalytics.ticketStats.satisfactionRate}%`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      change: '+1.2%',
      changeType: 'increase'
    }
  ];

  const priorityTickets = mockTickets.filter(t => t.priority === 'urgent' || t.priority === 'high');
  const recentActivity = [
    {
      id: 1,
      type: 'ticket_created',
      message: 'New ticket created by Sarah Johnson',
      time: '2 minutes ago',
      icon: Ticket,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'chat_started',
      message: 'Chat session started with David Chen',
      time: '5 minutes ago',
      icon: MessageCircle,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'ticket_resolved',
      message: 'Ticket #T003 resolved by Lisa Park',
      time: '12 minutes ago',
      icon: CheckCircle,
      color: 'text-amber-500'
    },
    {
      id: 4,
      type: 'high_priority',
      message: 'High priority ticket requires attention',
      time: '18 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Mike! Here's what's happening with customer support today.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg p-6 shadow-card hover:shadow-hover transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last week</span>
                  </div>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Tickets */}
        <div className="bg-white rounded-lg shadow-card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Priority Tickets</h3>
            <p className="text-sm text-gray-600">Tickets requiring immediate attention</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {priorityTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    ticket.priority === 'urgent' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                    <p className="text-sm text-gray-600">{ticket.customer.name}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">Latest support activities</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`${activity.color} mt-1`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div className="text-center">
                <Ticket className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Create New Ticket</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div className="text-center">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Manage Users</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div className="text-center">
                <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Review Vehicles</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;