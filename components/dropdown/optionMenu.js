import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'


export default function OptionMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter()
  const menuRef = useRef(null); 

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-black z-30" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
      {session.user?.u_name[0].toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
          <button onClick={() => alert("Personal Profile clicked")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Personal Profile</button>
          <button onClick={() => alert("Account Settings clicked")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Account Settings</button>
          <button onClick={() => router.push(`/api/auth/signout?callbackUrl=/`)} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Logout</button>
        </div>
      )}
    </div>
  );
}