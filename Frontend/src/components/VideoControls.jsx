function VideoControls({ toggleVideo, videoOn, toggleAudio, audioOn, disconnectCall }) {
    return (
        <div className="bg-gray-800 p-4 flex justify-center gap-6 mt-auto">
            <button
                className={`${videoOn ? "bg-gray-900" : "bg-red-600"}  text-white px-4 py-2 rounded-full hover:bg-blue-500 shadow-md `}
                onClick={toggleVideo}
                title={videoOn ? "Turn off video" : "Turn on video"}
            >
                {videoOn ? "Turn Off Video" : "Turn On Video"}
            </button>
            <button
                className={`${audioOn ? "bg-gray-900" : "bg-red-600"} bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-green-500 shadow-md`}
                onClick={toggleAudio}
                title={audioOn ? "Mute audio" : "Unmute audio"}
            >
                {audioOn ? "Mute Audio" : "Unmute Audio"}
            </button>
            <button
                className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-yellow-500 shadow-md"
            >
                {true ? "Stop Sharing" : "Start Sharing"}
            </button>
            <button
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500"
                onClick={disconnectCall}
                title="Disconnect from call"
            >
                Disconnect
            </button>
        </div>
    )
}

export default VideoControls
