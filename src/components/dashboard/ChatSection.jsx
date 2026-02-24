import { useState, useRef, useEffect } from "react";
import { chatContacts, chatMessages } from "../../data/dashboardData";
import {
  Search,
  Send,
  MessageSquare,
  Circle,
  Users,
  User,
  ArrowLeft,
} from "lucide-react";

const ChatSection = () => {
  const [activeContact, setActiveContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const messagesEndRef = useRef(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const filteredContacts = chatContacts.filter((c) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "teachers" && c.type === "teacher") ||
      (activeTab === "groups" && c.type === "group");
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeContactData = chatContacts.find((c) => c.id === activeContact);
  const activeMessages = messages.filter((m) => m.contactId === activeContact);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  const handleSend = () => {
    if (!messageInput.trim() || !activeContact) return;
    const newMsg = {
      id: messages.length + 1,
      contactId: activeContact,
      sender: "student",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      date: "Today",
    };
    setMessages([...messages, newMsg]);
    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectContact = (id) => {
    setActiveContact(id);
    setMobileShowChat(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Messages</h1>
        <p className="text-sm text-slate-500">Chat with teachers and study groups</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200 shadow-sm flex" style={{ height: "calc(100vh - 240px)", minHeight: "480px" }}>
        {/* Contact List */}
        <div className={`w-full lg:w-80 border-r border-slate-200 flex flex-col shrink-0 ${mobileShowChat ? "hidden lg:flex" : "flex"}`}>
          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 text-sm py-2"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[
              { key: "all", label: "All" },
              { key: "teachers", label: "Teachers" },
              { key: "groups", label: "Groups" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab.key
                    ? "text-slate-900 border-b-2 border-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare size={24} className="text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No conversations found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => selectContact(contact.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-slate-50 ${
                    activeContact === contact.id
                      ? "bg-slate-50"
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-sm flex items-center justify-center text-xs font-bold">
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <Circle size={8} fill="#22c55e" className="text-green-500 absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-slate-800 truncate">{contact.name}</p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{contact.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 ml-2">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    {contact.type === "group" && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users size={10} className="text-slate-300" />
                        <span className="text-[10px] text-slate-300">{contact.members} members</span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${mobileShowChat ? "flex" : "hidden lg:flex"}`}>
          {activeContactData ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 shrink-0">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="lg:hidden text-slate-500 hover:text-slate-800 shrink-0"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-9 h-9 bg-slate-900 text-white rounded-sm flex items-center justify-center text-xs font-bold shrink-0">
                  {activeContactData.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{activeContactData.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Circle
                      size={6}
                      fill={activeContactData.online ? "#22c55e" : "#cbd5e1"}
                      className={activeContactData.online ? "text-green-500" : "text-slate-300"}
                    />
                    <span className="text-[10px] text-slate-400">
                      {activeContactData.online ? "Online" : "Offline"}
                      {activeContactData.type === "group" && ` · ${activeContactData.members} members`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {activeMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare size={28} className="text-slate-200 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  activeMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] sm:max-w-[65%]`}>
                        {msg.sender === "other" && msg.senderName && (
                          <p className="text-[10px] font-semibold text-indigo-600 mb-0.5 ml-1">{msg.senderName}</p>
                        )}
                        <div
                          className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                            msg.sender === "student"
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <p className={`text-[10px] text-slate-400 mt-1 ${
                          msg.sender === "student" ? "text-right mr-1" : "ml-1"
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 p-3 sm:p-4 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input flex-1 text-sm py-2.5"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className={`btn-primary p-2.5 shrink-0 ${
                      !messageInput.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-400">Select a conversation</p>
                <p className="text-xs text-slate-300 mt-1">Choose a teacher or group to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
