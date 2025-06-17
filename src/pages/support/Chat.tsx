import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Search,
  Star
} from 'lucide-react';
import { mockChatSessions, ChatSession } from '../../data/supportData';

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(mockChatSessions[0]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = mockChatSessions.filter(chat =>
    chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mockMessages = [
    {
      id: 1,
      content: "Hi, I'm having trouble with my booking. The payment went through but I haven't received any confirmation.",
      sender: 'customer',
      timestamp: '2024-01-15T14:30:00Z',
      avatar: selectedChat?.customer.avatar
    },
    {
      id: 2,
      content: "Hello! I'm sorry to hear about the issue. Let me help you with that. Can you please provide me with your booking reference number?",
      sender: 'support',
      timestamp: '2024-01-15T14:32:00Z',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150'
    },
    {
      id: 3,
      content: "Sure, it's BK12345. I was charged $89 for a Tesla Model 3 rental in San Francisco.",
      sender: 'customer',
      timestamp: '2024-01-15T14:33:00Z',
      avatar: selectedChat?.customer.avatar
    },
    {
      id: 4,
      content: "Thank you for providing that information. I can see your booking in our system. It looks like there was a delay in sending the confirmation email. Let me resend that for you right now.",
      sender: 'support',
      timestamp: '2024-01-15T14:35:00Z',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150'
    },
    {
      id: 5,
      content: "I've just resent your confirmation email. You should receive it within the next few minutes. Your booking is confirmed and the vehicle will be ready for pickup tomorrow at 10 AM.",
      sender: 'support',
      timestamp: '2024-01-15T14:36:00Z',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-card overflow-hidden">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-amber-50 border-amber-400' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={chat.customer.avatar || `https://ui-avatars.com/api/?name=${chat.customer.name}&background=0ea5e9&color=fff`}
                      alt={chat.customer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      chat.customer.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {chat.customer.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {chat.unreadCount > 0 && (
                          <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedChat.customer.avatar || `https://ui-avatars.com/api/?name=${selectedChat.customer.name}&background=0ea5e9&color=fff`}
                    alt={selectedChat.customer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedChat.customer.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.customer.status === 'online' ? 'Online' : 'Last seen 2 hours ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    msg.sender === 'support' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <img
                      src={msg.avatar || `https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        msg.sender === 'support'
                          ? 'bg-amber-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 shadow-card rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'support' ? 'text-amber-100' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;