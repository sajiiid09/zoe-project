import { AppContainer } from "@/components/layout/AppContainer";
import { PageIntro } from "@/components/layout/PageIntro";
import { Skeleton } from "@/components/ui/Skeleton";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <AppContainer>
      <PageIntro
        title="Product Detail Scaffold"
        description={`PDP route initialized for ${slug.replaceAll("-", " ")}. Business data wiring is intentionally deferred.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Product" }]}
      />
      <section className="pdp-shell">
        <Skeleton className="pdp-image" />
        <div className="pdp-info">
          <Skeleton className="line-lg" />
          <Skeleton className="line-md" />
          <Skeleton className="line-sm" />
        </div>
      </section>
    </AppContainer>
  );
}
