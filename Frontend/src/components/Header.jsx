function Header({ roomId }) {
    return (
        <div className="flex justify-between p-4 bg-gray-800 shadow-md">
            <span className="text-xl font-bold text-white">Room ID: {roomId}</span>
        </div>
    )
}

export default Header
