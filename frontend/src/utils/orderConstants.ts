export interface DropdownOption {
  value: string;
  label: string;
}

export const STATUS_OPTIONS: DropdownOption[] = [
  { value: "Tous les statuts", label: "Tous les statuts" },
  { value: "en_préparation", label: "En préparation" },
  { value: "expédiée", label: "Expédiée" },
  { value: "livrée", label: "Livrée" },
  { value: "annulée", label: "Annulée" },
];

export const FREQUENCY_OPTIONS: DropdownOption[] = [
  "Toutes les fréquences",
  "Aujourd'hui",
  "Cette semaine",
  "Ce mois",
].map((v) => ({ value: v, label: v }));

export const SORT_OPTIONS: DropdownOption[] = [
  "Plus récents",
  "Plus ancien",
  "Plus élevé",
  "Moins élevé",
].map((v) => ({ value: v, label: v }));
