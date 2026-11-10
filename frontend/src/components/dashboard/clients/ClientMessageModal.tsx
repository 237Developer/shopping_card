"use client";

import { useState, useEffect } from "react";
import { X, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { sendClientMessageAction } from "@/lib/dashboard/actions/dashboard/client";

interface ClientMessageModalProps {
  isOpen: boolean;
  client: { name: string; email: string } | null;
  onClose: () => void;
}

export function ClientMessageModal({
  isOpen,
  client,
  onClose,
}: ClientMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose]);

  if (!isOpen || !client) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = await sendClientMessageAction({
      to: client.email,
      subject,
      message,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage("Message envoyé avec succès !");
      setSubject("");
      setMessage("");
    } else {
      setErrorMessage(result.error || "Erreur lors de l'envoi du message");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 relative">
        {successMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-rose-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">{errorMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0475FE] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Envoyer un message
              </h2>
              <p className="text-xs text-slate-600">
                À :{" "}
                <span className="font-semibold text-slate-800">
                  {client.name}
                </span>{" "}
                ({client.email})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Objet du message
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Suivi de vos commandes chez NyangaMarket"
              className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Rédigez votre message ici..."
              className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0475FE] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Envoi en cours..." : "Envoyer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
