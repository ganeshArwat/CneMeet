function SentMessage({ message, timestamp }) {
    return (
        <div className="bg-[#25d366] text-black px-4 py-2 rounded-2xl rounded-br-sm max-w-[75%] ml-auto mr-3 mb-2 text-sm shadow-lg relative">
            <div>{message}</div>
            <div className="text-xs text-black/70 mt-1 text-right">{timestamp}</div>
        </div>
    )
}

export default SentMessage
