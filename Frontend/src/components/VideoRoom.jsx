import ReactPlayer from "react-player";

function VideoRoom({ roomId, myStream, remoteStream }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Room ID: {roomId}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <ReactPlayer
            playing
            muted
            className="w-full h-[300px] object-cover"
            url={myStream}
          />
          <p className="text-center">you</p>
        </div>
        <div className="bg-black rounded-lg overflow-hidden">
          <ReactPlayer
            playing
            muted
            className="w-full h-[300px] object-cover"
            url={remoteStream}
          />
          <p className="text-center">Peer</p>
        </div>
      </div>
    </div>
  );
}

export default VideoRoom;
