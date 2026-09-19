"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";
import { clearTargetUser } from "@/store/slices/targetUserSlice";
import { resetChatId } from "@/store/slices/selectedChat";
import { clearChats, clearMessages } from "@/store/slices/chatSlice";

type DashboardSection = "home" | "messages" | "meta" | "automations";

interface DashboardTopBarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  automationAlerts: any[];
}

export default function DashboardTopBar({
  activeSection,
  setActiveSection,
  automationAlerts,
}: DashboardTopBarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

        <button
          onClick={() => setActiveSection("automations")}
          className={`
            h-full
            border-b-2
            px-4
            text-sm
            font-semibold
            transition
            ${
              activeSection === "automations"
                ? "border-[#6C5CE7] text-[#6C5CE7]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }
          `}
        >
          Automations
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
          <option value="automations">Automations</option>
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

      {/* <div className="ml-auto flex items-center gap-3 relative">
        <div className="relative">
         
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
      </div> */}

      <div className="relative ml-auto flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="
      relative
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-full
      text-gray-600
      transition
      hover:bg-gray-100
      active:scale-95
    "
          >
            <span className="text-lg">🔔</span>

            {automationAlerts?.length > 0 && (
              <span
                className="
          absolute
          right-0
          top-0
          flex
          h-4
          min-w-4
          items-center
          justify-center
          rounded-full
          bg-red-500
          px-1
          text-[9px]
          font-bold
          text-white
        "
              >
                {automationAlerts?.length > 99 ? "99+" : automationAlerts?.length}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {isNotificationsOpen && (
            <div
              className="
        absolute
        right-0
        top-12
        z-50
        w-96
        overflow-hidden
        rounded-xl
        border
        border-gray-100
        bg-white
        shadow-xl
      "
            >
              {/* Header */}
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-500">Automation alerts</p>
                  </div>

                  {automationAlerts.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {automationAlerts.length} alert
                      {automationAlerts.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="max-h-[400px] overflow-y-auto">
                {automationAlerts?.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <div className="mb-2 text-2xl">🔔</div>

                    <p className="text-sm font-medium text-gray-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Automation alerts will appear here.
                    </p>
                  </div>
                ) : (
                  automationAlerts.map((alert) => (
                    <button
                      key={alert.alert_id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setActiveSection("automations");
                      }}
                      className="
                block
                w-full
                border-b
                border-gray-100
                px-4
                py-3
                text-left
                transition
                hover:bg-gray-50
              "
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {alert.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {alert.campaign_name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {alert.ad_set_name} · {alert.ad_name}
                          </p>
                        </div>

                        <span
                          className="
                    shrink-0
                    rounded-full
                    bg-yellow-100
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    text-yellow-700
                  "
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
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

          {/* Your existing profile dropdown */}
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
