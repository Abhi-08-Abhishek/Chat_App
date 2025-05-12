
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Home, LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            {/* when click it will redirect to home */}
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="hover:bg-green-500 size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat-Talk🦜</h1>
            </Link>
          </div>
            {/*click to set theme*/}
          <div className="flex items-center gap-2">
            {/*Home button*/}
          <Link
              to={"/"}
              className={`
              btn btn-sm gap-2 transition-colors
              `}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
             {/*Settings button*/}   
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors 
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
                {/*authenticated user can access the profile page or logout button*/}
            {authUser && (
              <>
              {/*Profile button*/}
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center rounded-full hover:bg-red-500 hover:text-white px-3 py-1" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
