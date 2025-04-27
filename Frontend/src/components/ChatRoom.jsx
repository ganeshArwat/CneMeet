function ChatRoom() {
    return (
        <>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
                <h1 className="text-center text-2xl font-semibold text-neutral-300 mb-4">Chat Room</h1>
                <div className="flex-grow bg-gray-900 p-4 overflow-auto rounded-lg mb-4">
                    {/* Chat messages will appear here */}
                </div>

                {/* Chat Input Section */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow p-2 rounded-lg bg-gray-700 text-white"
                    />
                    <button className="p-2 bg-blue-600 text-white rounded-lg">Send</button>
                </div>
            </div>
        </>
    )
}

export default ChatRoom
