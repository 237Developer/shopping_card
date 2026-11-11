"use client";

import { LogOut, Users } from "lucide-react";
import { logoutAction } from "@/lib/dashboard/auth";
import { useTransition } from "react";

interface UserProfile {
  name: string;
  role: string;
  permissions: number;
}

interface UserProfileDropdownProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenManageUsers: () => void;
}

export function UserProfileDropdown({
  user,
  isOpen,
  onClose,
  onOpenManageUsers,
}: UserProfileDropdownProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-[160px] bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
      {user.role === "admin" && (
        <button
          onClick={() => {
            onClose();
            onOpenManageUsers();
          }}
          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Users className="w-4 h-4 text-[#0475FE]" />
          <span>Gérer utilisateurs</span>
        </button>
      )}

      <button
        onClick={handleLogout}
        disabled={isPending}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        <span>{isPending ? "Déconnexion..." : "Se déconnecter"}</span>
      </button>
    </div>
  );
}
