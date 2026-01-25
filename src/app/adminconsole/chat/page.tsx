"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Message {
  id: string;
  type: "text" | "image" | "audio";
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDuration?: string;
  senderId: string;
  receiverId: string;
  timestamp?: any;
  [key: string]: any;
}

interface ChatConversation {
  chatId: string;
  bookingId: string;
  participants: string[];
  providerId?: string;
  providerRole?: string;
  lastMessage: string;
  lastTimestamp: any;
  messages: Message[];
  participantInfo: {
    [userId: string]: {
      name: string;
      photo?: string;
      role?: string;
      isOnline?: boolean;
    };
  };
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioRef: HTMLAudioElement | null;
}

export default function ChatManagement() {
  const searchParams = useSearchParams();
  const bookingIdFromUrl = searchParams.get("bookingId");

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [audioPlayers, setAudioPlayers] = useState<{ [messageId: string]: AudioPlayerState }>({});

  useEffect(() => {
    const loadData = async () => {
      const usersData = await fetchUsers();
      await fetchChats(usersData, bookingIdFromUrl || undefined);
    };
    loadData();
  }, [bookingIdFromUrl]);

  const fetchUsers = async () => {
    if (!db) return [];

    try {
      const usersCollection = collection(db, "UsersCollection");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      return usersData;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  };

  const fetchChats = async (usersData?: any[], filterBookingId?: string) => {
    const usersToUse = usersData || users;
    if (!db) {
      console.error("Firebase Firestore is not initialized");
      setError("Firebase is not initialized");
      setLoading(false);
      return;
    }

    try {
      // Always fetch all chat documents from ChatCollection (bookingId is only used to auto-select)
      const chatsCollection = collection(db, "ChatCollection");
      const chatsSnapshot = await getDocs(chatsCollection);

      const chatsData: ChatConversation[] = [];

      // For each chat document, fetch its messages from MessageCollection subcollection
      for (const chatDoc of chatsSnapshot.docs) {
        const chatData = chatDoc.data();
        const chatId = chatDoc.id;

        // Fetch messages from MessageCollection subcollection
        let messages: Message[] = [];
        try {
          const messagesCollection = collection(db, "ChatCollection", chatId, "MessageCollection");
          const messagesQuery = query(messagesCollection, orderBy("timestamp", "asc"));
          const messagesSnapshot = await getDocs(messagesQuery);

          messages = messagesSnapshot.docs.map((msgDoc) => ({
            id: msgDoc.id,
            ...msgDoc.data(),
          })) as Message[];
        } catch (msgErr) {
          console.error(`Error fetching messages for chat ${chatId}:`, msgErr);
          // Continue with empty messages array
        }

        // Get participant information
        const participants = chatData.participants || [];
        const participantInfo: { [userId: string]: { name: string; photo?: string; role?: string; isOnline?: boolean } } = {};

        participants.forEach((participantId: string) => {
          const user = usersToUse.find((u) => u.id === participantId);
          if (user) {
            participantInfo[participantId] = {
              name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || user.displayName || "Unknown User",
              photo: user.photo || user.profilePicture,
              role: user.role,
              isOnline: user.isOnline === true,
            };
          } else {
            participantInfo[participantId] = {
              name: "Unknown User",
              isOnline: false,
            };
          }
        });

        // Get last message preview
        let lastMessage = chatData.lastMessage || "";
        let lastTimestamp = chatData.lastTimestamp;

        if (messages.length > 0) {
          const lastMsg = messages[messages.length - 1];
          if (lastMsg.type === "text" && lastMsg.text) {
            lastMessage = lastMsg.text;
          } else if (lastMsg.type === "image") {
            lastMessage = "📷 Image";
          } else if (lastMsg.type === "audio") {
            lastMessage = "🎤 Voice message";
          }
          lastTimestamp = lastMsg.timestamp || lastTimestamp;
        }

        chatsData.push({
          chatId,
          bookingId: chatData.bookingId || "",
          participants,
          providerId: chatData.providerId,
          providerRole: chatData.providerRole,
          lastMessage,
          lastTimestamp,
          messages,
          participantInfo,
        });
      }

      // Sort by last timestamp
      chatsData.sort((a, b) => {
        const timeA = a.lastTimestamp?.toDate ? a.lastTimestamp.toDate() : new Date(a.lastTimestamp || 0);
        const timeB = b.lastTimestamp?.toDate ? b.lastTimestamp.toDate() : new Date(b.lastTimestamp || 0);
        return timeB.getTime() - timeA.getTime();
      });

      setConversations(chatsData);
      setError(null);

      // Auto-select: when opened from booking (filterBookingId), select the matching chat; otherwise first chat if none selected
      if (chatsData.length > 0) {
        if (filterBookingId) {
          const match = chatsData.find((c) => c.bookingId === filterBookingId) || chatsData[0];
          setSelectedChat(match.chatId);
        } else if (!selectedChat) {
          setSelectedChat(chatsData[0].chatId);
        }
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  // Refetch chats when users are loaded (if chats haven't been loaded yet)
  useEffect(() => {
    if (users.length > 0 && conversations.length === 0) {
      fetchChats(users, bookingIdFromUrl || undefined);
    }
  }, [users]);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;

    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.bookingId.toLowerCase().includes(query) ||
        Object.values(conv.participantInfo).some((info) =>
          info.name.toLowerCase().includes(query)
        ) ||
        conv.lastMessage.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Get selected conversation
  const selectedConversation = useMemo(() => {
    if (!selectedChat) return null;
    return conversations.find((conv) => conv.chatId === selectedChat) || null;
  }, [conversations, selectedChat]);

  // Initialize audio players when selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      selectedConversation.messages.forEach((message) => {
        if (message.type === "audio" && message.audioUrl && !audioPlayers[message.id]) {
          initializeAudioPlayer(message.id, message.audioUrl, message.audioDuration);
        }
      });
    }
    // Note: Removed cleanup to allow multiple audio players to play simultaneously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return "N/A";

    try {
      let date: Date;

      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      } else {
        return "N/A";
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} mins`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (err) {
      return "N/A";
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      let date: Date;

      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      } else {
        return "";
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffHours < 24) {
        return new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(date);
      }
    } catch (err) {
      return "";
    }
  };


  const getUserName = (userId: string, conversation: ChatConversation | null) => {
    if (!conversation) return "Unknown";
    return conversation.participantInfo[userId]?.name || "Unknown User";
  };

  // Dummy person avatar when user has no photo (Pixabay blank profile picture)
  const DUMMY_AVATAR_URL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const getAvatarUrl = (photo?: string | null) =>
    photo || DUMMY_AVATAR_URL;

  const getUserPhoto = (userId: string, conversation: ChatConversation | null) => {
    if (!conversation) return DUMMY_AVATAR_URL;
    const photo = conversation.participantInfo[userId]?.photo;
    return getAvatarUrl(photo);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseDuration = (durationStr: string): number => {
    // Parse "00:08" format to seconds
    const parts = durationStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const initializeAudioPlayer = (messageId: string, audioUrl: string, durationStr?: string) => {
    if (audioPlayers[messageId]?.audioRef) {
      return audioPlayers[messageId].audioRef;
    }

    const audio = new Audio(audioUrl);
    const duration = durationStr ? parseDuration(durationStr) : 0;

    audio.addEventListener("loadedmetadata", () => {
      setAudioPlayers((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          duration: audio.duration || duration,
        },
      }));
    });

    audio.addEventListener("timeupdate", () => {
      setAudioPlayers((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          currentTime: audio.currentTime,
        },
      }));
    });

    audio.addEventListener("ended", () => {
      setAudioPlayers((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          isPlaying: false,
          currentTime: 0,
        },
      }));
    });

    setAudioPlayers((prev) => ({
      ...prev,
      [messageId]: {
        isPlaying: false,
        currentTime: 0,
        duration: duration,
        audioRef: audio,
      },
    }));

    return audio;
  };

  const togglePlayPause = (messageId: string, audioUrl: string, durationStr?: string) => {
    let playerState = audioPlayers[messageId];

    if (!playerState || !playerState.audioRef) {
      const audio = initializeAudioPlayer(messageId, audioUrl, durationStr);
      playerState = audioPlayers[messageId];
    }

    if (!playerState?.audioRef) return;

    if (playerState.isPlaying) {
      // Pause this audio
      playerState.audioRef.pause();
      setAudioPlayers((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          isPlaying: false,
        },
      }));
    } else {
      // Pause all other audio players before playing this one
      Object.keys(audioPlayers).forEach((id) => {
        if (id !== messageId && audioPlayers[id]?.audioRef && audioPlayers[id].isPlaying) {
          audioPlayers[id].audioRef!.pause();
        }
      });

      // Update state for all paused players
      setAudioPlayers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (id !== messageId && updated[id]?.isPlaying) {
            updated[id] = {
              ...updated[id],
              isPlaying: false,
            };
          }
        });
        return updated;
      });

      // Play the selected audio
      playerState.audioRef.play();
      setAudioPlayers((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          isPlaying: true,
        },
      }));
    }
  };

  const handleSeek = (messageId: string, newTime: number) => {
    const playerState = audioPlayers[messageId];
    if (playerState?.audioRef) {
      playerState.audioRef.currentTime = newTime;
      setAudioPlayers((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          currentTime: newTime,
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="-my-4 md:-my-6 mx-2 md:mx-4 h-[calc(100vh-10rem)] min-h-[600px] flex flex-col bg-transparent dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-transparent dark:bg-transparent">
        <div className="flex items-center gap-4">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Chats
          </h1>
          {bookingIdFromUrl && (
            <Link
              href={`/adminconsole/bookings/${bookingIdFromUrl}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Booking
            </Link>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {bookingIdFromUrl ? (
            <>Home &gt; Bookings &gt; Chat</>
          ) : (
            <>Home &gt; Chats</>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-3 min-h-0">
        {/* Left Sidebar - Chat List (rounded card); hidden on mobile when a chat is selected */}
        <div className={`w-full md:w-96 flex-shrink-0 flex flex-col bg-transparent dark:bg-gray-800 rounded-xl overflow-hidden shadow-[0px_2px_8px_rgba(16,24,40,0.08),0px_1px_4px_rgba(16,24,40,0.04)] dark:shadow-none border border-gray-200/80 dark:border-gray-700/80 ${selectedChat ? "hidden md:flex" : "flex"}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">Chats</h2>
            <button type="button" className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="More options">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-shadow"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? "No chats found" : bookingIdFromUrl ? "No chat found for this booking" : "No chats available"}
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const displayParticipant = conversation.participants.find(
                  (p) => p !== conversation.providerId
                ) || conversation.participants[0];
                const participantInfo = conversation.participantInfo[displayParticipant] || {
                  name: "Unknown User",
                  role: "Customer",
                };
                const roleLabel = participantInfo.role || "Customer";
                const isSelected = selectedChat === conversation.chatId;

                return (
                  <div
                    key={conversation.chatId}
                    onClick={() => setSelectedChat(conversation.chatId)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ease-out border-b border-gray-100 dark:border-gray-700/80 last:border-b-0 ${isSelected
                      ? "bg-gray-100 dark:bg-gray-700/50"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      }`}
                  >
                    {/* Avatar with status */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={getAvatarUrl(participantInfo.photo)}
                        alt={participantInfo.name}
                        className="w-11 h-11 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = "flex";
                          }
                        }}
                      />
                      <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hidden">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {participantInfo.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      {/* isOnline from UsersCollection: green when true, gray when false */}
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-gray-800 rounded-full ${participantInfo.isOnline ? "bg-green-500" : "bg-gray-400 dark:bg-gray-500"}`} aria-hidden />
                    </div>

                    {/* Name, role, last message, time */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {participantInfo.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatRelativeTime(conversation.lastTimestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {roleLabel}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                        {conversation.lastMessage || "No messages"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel - Chat Messages; hidden on mobile when no chat selected so list can use full width */}
        <div className={`flex-1 flex flex-col min-w-0 rounded-xl overflow-hidden bg-transparent dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 shadow-[0px_2px_8px_rgba(16,24,40,0.08),0px_1px_4px_rgba(16,24,40,0.04)] dark:shadow-none ${!selectedChat ? "hidden md:flex" : "flex"}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header: back (mobile), avatar, name, status */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Back to list - mobile only */}
                  <button
                    type="button"
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    aria-label="Back to chats"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  {(() => {
                    const displayParticipant = selectedConversation.participants.find(
                      (p) => p !== selectedConversation.providerId
                    ) || selectedConversation.participants[0];
                    const participantInfo = selectedConversation.participantInfo[displayParticipant] || {
                      name: "Unknown User",
                    };

                    return (
                      <>
                        <div className="relative flex-shrink-0">
                          <img
                            src={getAvatarUrl(participantInfo.photo)}
                            alt={participantInfo.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = "flex";
                              }
                            }}
                          />
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hidden">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                              {participantInfo.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-gray-900 rounded-full ${participantInfo.isOnline ? "bg-green-500" : "bg-gray-400 dark:bg-gray-500"}`} aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {participantInfo.name}
                          </h3>

                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {selectedConversation.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                  </div>
                ) : (
                  selectedConversation.messages.map((message, index) => {
                    const prevMessage = index > 0 ? selectedConversation.messages[index - 1] : null;
                    const isFromSameSender = prevMessage && prevMessage.senderId === message.senderId;
                    const senderName = getUserName(message.senderId, selectedConversation);
                    const senderPhoto = getUserPhoto(message.senderId, selectedConversation);
                    const isAdmin = false; // You can determine this based on your logic

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAdmin ? "justify-end" : "justify-start"} ${!isFromSameSender ? "items-end" : "items-end"}`}
                      >
                        {!isAdmin && !isFromSameSender && (
                          <img
                            src={senderPhoto || ""}
                            alt={senderName}
                            className="w-8 h-8 rounded-full object-cover mr-2.5 mt-0.5 flex-shrink-0 self-end"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        )}
                        {!isAdmin && isFromSameSender && <div className="w-8 mr-2.5 flex-shrink-0" />}

                        <div className={`flex flex-col ${isAdmin ? "items-end" : "items-start"} max-w-[75%] sm:max-w-md`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl shadow-sm ${isAdmin
                              ? "bg-[#489BFF] text-white"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200/80 dark:border-gray-600/80"
                              }`}
                          >
                            {message.type === "text" && (
                              <p className="text-sm text-gray-900 dark:text-gray-100">{message.text || ""}</p>
                            )}
                            {message.type === "image" && message.imageUrl && (
                              <div className="max-w-xs">
                                <img
                                  src={message.imageUrl}
                                  alt="Chat image"
                                  className="rounded-lg max-w-full h-auto"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    if (target.nextElementSibling) {
                                      (target.nextElementSibling as HTMLElement).style.display = "block";
                                    }
                                  }}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" style={{ display: "none" }}>
                                  Failed to load image
                                </p>
                              </div>
                            )}
                            {message.type === "audio" && message.audioUrl && (() => {
                              const playerState = audioPlayers[message.id] || {
                                isPlaying: false,
                                currentTime: 0,
                                duration: message.audioDuration ? parseDuration(message.audioDuration) : 0,
                                audioRef: null,
                              };

                              const currentDuration = playerState.duration || (message.audioDuration ? parseDuration(message.audioDuration) : 0);
                              const currentTime = playerState.currentTime || 0;
                              const progress = currentDuration > 0 ? (currentTime / currentDuration) * 100 : 0;

                              return (
                                <div className="flex items-center gap-3 w-full max-w-md">
                                  <button
                                    onClick={() => togglePlayPause(message.id, message.audioUrl!, message.audioDuration)}
                                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center hover:opacity-80 transition-opacity"
                                  >
                                    {playerState.isPlaying ? (
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    )}
                                  </button>
                                  <div className="flex-shrink-0 text-xs font-mono min-w-[60px]">
                                    {formatTime(currentTime)} / {formatTime(currentDuration)}
                                  </div>
                                  <div className="flex-1 relative h-1.5">
                                    <div className="h-full bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gray-500 dark:bg-gray-400 rounded-full transition-all duration-100"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max={currentDuration || 100}
                                      value={currentTime}
                                      onChange={(e) => handleSeek(message.id, parseFloat(e.target.value))}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                            {isAdmin ? formatMessageTime(message.timestamp) : `${senderName}, ${formatMessageTime(message.timestamp)}`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  {bookingIdFromUrl && conversations.length === 0
                    ? "No chat found for this booking"
                    : "Select a chat to start messaging"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
