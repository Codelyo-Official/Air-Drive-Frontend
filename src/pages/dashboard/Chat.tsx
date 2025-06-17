import type React from "react"

import { useState } from "react"
import type { Message, Conversation } from "../../types"

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Alice Johnson",
      message: "Hi, I'm interested in renting the Tesla Model 3. Is it available for next weekend?",
      time: "10:30 AM",
      avatar: "https://img.freepik.com/free-vector/blond-man-character-icon-isolated_18591-83007.jpg?ga=GA1.1.60525944.1740324934&semt=ais_items_boosted&w=740",
      isCustomer: true,
    },
    {
      id: 2,
      sender: "You",
      message:
        "Hello Alice! Yes, the Tesla Model 3 is available for next weekend. Would you like me to check the exact dates and pricing for you?",
      time: "10:32 AM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isCustomer: false,
    },
    {
      id: 3,
      sender: "Alice Johnson",
      message: "Perfect! I need it from Friday evening to Sunday evening. What would be the total cost?",
      time: "10:35 AM",
      avatar: "https://img.freepik.com/free-vector/blond-man-character-icon-isolated_18591-83007.jpg?ga=GA1.1.60525944.1740324934&semt=ais_items_boosted&w=740",
      isCustomer: true,
    },
  ])

  const [newMessage, setNewMessage] = useState<string>("")
  const [selectedChat, setSelectedChat] = useState<number>(0)

  const conversations: Conversation[] = [
    {
      id: 0,
      name: "Alice Johnson",
      lastMessage: "Perfect! I need it from Friday evening...",
      time: "10:35 AM",
      unread: 2,
      avatar: "https://img.freepik.com/free-vector/blond-man-character-icon-isolated_18591-83007.jpg?ga=GA1.1.60525944.1740324934&semt=ais_items_boosted&w=740",
      status: "online",
    },
    {
      id: 1,
      name: "Bob Smith",
      lastMessage: "Thank you for the great service!",
      time: "9:15 AM",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      status: "offline",
    },
    {
      id: 2,
      name: "Carol Davis",
      lastMessage: "Is the BMW X5 still available?",
      time: "Yesterday",
      unread: 1,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      status: "online",
    },
    {
      id: 3,
      name: "David Wilson",
      lastMessage: "I'll pick up the car tomorrow",
      time: "Yesterday",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      status: "offline",
    },
  ]

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isCustomer: false,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleMenuClick = (conversationId: number): void => {
    setSelectedChat(conversationId)
  }

  return (
    <div className="p-4 sm:p-6 lg:ml-0 ml-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 pt-12 lg:pt-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Communicate with your customers</p>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden h-[500px] sm:h-[600px]">
        <div className="flex h-full">
          {/* Chat List */}
          <div className="w-full sm:w-1/3 border-r border-gray-200 flex flex-col sm:block hidden sm:flex">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleMenuClick(conversation.id)}
                  className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === conversation.id ? "bg-amber-50 border-amber-400" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar || "/placeholder.svg?height=48&width=48"}
                        alt={conversation.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          conversation.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col w-full sm:w-2/3">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={conversations[selectedChat].avatar || "/placeholder.svg?height=40&width=40"}
                    alt={conversations[selectedChat].name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {conversations[selectedChat].name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {conversations[selectedChat].status === "online" ? "Online" : "Last seen 2 hours ago"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isCustomer ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`flex items-end space-x-2 max-w-xs sm:max-w-sm lg:max-w-md ${
                      message.isCustomer ? "flex-row" : "flex-row-reverse space-x-reverse"
                    }`}
                  >
                    <img
                      src={message.avatar || "/placeholder.svg?height=32&width=32"}
                      alt={message.sender}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                    <div
                      className={`px-3 sm:px-4 py-2 rounded-lg ${
                        message.isCustomer ? "bg-gray-100 text-gray-900" : "bg-amber-500 text-white"
                      }`}
                    >
                      <p className="text-xs sm:text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${message.isCustomer ? "text-gray-500" : "text-amber-100"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <button type="button" className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
