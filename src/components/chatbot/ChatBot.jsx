import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatBot.css';

/**
 * ChatBot component – bong bóng chat hỗ trợ tư vấn có thể kéo thả (draggable).
 *
 * Props:
 *  - excludedRoutes: mảng các route KHÔNG hiện chatbot (mặc định: ['/dang-nhap', '/dang-ky'])
 *  - botName:        tên chatbot hiển thị trên header
 *  - welcomeMessage: tin nhắn chào mừng đầu tiên
 *  - quickReplies:   mảng các câu trả lời nhanh gợi ý
 *  - onSendMessage:  callback(message) – để sau kết nối API
 */

// ---- SVG Icons (inline, không cần thêm thư viện) ----
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

// ---- Helpers ----
const getTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const DEFAULT_EXCLUDED_ROUTES = ['/dang-nhap', '/dang-ky'];

const DEFAULT_QUICK_REPLIES = [
  'Tìm gia sư phù hợp',
  'Bảng giá dịch vụ',
  'Cách đặt lịch học',
  'Liên hệ hỗ trợ',
];

const DEFAULT_WELCOME = 'Xin chào! 👋 Tôi là trợ lý ảo của EduConnect. Tôi có thể giúp bạn tìm gia sư, tư vấn lộ trình học tập, hoặc giải đáp thắc mắc. Hãy hỏi tôi bất cứ điều gì nhé!';

// ---- Simulated bot responses (placeholder – thay bằng API thực tế) ----
const simulateBotReply = (userMessage) => {
  const msg = userMessage.toLowerCase();
  if (msg.includes('gia sư') || msg.includes('tìm')) {
    return 'Bạn có thể truy cập trang "Tìm gia sư" để lọc theo môn học, khu vực và mức giá phù hợp. Bạn muốn tôi hướng dẫn chi tiết không? 📚';
  }
  if (msg.includes('giá') || msg.includes('phí') || msg.includes('bảng giá')) {
    return 'Học phí tùy thuộc vào cấp lớp và hình thức học. Gia sư online từ 150.000đ/buổi, gia sư tại nhà từ 200.000đ/buổi. Bạn muốn xem chi tiết dịch vụ nào? 💰';
  }
  if (msg.includes('đặt lịch') || msg.includes('booking') || msg.includes('lịch học')) {
    return 'Để đặt lịch, bạn chọn gia sư → nhấn "Đặt lịch" → chọn thời gian phù hợp. Tôi có thể hướng dẫn bạn từng bước! 📅';
  }
  if (msg.includes('liên hệ') || msg.includes('hỗ trợ') || msg.includes('hotline')) {
    return 'Bạn có thể liên hệ qua:\n📞 Hotline: 1900-xxxx\n📧 Email: support@educonnect.vn\nHoặc nhắn trực tiếp cho tôi tại đây! 💬';
  }
  if (msg.includes('xin chào') || msg.includes('hello') || msg.includes('hi')) {
    return 'Chào bạn! Rất vui được hỗ trợ bạn. Bạn cần tôi giúp gì hôm nay? 😊';
  }
  return 'Cảm ơn bạn đã nhắn tin! Tôi đã ghi nhận câu hỏi. Đội ngũ tư vấn sẽ phản hồi bạn trong thời gian sớm nhất. Bạn có câu hỏi nào khác không? 🙏';
};


export default function ChatBot({
  excludedRoutes = DEFAULT_EXCLUDED_ROUTES,
  botName = 'EduConnect AI',
  welcomeMessage = DEFAULT_WELCOME,
  quickReplies = DEFAULT_QUICK_REPLIES,
  onSendMessage,
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  // Dragging state
  const [position, setPosition] = useState({ x: null, y: null, side: 'right' });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if chatbot should be visible on current route
  const isVisible = !excludedRoutes.some((route) => {
    if (route.endsWith('*')) {
      return location.pathname.startsWith(route.slice(0, -1));
    }
    return location.pathname === route;
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Init welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          text: welcomeMessage,
          time: getTimeString(),
        },
      ]);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // ---- Get bubble size based on viewport ----
  const getBubbleSize = useCallback(() => {
    if (window.innerWidth <= 480) return 52;
    if (window.innerWidth <= 768) return 56;
    return 62;
  }, []);

  // ---- Drag handlers ----
  const handleDragStart = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const el = dragRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    hasMoved.current = false;
    setIsDragging(true);
    setIsSnapping(false);

    e.preventDefault();
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragOffset.current.x;
    const newY = clientY - dragOffset.current.y;

    const bubbleSize = getBubbleSize();
    const maxY = window.innerHeight - bubbleSize;

    // Free movement horizontally, clamped vertically
    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - bubbleSize));
    const clampedY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: clampedX, y: clampedY, side: 'dragging' });
    hasMoved.current = true;

    e.preventDefault();
  }, [isDragging, getBubbleSize]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    // Snap to nearest edge (like Messenger)
    if (hasMoved.current) {
      setPosition((prev) => {
        if (prev.x === null) return prev;

        const bubbleSize = getBubbleSize();
        const screenCenter = window.innerWidth / 2;
        const bubbleCenter = prev.x + bubbleSize / 2;
        const margin = 10; // gap from edge

        const snapToRight = bubbleCenter > screenCenter;
        const snapX = snapToRight
          ? window.innerWidth - bubbleSize - margin
          : margin;

        setIsSnapping(true);
        // Remove snapping class after transition
        setTimeout(() => setIsSnapping(false), 300);

        return { x: snapX, y: prev.y, side: snapToRight ? 'right' : 'left' };
      });
    }
  }, [getBubbleSize]);

  // Attach global listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // ---- Chat logic ----
  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const toggleChat = () => {
    if (isDragging && hasMoved.current) return; // Don't toggle when finishing a drag

    if (isOpen) {
      closeChat();
    } else {
      setIsOpen(true);
      setHasNewMessage(false);
    }
  };

  const addBotReply = (userMsg) => {
    setIsTyping(true);
    const delay = 800 + Math.random() * 1200;

    setTimeout(() => {
      const reply = simulateBotReply(userMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          text: reply,
          time: getTimeString(),
        },
      ]);
      setIsTyping(false);
      setShowQuickReplies(true);

      if (!isOpen) {
        setHasNewMessage(true);
      }
    }, delay);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      type: 'user',
      text,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setShowQuickReplies(false);

    // Callback for API integration
    if (onSendMessage) {
      onSendMessage(text);
    }

    // Simulated reply – replace with actual API call
    addBotReply(text);
  };

  const handleQuickReply = (reply) => {
    setInputValue('');
    setShowQuickReplies(false);

    const userMsg = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: reply,
      time: getTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (onSendMessage) {
      onSendMessage(reply);
    }

    addBotReply(reply);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isVisible) return null;

  // Compute bubble style
  const bubbleStyle = position.x !== null
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        bottom: 'auto',
        transition: isSnapping ? 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.1s ease' : 'none',
      }
    : {};

  // Window style: desktop only (mobile is handled by CSS centering)
  // No need to position relative to bubble anymore

  return (
    <>
      {/* Chat Window */}
      {(isOpen || isClosing) && (
        <div
          className={`chatbot-window ${isClosing ? 'chatbot-window--closing' : ''}`}
          id="chatbot-window"
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header__avatar">
              <BotIcon />
              <span className="chatbot-header__status-dot" />
            </div>
            <div className="chatbot-header__info">
              <h4 className="chatbot-header__title">{botName}</h4>
              <span className="chatbot-header__subtitle">
                <span style={{ color: '#34D399' }}>●</span> Đang hoạt động
              </span>
            </div>
            <button
              className="chatbot-header__close"
              onClick={closeChat}
              aria-label="Đóng chat"
              id="chatbot-close-btn"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" id="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-msg chatbot-msg--${msg.type}`}
              >
                <div className="chatbot-msg__avatar">
                  {msg.type === 'bot' ? (
                    <BotIcon />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <div className="chatbot-msg__content">
                  <div className="chatbot-msg__bubble">
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <span className="chatbot-msg__time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chatbot-typing">
                <div className="chatbot-typing__avatar">
                  <BotIcon />
                </div>
                <div className="chatbot-typing__dots">
                  <span className="chatbot-typing__dot" />
                  <span className="chatbot-typing__dot" />
                  <span className="chatbot-typing__dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuickReplies && !isTyping && messages.length > 0 && (
            <div className="chatbot-quick-replies" id="chatbot-quick-replies">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="chatbot-quick-reply"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input">
            <input
              ref={inputRef}
              className="chatbot-input__field"
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              id="chatbot-input-field"
            />
            <button
              className={`chatbot-input__send ${!inputValue.trim() ? 'chatbot-input__send--disabled' : ''}`}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              aria-label="Gửi tin nhắn"
              id="chatbot-send-btn"
            >
              <SendIcon />
            </button>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            Powered by EduConnect AI ✨
          </div>
        </div>
      )}

      {/* Floating Bubble – chỉ hiện khi cửa sổ chat đóng */}
      {!isOpen && !isClosing && (
        <div
          ref={dragRef}
          className={`chatbot-bubble ${isDragging ? 'is-dragging' : ''}`}
          style={bubbleStyle}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={toggleChat}
          role="button"
          aria-label="Mở chatbot hỗ trợ"
          id="chatbot-bubble"
        >
          <span className="chatbot-bubble__pulse" />
          <ChatBubbleIcon />
          {hasNewMessage && (
            <span className="chatbot-bubble__badge">1</span>
          )}
        </div>
      )}
    </>
  );
}
