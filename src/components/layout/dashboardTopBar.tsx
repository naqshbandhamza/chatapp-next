"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";
import { clearTargetUser } from "@/store/slices/targetUserSlice";
import { resetChatId } from "@/store/slices/selectedChat";
import { clearChats, clearMessages } from "@/store/slices/chatSlice";

type DashboardSection = "home" | "messages" | "meta";

interface DashboardTopBarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

export default function DashboardTopBar({
  activeSection,
  setActiveSection,
}: DashboardTopBarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        dispatch(clearUser());
        dispatch(clearTargetUser());
        dispatch(resetChatId());
        dispatch(clearMessages());
        dispatch(clearChats());

        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="
                flex
                h-[10dvh]
                shrink-0
                items-center
                border-b
                border-gray-100
                bg-white
                px-4
                sm:px-6
            "
    >
      {/* LOGO */}

      <div className="mr-8 flex items-center">
        <span
          className="
                        text-lg
                        font-bold
                        tracking-tight
                        text-[#6C5CE7]
                    "
        >
          Chime
        </span>
      </div>

      {/* NAVIGATION */}

      {/* <nav className="flex h-full items-center gap-1">

                <button
                    onClick={() =>
                        setActiveSection('home')
                    }
                    className={`
                        h-full
                        border-b-2
                        px-4
                        text-sm
                        font-semibold
                        transition

                        ${
                            activeSection === 'home'
                                ? `
                                    border-[#6C5CE7]
                                    text-[#6C5CE7]
                                  `
                                : `
                                    border-transparent
                                    text-gray-500
                                    hover:text-gray-900
                                  `
                        }
                    `}
                >
                    Home
                </button>


                <button
                    onClick={() =>
                        setActiveSection('messages')
                    }
                    className={`
                        h-full
                        border-b-2
                        px-4
                        text-sm
                        font-semibold
                        transition

                        ${
                            activeSection === 'messages'
                                ? `
                                    border-[#6C5CE7]
                                    text-[#6C5CE7]
                                  `
                                : `
                                    border-transparent
                                    text-gray-500
                                    hover:text-gray-900
                                  `
                        }
                    `}
                >
                    Messages
                </button>

                <button
                    onClick={() =>
                        setActiveSection('meta')
                    }
                    className={`
                        h-full
                        border-b-2
                        px-4
                        text-sm
                        font-semibold
                        transition

                        ${
                            activeSection === 'meta'
                                ? `
                                    border-[#6C5CE7]
                                    text-[#6C5CE7]
                                  `
                                : `
                                    border-transparent
                                    text-gray-500
                                    hover:text-gray-900
                                  `
                        }
                    `}
                >
                    Meta
                </button>

            </nav> */}

      {/* Desktop navigation */}
      <nav className="hidden h-full items-center gap-1 sm:flex">
        <button
          onClick={() => setActiveSection("home")}
          className={`
        h-full
        border-b-2
        px-4
        text-sm
        font-semibold
        transition
        ${
          activeSection === "home"
            ? "border-[#6C5CE7] text-[#6C5CE7]"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }
    `}
        >
          Home
        </button>

        <button
          onClick={() => setActiveSection("messages")}
          className={`
        h-full
        border-b-2
        px-4
        text-sm
        font-semibold
        transition
        ${
          activeSection === "messages"
            ? "border-[#6C5CE7] text-[#6C5CE7]"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }
    `}
        >
          Messages
        </button>

        <button
          onClick={() => setActiveSection("meta")}
          className={`
        h-full
        border-b-2
        px-4
        text-sm
        font-semibold
        transition
        ${
          activeSection === "meta"
            ? "border-[#6C5CE7] text-[#6C5CE7]"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }
    `}
        >
          Meta
        </button>
      </nav>

      {/* Mobile navigation */}
      <div className="relative sm:hidden">
        <select
          value={activeSection}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setActiveSection(e.target.value as DashboardSection)
        }
          className="
            appearance-none
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            py-2
            pr-8
            text-sm
            font-semibold
            text-gray-700
            outline-none
            transition
            focus:border-[#6C5CE7]
        "
        >
          <option value="home">Home</option>
          <option value="messages">Messages</option>
          <option value="meta">Meta</option>
        </select>

        {/* Dropdown arrow */}
        <span
          className="
            pointer-events-none
            absolute
            right-2.5
            top-1/2
            -translate-y-1/2
            text-xs
            text-gray-400
        "
        >
          ▼
        </span>
      </div>

      {/* RIGHT SIDE */}

      {/* <div className="ml-auto flex items-center gap-3">

                <button
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F0EDFF]
                        text-sm
                        font-bold
                        text-[#6C5CE7]
                    "
                >
                    U
                </button>

            </div> */}

      <div className="ml-auto flex items-center gap-3 relative">
        <div className="relative">
          {/* Profile button */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#F0EDFF]
            text-sm
            font-bold
            text-[#6C5CE7]
            transition
            hover:bg-[#E7E3FF]
            active:scale-95
        "
          >
            U
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div
              className="
                absolute
                right-0
                top-12
                z-50
                w-40
                rounded-xl
                border
                border-gray-100
                bg-white
                p-1.5
                shadow-lg
            "
            >
              <button
                onClick={handleLogout}
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-50
                "
              >
                <span>↪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
