import { useState, useEffect, useRef } from "react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import {
  MessageSquare,
  Send,
  Users,
  ChevronDown,
  Loader2,
  UserCircle,
  ArrowLeft,
  Hash,
  Circle,
} from "lucide-react";

const GroupChat = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showGroupList, setShowGroupList] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadGroups();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await studentApi.fetchAvailableGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);
    setShowGroupList(false);
    setLoadingMessages(true);

    // Stop previous polling
    if (pollRef.current) clearInterval(pollRef.current);

    try {
      const data = await studentApi.fetchChatMessages(group.id);
      setMessages(Array.isArray(data) ? data : []);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }

    // Poll for new messages every 5s
    pollRef.current = setInterval(async () => {
      try {
        const data = await studentApi.fetchChatMessages(group.id);
        setMessages(Array.isArray(data) ? data : []);
      } catch {
        // silent
      }
    }, 5000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic update
    const optimisticMsg = {
      id: Date.now(),
      groupId: selectedGroup.id,
      senderId: user?.studentId || user?.id,
      senderName: `${user?.firstName || ""} ${user?.lastName || "You"}`.trim(),
      senderType: "STUDENT",
      message: messageText,
      sentAt: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      await studentApi.sendMessage(selectedGroup.id, messageText);
      // Refresh messages
      const data = await studentApi.fetchChatMessages(selectedGroup.id);
      setMessages(Array.isArray(data) ? data : []);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return "Today";
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  const isOwnMessage = (msg) => {
    return msg.senderType === "STUDENT" && (
      msg.senderId === user?.studentId ||
      msg.senderId === user?.id ||
      msg.senderName?.toLowerCase()?.includes(user?.firstName?.toLowerCase() || "___")
    );
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(msg.sentAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Group Chat</h1>
        <p className="text-sm text-slate-500">Chat with teachers and fellow students</p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm flex overflow-hidden" style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}>
        {/* ─── Group List (left panel) ─── */}
        <div className={`w-full sm:w-80 border-r border-slate-200 flex flex-col shrink-0 ${
          !showGroupList && selectedGroup ? "hidden sm:flex" : "flex"
        }`}>
          <div className="px-4 py-3 border-b border-slate-100 shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Groups</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {groups.length === 0 ? (
              <div className="p-8 text-center">
                <Users size={32} className="text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No groups available</p>
                <p className="text-xs text-slate-300 mt-1">Ask your teacher to create a group.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => handleGroupSelect(group)}
                    className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                      selectedGroup?.id === group.id ? "bg-slate-50 border-l-2 border-slate-900" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-sm font-bold text-slate-600">
                      <Hash size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{group.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {group.teacherName && `${group.teacherName} · `}
                        {group.subjectName || group.description || "Group chat"}
                      </p>
                      {group.students && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                          <Users size={10} /> {group.students.length} members
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Chat Area (right panel) ─── */}
        <div className={`flex-1 flex flex-col min-w-0 ${
          showGroupList && !selectedGroup ? "hidden sm:flex" : "flex"
        }`}>
          {selectedGroup ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-white">
                <button
                  onClick={() => setShowGroupList(true)}
                  className="sm:hidden text-slate-400 hover:text-slate-800 transition-colors shrink-0"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-9 h-9 bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  <Hash size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{selectedGroup.name}</h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {selectedGroup.teacherName || "Group Chat"} · {selectedGroup.subjectName || ""}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-slate-300" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare size={40} className="text-slate-200 mb-3" />
                    <p className="text-sm font-semibold text-slate-500">No messages yet</p>
                    <p className="text-xs text-slate-400 mt-1">Start the conversation!</p>
                  </div>
                ) : (
                  Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      {/* Date separator */}
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2">
                          {date}
                        </span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                      </div>

                      {msgs.map((msg) => {
                        const own = isOwnMessage(msg);
                        const isTeacher = msg.senderType === "TEACHER";
                        return (
                          <div
                            key={msg.id}
                            className={`flex mb-3 ${own ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[80%] sm:max-w-[70%] ${own ? "order-2" : ""}`}>
                              {!own && (
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    isTeacher ? "text-amber-600" : "text-slate-400"
                                  }`}>
                                    {msg.senderName || "Unknown"}
                                  </span>
                                  {isTeacher && (
                                    <span className="text-[8px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 uppercase tracking-wider">
                                      Teacher
                                    </span>
                                  )}
                                </div>
                              )}
                              <div
                                className={`px-4 py-2.5 text-sm leading-relaxed ${
                                  own
                                    ? "bg-slate-900 text-white rounded-sm rounded-br-none"
                                    : isTeacher
                                    ? "bg-amber-50 text-slate-800 border border-amber-100 rounded-sm rounded-bl-none"
                                    : "bg-white text-slate-800 border border-slate-200 rounded-sm rounded-bl-none"
                                } ${msg._optimistic ? "opacity-70" : ""}`}
                              >
                                {msg.message}
                              </div>
                              <p className={`text-[10px] text-slate-400 mt-1 ${own ? "text-right" : ""}`}>
                                {formatTime(msg.sentAt)}
                                {msg._optimistic && " · Sending..."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form
                onSubmit={handleSend}
                className="px-4 py-3 border-t border-slate-200 bg-white flex items-center gap-3 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 transition-colors bg-slate-50"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-11 h-11 bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </>
          ) : (
            /* No group selected placeholder */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
              <div className="w-20 h-20 bg-slate-100 flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">Select a group</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Choose a group from the sidebar to start chatting with your teachers and classmates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
