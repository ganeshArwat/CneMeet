import { useState } from "react";
import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";
import { IoMdSend } from "react-icons/io";

function ChatRoom({ sendMessage, setMessages, messages }) {

    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;
        const newMessage = {
            id: Date.now(),
            text: inputValue,
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, type: "sent" }]);
        sendMessage(newMessage);
        setInputValue("");
    };
    return (
        <>
            <div className="md:h-[83vh] bg-gray-800 flex flex-col p-4 rounded-lg">
                <h1 className="text-center text-2xl font-semibold text-neutral-300 mb-4">Chat Room</h1>

                {/* Message Container */}
                <div className="flex-1 bg-gray-900 p-4 overflow-y-auto rounded-lg mb-4">
                    {messages.map((message) =>
                        message.type === "sent" ? (
                            <SentMessage key={message.id} message={message.text} timestamp={message.timestamp} />
                        ) : (
                            <ReceivedMessage key={message.id} message={message.text} timestamp={message.timestamp} />
                        )
                    )}
                </div>

                {/* Chat Input Section */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow p-2 rounded-lg bg-gray-700 text-white"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                        }}
                    />
                    <button className="p-2 bg-blue-600 text-white rounded-lg" onClick={handleSendMessage}>
                        <IoMdSend />
                    </button>
                </div>
            </div>
        </>
    )
}

export default ChatRoom
