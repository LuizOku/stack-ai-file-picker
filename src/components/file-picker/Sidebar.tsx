"use client";

import { cn } from "@/utils/tailwind";
import { Connection } from "@/shared/connection";
import { useApp } from "@/stores/useApp";
import { useEffect } from "react";

interface SidebarProps {
  connections: Connection[];
}

export function Sidebar({ connections }: SidebarProps) {
  const { selectedIntegration, setSelectedIntegration } = useApp();

  useEffect(() => {
    if (connections.length > 0) {
      setSelectedIntegration(connections[0].connection_id);
    }
  }, [connections, setSelectedIntegration]);

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-sm font-semibold">Integrations</h2>
        <div className="flex flex-col gap-1">
          {connections.map((connection) => (
            <button
              key={connection.connection_id}
              onClick={() => setSelectedIntegration(connection.connection_id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                selectedIntegration === connection.connection_id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              )}
            >
              {connection.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
