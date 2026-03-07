import { cn } from "@/lib/utils/cn";

type TabItem = {
  label: string;
  active?: boolean;
};

export const Tabs = ({ items }: { items: TabItem[] }) => (
  <div className="tabs" role="tablist" aria-label="Content sections">
    {items.map((item) => (
      <button key={item.label} type="button" role="tab" className={cn("tab", item.active && "tab-active")}>
        {item.label}
      </button>
    ))}
  </div>
);
