import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare,
  X,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useSupport } from '../api/support';
// import { useSupport } from './api/supportManagement';

interface TicketConversationProps {
  ticket: any;
  onBack: () => void;
}

const TicketConversation: React.FC<TicketConversationProps> = ({ ticket, onBack }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const { addReply, useTicketReplies } = useSupport();
  
  const { data: replies, isLoading: repliesLoading } = useTicketReplies(ticket.id);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    
    try {
      await addReply.mutateAsync({
        ticketId: ticket.id,
        payload: { message: replyMessage }
      });
      setReplyMessage('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </button>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
            {getStatusIcon(ticket.status)}
            <span className="ml-2">{ticket.status.replace('_', ' ').toUpperCase()}</span>
          </span>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Ticket #{ticket.id}
          </h2>
          <p className="text-gray-600 mt-1">{ticket.subject}</p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Clock className="w-4 h-4 mr-1" />
            Created: {new Date(ticket.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-col h-96">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {repliesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-amber-500" />
              <span className="ml-2 text-gray-600">Loading conversation...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {replies?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No replies yet. Start the conversation!</p>
                </div>
              ) : (
                replies?.map((reply, index) => {
                //   const isUserMessage = reply.author !== 'support' && !reply.author.startsWith('support_');
                const isUserMessage = true

                  return (
                    <div
                      key={reply.id || index}
                      className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-lg ${
                        isUserMessage 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      } rounded-lg px-4 py-3`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {isUserMessage ? 'You' : 'Support'}
                          </span>
                          <span className={`text-xs ${
                            isUserMessage ? 'text-amber-100' : 'text-gray-500'
                          }`}>
                            {new Date(reply.timestamp || reply.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{reply.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Reply Input */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSendReply}
              disabled={!replyMessage.trim() || addReply.isPending}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {addReply.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

const UserSupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });
  
  const { useUserTickets, createTicket } = useSupport();
  const { data: tickets, isLoading } = useUserTickets();

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id?.toString().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;
    
    try {
      await createTicket.mutateAsync(newTicket);
      setNewTicket({ subject: '', message: '' });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
        <span className="ml-3 text-gray-600">Loading your tickets...</span>
      </div>
    );
  }

  // Show conversation view if ticket is selected
  if (selectedTicket) {
    return (
      <TicketConversation 
        ticket={selectedTicket} 
        onBack={() => setSelectedTicket(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-gray-600 mt-1">View and manage your support requests</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: tickets?.length || 0, color: 'bg-blue-500' },
          { label: 'Open', value: tickets?.filter(t => t.status === 'open').length || 0, color: 'bg-yellow-500' },
          { label: 'In Progress', value: tickets?.filter(t => t.status === 'in_progress').length || 0, color: 'bg-orange-500' },
          { label: 'Resolved', value: tickets?.filter(t => t.status === 'resolved').length || 0, color: 'bg-green-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-2 mr-3`}>
                <div className="w-4 h-4 text-white">
                  {getStatusIcon(index === 1 ? 'open' : index === 2 ? 'in_progress' : index === 3 ? 'resolved' : 'total')}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Tickets ({filteredTickets.length})
          </h3>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">
              {tickets?.length === 0 ? "No tickets yet" : "No tickets found"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {tickets?.length === 0 
                ? "Create your first support ticket to get help" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {tickets?.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Ticket #{ticket.id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1">{ticket.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {ticket.subject}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Conversation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Support Ticket</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="Please describe your issue in detail..."
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.subject.trim() || !newTicket.message.trim() || createTicket.isPending}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {createTicket.isPending ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSupportPage;