import type { CustomerOrder } from "@/types/purchase";
import type { RevenuePoint, SnapshotCardModel, StatusBreakdownItem, TransactionRowView } from "@/types/analytics";

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const fullFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const safeDate = (raw: string) => {
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildTransactions = (orders: CustomerOrder[]): TransactionRowView[] => {
  return orders
    .map((order) => {
      const date = safeDate(order.placedAt);
      return {
        id: order.id,
        placedAtLabel: date ? fullFormatter.format(date) : "Unknown",
        timestamp: date?.getTime() ?? 0,
        itemCount: order.items.length,
        total: order.pricing.total,
        status: order.status,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const buildRevenueTrend = (orders: CustomerOrder[], windowDays = 10): RevenuePoint[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slots = Array.from({ length: windowDays }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (windowDays - index - 1));
    return {
      key: date.toISOString().slice(0, 10),
      label: dayFormatter.format(date),
      value: 0,
    };
  });

  const indexByKey = new Map(slots.map((slot, index) => [slot.key, index]));
  orders.forEach((order) => {
    const date = safeDate(order.placedAt);
    if (!date) return;
    date.setHours(0, 0, 0, 0);
    const index = indexByKey.get(date.toISOString().slice(0, 10));
    if (index === undefined) return;
    slots[index].value += order.pricing.total;
  });

  return slots.map(({ label, value }) => ({ label, value: Number(value.toFixed(2)) }));
};

export const buildStatusBreakdown = (orders: CustomerOrder[]): StatusBreakdownItem[] => {
  const counts = new Map<CustomerOrder["status"], number>();
  orders.forEach((order) => {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  });

  return [
    { label: "Delivered", value: counts.get("delivered") ?? 0, tone: "success" },
    { label: "In transit", value: (counts.get("processing") ?? 0) + (counts.get("shipped") ?? 0), tone: "info" },
    { label: "Placed", value: counts.get("placed") ?? 0, tone: "neutral" },
    { label: "Cancelled", value: counts.get("cancelled") ?? 0, tone: "danger" },
  ];
};

export const sumRevenue = (orders: CustomerOrder[]) => orders.reduce((sum, order) => sum + order.pricing.total, 0);

export const sumDeliveredRevenue = (orders: CustomerOrder[]) =>
  orders
    .filter((order) => order.status === "delivered" || order.status === "shipped")
    .reduce((sum, order) => sum + order.pricing.total, 0);

export const sumCancelledValue = (orders: CustomerOrder[]) =>
  orders.filter((order) => order.status === "cancelled").reduce((sum, order) => sum + order.pricing.total, 0);

export const buildRevenueSummary = (orders: CustomerOrder[]) => {
  const gross = sumRevenue(orders);
  const completed = sumDeliveredRevenue(orders);
  const cancelled = sumCancelledValue(orders);
  const averageOrderValue = orders.length ? gross / orders.length : 0;
  return {
    gross,
    completed,
    cancelled,
    averageOrderValue,
  };
};

export const buildAdminSnapshots = ({
  users,
  pendingApprovals,
  pendingSubmissions,
  orders,
  products,
  catalog,
  grossRevenue,
}: {
  users: number;
  pendingApprovals: number;
  pendingSubmissions: number;
  orders: number;
  products: number;
  catalog: number;
  grossRevenue: number;
}): SnapshotCardModel[] => [
  { title: "Approvals", value: String(pendingApprovals), hint: "Awaiting review", href: "/admin/approvals" },
  { title: "Users", value: String(users), hint: "Registered accounts", href: "/admin/users" },
  { title: "Products", value: String(products), hint: "Vendor product queue", href: "/admin/products" },
  { title: "Submissions", value: String(pendingSubmissions), hint: "Pending migration items", href: "/admin/submissions" },
  { title: "Catalog", value: String(catalog), hint: "Managed catalog items", href: "/admin/catalog" },
  { title: "Orders", value: String(orders), hint: "All marketplace orders", href: "/admin/orders" },
  { title: "Transactions", value: String(orders), hint: "Payment events mirrored from orders", href: "/admin/transactions" },
  { title: "Revenue", value: `$${grossRevenue.toFixed(0)}`, hint: "Open analytics view", href: "/admin/revenue" },
];
