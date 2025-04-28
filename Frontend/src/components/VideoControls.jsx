import { AiFillAudio, AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai"
import { IoCallOutline, IoVideocam, IoVideocamOff, IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5"
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu"

function VideoControls({ toggleVideo, videoOn, toggleAudio, audioOn, disconnectCall, toggleScreenShare, isScreenSharing }) {
    return (
        <div className="bg-gray-800 p-4 flex justify-center gap-6 mt-auto">
            <button
                className={`${videoOn ? "bg-gray-900" : "bg-red-600"}  text-white px-4 py-2 rounded-full hover:bg-blue-500 shadow-md `}
                onClick={toggleVideo}
                title={videoOn ? "Turn off video" : "Turn on video"}
            >
                {videoOn ? <IoVideocamOutline size={25} /> : <IoVideocamOffOutline size={25} />}
            </button>
            <button
                className={`${audioOn ? "bg-gray-900" : "bg-red-600"} bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-green-500 shadow-md`}
                onClick={toggleAudio}
                title={audioOn ? "Mute audio" : "Unmute audio"}
            >
                {audioOn ? <AiOutlineAudio size={25} /> : <AiOutlineAudioMuted size={25} />}
            </button>
            <button
                className={`bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-yellow-500 shadow-md ${isScreenSharing ? "bg-yellow-500" : ""}`}
                onClick={toggleScreenShare}
            >
                {isScreenSharing ? <LuScreenShareOff size={25} /> : <LuScreenShare size={25} />}
            </button>
            <button
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500"
                onClick={disconnectCall}
                title="Disconnect from call"
            >
                <IoCallOutline size={25} />
            </button>
        </div>
    )
}

export default VideoControls
