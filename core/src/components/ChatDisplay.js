# AETHELGARD MERGED FILE
# Origin Repository: OpenManus-main
# Original Path: src\components\ChatDisplay.js
# Merge Date: 2026-05-07T19:14:10.653456
# ---

import React from 'react';

function ChatDisplay({ messages }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}:</strong> {message.text}
        </div>
      ))}
    </div>
  );
}

export default ChatDisplay;