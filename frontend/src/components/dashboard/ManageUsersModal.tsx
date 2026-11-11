"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Trash2, Shield, Check, AlertCircle } from "lucide-react";
import {
  getUsersListAction,
  getRolesListAction,
  createUserAction,
  deleteUserAction,
  updateRolePermissionsAction,
} from "@/lib/dashboard/actions/dashboard/user";

interface UserItem {
  id: string;
  name: string;
  roleId: number;
  roleName: string;
  permissions: number;
}

interface RoleItem {
  id: number;
  name: string;
  permissions: number;
}

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PERMISSION_OPTIONS = [
  { bit: 1, label: "Voir le tableau de bord" },
  { bit: 2, label: "Gérer les produits" },
  { bit: 4, label: "Supprimer des produits" },
  { bit: 8, label: "Gérer les commandes" },
  { bit: 16, label: "Annuler des commandes" },
  { bit: 32, label: "Gérer les promotions" },
  { bit: 64, label: "Gérer les clients" },
  // MANAGE_USERS (128) is intentionally excluded as requested.
];

export function ManageUsersModal({ isOpen, onClose }: ManageUsersModalProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Add user form state
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState<number>(2); // default manager
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit user role / permissions state
  const [currentRoleId, setCurrentRoleId] = useState<number>(2);
  const [currentPermissions, setCurrentPermissions] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      Promise.all([getUsersListAction(), getRolesListAction()]).then(
        ([fetchedUsers, fetchedRoles]) => {
          if (isMounted) {
            setUsers(fetchedUsers);
            setRoles(fetchedRoles);
            setIsLoading(false);
          }
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const refreshData = async () => {
    const [fetchedUsers, fetchedRoles] = await Promise.all([
      getUsersListAction(),
      getRolesListAction(),
    ]);
    setUsers(fetchedUsers);
    setRoles(fetchedRoles);
  };

  const handleSelectUser = (user: UserItem) => {
    setSelectedUser(user);
    setCurrentRoleId(user.roleId);
    setCurrentPermissions(user.permissions);
    setIsAddingUser(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleRoleChange = (roleIdNum: number) => {
    setCurrentRoleId(roleIdNum);
    const foundRole = roles.find((r) => r.id === roleIdNum);
    if (foundRole) {
      setCurrentPermissions(foundRole.permissions);
    }
  };

  const handlePermissionToggle = (bit: number) => {
    if ((currentPermissions & bit) === bit) {
      setCurrentPermissions(currentPermissions & ~bit);
    } else {
      setCurrentPermissions(currentPermissions | bit);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setErrorMsg("");
    setSuccessMsg("");

    const res = await updateRolePermissionsAction(currentRoleId, currentPermissions);
    if (res.success) {
      setSuccessMsg("Permissions mises à jour avec succès.");
      refreshData();
    } else {
      setErrorMsg(res.error || "Erreur lors de la mise à jour");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newName || !newPassword) {
      setErrorMsg("Veuillez remplir tous les champs.");
      return;
    }

    const res = await createUserAction({
      name: newName,
      password: newPassword,
      roleId: Number(newRoleId),
    });

    if (res.success) {
      setSuccessMsg("Utilisateur créé avec succès.");
      setNewName("");
      setNewPassword("");
      setIsAddingUser(false);
      refreshData();
    } else {
      setErrorMsg(res.error || "Erreur lors de la création");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    const res = await deleteUserAction(userId);
    if (res.success) {
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      refreshData();
    } else {
      alert(res.error || "Erreur lors de la suppression");
    }
  };

  const assignableRoles = roles.filter((r) => r.name !== "admin");

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-200"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0475FE]" />
            <h2 className="text-base font-bold text-slate-800">Gestion des utilisateurs et permissions</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Users List */}
          <div className="md:col-span-5 space-y-4 border-r border-slate-100 pr-0 md:pr-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Utilisateurs</h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingUser(true);
                  setSelectedUser(null);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0475FE] text-white rounded-xl text-xs font-semibold hover:bg-[#0362d0] transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-400 text-center py-8">Chargement...</p>
            ) : users.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Aucun utilisateur.</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedUser?.id === u.id
                        ? "border-[#0475FE] bg-blue-50/40 shadow-sm"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{u.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {u.roleName === "admin" ? "Administrateur" : u.roleName === "manager" ? "Gestionnaire" : "Observateur"}
                      </p>
                    </div>
                    {u.roleName !== "admin" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(u.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details / Edit / Create Form */}
          <div className="md:col-span-7 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {isAddingUser ? (
              <form onSubmit={handleCreateUser} className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200" autoComplete="off">
                <h3 className="text-sm font-bold text-slate-800">Ajouter un nouvel utilisateur</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nom complet"
                    autoComplete="off"
                    name="new_user_name_custom"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0475FE]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    name="new_user_password_custom"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0475FE]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle</label>
                  <select
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0475FE]"
                  >
                    {assignableRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name === "manager" ? "Gestionnaire" : "Observateur"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0475FE] hover:bg-[#0362d0] rounded-xl transition-colors"
                  >
                    Créer l&apos;utilisateur
                  </button>
                </div>
              </form>
            ) : selectedUser ? (
              <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Modifier {selectedUser.name}</h3>
                    <p className="text-[11px] text-slate-500">Gestion du rôle et des permissions individuelles</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle</label>
                  <select
                    value={currentRoleId}
                    onChange={(e) => handleRoleChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0475FE]"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name === "admin" ? "Administrateur" : r.name === "manager" ? "Gestionnaire" : "Observateur"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Permissions</label>
                  <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-xl border border-slate-300">
                    {PERMISSION_OPTIONS.map((perm) => {
                      const isChecked = (currentPermissions & perm.bit) === perm.bit;
                      return (
                        <label
                          key={perm.bit}
                          className="flex items-center gap-2.5 text-xs text-slate-900 cursor-pointer select-none hover:bg-slate-50 p-1 rounded-lg transition-colors font-medium"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handlePermissionToggle(perm.bit)}
                            className="w-4 h-4 rounded border-slate-400 text-[#0475FE] focus:ring-[#0475FE]"
                          />
                          <span>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSavePermissions}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0475FE] hover:bg-[#0362d0] rounded-xl transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs bg-slate-50/40 rounded-2xl border border-dashed border-slate-200">
                <Shield className="w-8 h-8 text-slate-300 mb-2" />
                <p>
                  Sélectionnez un utilisateur dans la liste pour modifier son rôle et ses permissions, ou cliquez sur &quot;Ajouter&quot; pour en créer un nouveau.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
