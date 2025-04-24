import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!name) return;
    const id = uuidv4();
    navigate(`/room/${id}`, { state: { name } });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId) return;
    if (roomId) {
      navigate(`/room/${roomId}`, { state: { name } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="p-6 bg-neutral-700 rounded-xl w-1/2 shadow-md flex items-center flex-col justify-center">
        <img src="logo.png" alt="logo image" className="w-20" />
        <h1 className="text-center text-3xl font-semibold text-neutral-300">
          CneMeet
        </h1>

        <form className="flex flex-col items-center gap-4 mt-4 w-full ">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your name"
            className="bg-transparent rounded-md border border-newutral-900 p-2 text-neutral-300 w-1/2"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleCreateRoom}
            className="btn bg-amber-400 p-2 rounded-xl w-1/2 font-semibold"
          >
            Genrate Room
          </button>

          <span className="text-neutral-300"> or </span>
          <input
            type="text"
            name="UserName"
            id="UserName"
            placeholder="Your name"
            className="bg-transparent rounded-md border border-newutral-900 p-2 text-neutral-300 w-1/2"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name="roomId"
            id="roomId"
            placeholder="Room ID"
            className="bg-transparent rounded-md border border-newutral-900 p-2 text-neutral-300 w-1/2"
            required
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            onClick={handleJoinRoom}
            className="btn bg-amber-100 p-2 rounded-xl w-1/2 font-semibold border border-amber-400"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
