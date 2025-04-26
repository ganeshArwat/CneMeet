import ReactPlayer from "react-player";

function Video({ stream, UserName }) {
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        playing
        muted
        className="w-full h-[300px] object-cover"
        url={stream}
      />
      <p className="text-center">{UserName ? `${UserName}` : ""}</p>
    </div>
  );
}

export default Video;
