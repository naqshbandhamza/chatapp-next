"use client";

import { useEffect, useState } from "react";

type ConnectionStatus = "online" | "offline" | "reconnecting";

interface ConnectionStatusProps {
  status: ConnectionStatus;
}

export default function ConnectionStatus({
  status,
}: ConnectionStatusProps) {
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    if (status === "online") {
      setShowOnline(true);

      const timeout = setTimeout(() => {
        setShowOnline(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    if (status === "offline") {
      setShowOnline(false);
    }
  }, [status]);

  if (status === "offline") {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 px-4 py-2 text-center text-sm font-medium text-white">
        You are offline
      </div>
    );
  }

  if (status === "online" && showOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-green-600 px-4 py-2 text-center text-sm font-medium text-white">
        Back online
      </div>
    );
  }

  if (status === "reconnecting") {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-white">
        Reconnecting...
      </div>
    );
  }

  return null;
}
