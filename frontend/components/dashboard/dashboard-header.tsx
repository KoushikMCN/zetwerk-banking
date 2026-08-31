interface DashboardHeaderProps {
  email: string;
}

export function DashboardHeader({
  email,
}: DashboardHeaderProps) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2480fd]">
        Dashboard
      </p>

      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-[#020b36]">
        Good to see you.
      </h1>

      <p className="mt-2 text-base text-[#667085]">
        {email}
      </p>
    </section>
  );
}