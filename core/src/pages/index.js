# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: src\pages\index.js
# Merge Date: 2026-05-07T19:14:11.492458
# ---

import ChatInput from '../components/ChatInput';
import ChatDisplay from '../components/ChatDisplay';
import React, { useState } from 'react';

function HomePage() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, { sender: 'user', text: newMessage }]);
    // Here you would typically send the message to the backend and handle the response
    // For now, let's just add a placeholder response from the AI
    setTimeout(() => {
      setMessages([...messages, { sender: 'ai', text: 'This is a placeholder response from the AI.' }]);
    }, 500); // Simulate a delay for AI response
  };

  return (
    <div>
      <h1>Welcome to OpenManus!</h1>
      <ChatDisplay messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default HomePage;