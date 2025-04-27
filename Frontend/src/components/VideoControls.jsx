function VideoControls() {
    return (
        <div className="bg-gray-800 p-4 flex justify-center gap-6 mt-auto">
            <button

                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500"
            >
                {true ? "Turn Off Video" : "Turn On Video"}
            </button>
            <button
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-500"
            >
                {true ? "Mute Audio" : "Unmute Audio"}
            </button>
            <button
                className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-500"
            >
                {true ? "Stop Sharing" : "Start Sharing"}
            </button>
            <button
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500"
            >
                Disconnect
            </button>
        </div>
    )
}

export default VideoControls
