export type RevenuePoint = {
  label: string;
  value: number;
};

export type TransactionRowView = {
  id: string;
  placedAtLabel: string;
  timestamp: number;
  itemCount: number;
  total: number;
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
};

export type StatusBreakdownItem = {
  label: string;
  value: number;
  tone: "neutral" | "info" | "success" | "danger";
};

export type SnapshotCardModel = {
  title: string;
  value: string;
  hint: string;
  href: string;
};
