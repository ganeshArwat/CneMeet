import toast from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5"

function Header({ roomId }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId);
        toast.success('Room ID copied to clipboard!');
    }
    return (
        <div className="flex justify-between p-4 bg-gray-800 shadow-md cursor-pointer">
            <span
                className="text-xl font-bold text-white flex hover:text-gray-400 transition duration-300 ease-in-out"
                onClick={copyToClipboard}>
                Room ID: {roomId}  <IoCopyOutline className="ml-2" />
            </span>
        </div>
    )
}

export default Header
