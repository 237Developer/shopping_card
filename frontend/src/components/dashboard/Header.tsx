"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { ManageUsersModal } from "./ManageUsersModal";

interface UserProfile {
  name: string;
  role: string;
  permissions: number;
}

interface HeaderProps {
  user: UserProfile;
}

export function Header({ user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    user.role === "admin"
      ? "Administrateur"
      : user.role === "manager"
        ? "Gestionnaire"
        : "Observateur";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 shrink-0 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Search Bar */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Rechercher un produit, une commande..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0475FE]/20 focus:border-[#0475FE] transition-all"
        />
      </div>

      {/* Right User & Notification Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Trigger & Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#0475FE] text-white font-semibold flex items-center justify-center text-sm shadow-sm">
              {initials || "US"}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <span>{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </button>

          <UserProfileDropdown
            user={user}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onOpenManageUsers={() => setIsManageUsersOpen(true)}
          />
        </div>
      </div>

      <ManageUsersModal
        isOpen={isManageUsersOpen}
        onClose={() => setIsManageUsersOpen(false)}
      />
    </header>
  );
}
