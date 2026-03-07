import { Button } from "@/components/ui/Button";

export const ErrorState = ({ title = "Something went wrong" }: { title?: string }) => (
  <section className="state-box state-error" role="alert">
    <h2>{title}</h2>
    <p>Please try again. If the issue persists, contact support.</p>
    <Button>Retry</Button>
  </section>
);
