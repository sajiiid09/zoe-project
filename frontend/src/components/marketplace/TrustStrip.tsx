const items = [
  { title: "Fast delivery", text: "Same-day and next-day options in major cities" },
  { title: "Secure payments", text: "Multiple payment methods with protected checkout" },
  { title: "Trusted sellers", text: "Verified stores with customer ratings and reviews" },
  { title: "Easy returns", text: "Hassle-free return windows on eligible products" },
];

export const TrustStrip = () => (
  <section className="trust-strip" aria-label="Reasons to shop">
    {items.map((item) => (
      <article key={item.title}>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </article>
    ))}
  </section>
);
