import React, { useState } from "react";

const ChatBox = ({ messages, sendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
    }
  };

  return (
    <div className="flex flex-col border border-gray-600 rounded p-2 bg-white text-black w-full md:w-80">
      <div className="overflow-y-auto h-60 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            <strong>{msg.name}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-2 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
