import { Button } from "@/components/ui/Button";

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: string;
}) => (
  <section className="state-box" aria-live="polite">
    <h2>{title}</h2>
    <p>{description}</p>
    {action ? <Button variant="secondary">{action}</Button> : null}
  </section>
);
