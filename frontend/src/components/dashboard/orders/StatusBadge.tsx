import { ChevronDown } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  isOpen?: boolean;
  onClick?: () => void;
}

export function StatusBadge({ status, isOpen, onClick }: StatusBadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors focus:outline-none";

  const renderContent = (dotColor: string, label: string) => (
    <>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{label}</span>
      <ChevronDown
        className={`w-3.5 h-3.5 ml-0.5 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </>
  );

  let content;
  switch (status) {
    case "expédiée":
      content = renderContent("bg-purple-600", "Expédiée");
      break;
    case "en_préparation":
      content = renderContent("bg-amber-500", "En préparation");
      break;
    case "livrée":
      content = renderContent("bg-emerald-500", "Livrée");
      break;
    case "en_attente":
      content = renderContent("bg-blue-500", "En attente");
      break;
    case "annulée":
      content = renderContent("bg-rose-500", "Annulée");
      break;
    default:
      content = renderContent("bg-gray-400", status);
      break;
  }

  const colorClass = (() => {
    switch (status) {
      case "expédiée":
        return "bg-purple-50 text-purple-700 hover:bg-purple-100";
      case "en_préparation":
        return "bg-amber-50 text-amber-700 hover:bg-amber-100";
      case "livrée":
        return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
      case "en_attente":
        return "bg-blue-50 text-blue-700 hover:bg-blue-100";
      case "annulée":
        return "bg-rose-50 text-rose-700 hover:bg-rose-100";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
  })();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${colorClass}`}
      title="Modifier le statut"
    >
      {content}
    </button>
  );
}
