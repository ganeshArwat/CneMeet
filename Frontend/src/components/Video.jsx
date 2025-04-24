function Video() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">
        Room ID: {roomId} | User: {state?.name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={myVideo}
            autoPlay
            muted
            className="w-full h-[400px] object-cover"
          ></video>
          <p className="text-center">you</p>
        </div>
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={userVideo}
            autoPlay
            className="w-full h-[300px] object-cover"
          />
          <p className="text-center">Peer</p>
        </div>
      </div>
    </div>
  );
}

export default Video;
