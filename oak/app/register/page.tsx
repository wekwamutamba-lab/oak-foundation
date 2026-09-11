import RegistrationForm from "@/components/RegistrationForm";

const eventStats = [
  { value: "110+", label: "Attendees" },
  { value: "24", label: "Sessions" },
  { value: "38", label: "Partners" },
];

export default function RegisterPage() {
  return (
    <main className="oak-mobile-page">
      <div className="oak-mobile-shell">
        <header className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-oak-muted">
            OAK Zimbabwe Foundation
          </p>
        </header>

        <section className="rounded-oak-card bg-oak-navy p-5 text-white shadow-[var(--oak-shadow-hero)]">
          <h1 className="max-w-[220px] text-2xl font-bold leading-[1.05] tracking-[-0.03em]">
            Partner Convening 2026
          </h1>

          <p className="mt-2 text-xs leading-4 text-white/70">
            Harare · 9–11 November 2026
          </p>
        </section>

        <section
          aria-label="Event statistics"
          className="mt-3 grid grid-cols-3 gap-[10px]"
        >
          {eventStats.map((stat) => (
            <article
              key={stat.label}
              className="min-h-[64px] rounded-[14px] border border-oak-border bg-oak-surface p-[10px] shadow-[var(--oak-shadow-card)]"
            >
              <p className="text-[18px] font-bold leading-5 text-oak-text">
                {stat.value}
              </p>

              <p className="mt-1 text-[10px] leading-3 text-oak-muted">
                {stat.label}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-[14px] rounded-oak-card border border-oak-border bg-oak-surface p-[18px] shadow-[var(--oak-shadow-card)]">
          <h2 className="text-base font-bold leading-5 text-oak-text">
            Registration Form
          </h2>

          <p className="mt-1 text-xs leading-4 text-oak-muted">
            Complete your details to register for the gathering.
          </p>

          <div className="mt-4">
            <RegistrationForm />
          </div>
        </section>

        <footer className="px-1 pb-2 pt-5 text-center text-[10px] leading-4 text-oak-muted">
          9–11 November 2026 · Cresta Lodge, Msasa, Harare
        </footer>
      </div>
    </main>
  );
}