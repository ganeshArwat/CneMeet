function ReceivedMessage({ message, timestamp }) {
    return (
        <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[75%] mr-auto ml-3 mb-2 text-sm shadow-lg border border-gray-200 relative">
            <div>{message}</div>
            <div className="text-xs text-gray-500 mt-1 text-right">{timestamp}</div>
        </div>
    )
}

export default ReceivedMessage
