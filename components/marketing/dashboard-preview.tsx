// Placeholder for the hero's product shot. Swap the mock below for an actual
// WattPe dashboard screenshot (e.g. an <Image> of a captured PNG) — the outer
// device frame can wrap a real screenshot without further layout changes.
const DISCOMS = [
  { code: "BES", label: "BESCOM", color: "var(--brand-green)" },
  { code: "MSE", label: "MSEDCL", color: "var(--brand-navy-light)" },
  { code: "AEM", label: "Adani Mumbai", color: "var(--brand-teal)" },
];

export function DashboardPreview() {
  const bars = [38, 55, 46, 70, 62, 88, 78];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="[transform:rotate(-6deg)]">
        <div className="rounded-2xl border border-white/10 bg-[#0f1730] p-4 shadow-[0_40px_90px_rgba(0,0,0,0.5)] sm:p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-white uppercase">
              WattPe Dashboard
            </span>
            <span className="bg-brand-green size-2 rounded-full shadow-[0_0_0_3px_rgba(245,121,58,0.3)]" />
          </div>

          <div className="from-brand-green/20 to-brand-teal/15 relative mb-3 h-[104px] overflow-hidden rounded-xl bg-gradient-to-br">
            <span className="absolute top-2 right-2 rounded-full bg-white/15 px-2 py-0.5 text-[9px] text-white">
              Live
            </span>
            <p className="absolute bottom-2 left-2.5 text-[10px] font-semibold text-white">
              Bellandur 250
              <span className="block font-normal text-white/55">
                Bengaluru, Karnataka
              </span>
            </p>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2.5">
            <div className="border-brand-green/30 bg-brand-green/15 rounded-lg border p-2.5">
              <p className="font-mono text-base font-bold text-white">
                ₹4,820
              </p>
              <p className="mt-0.5 text-[9px] tracking-wide text-white/55 uppercase">
                Saved this month
              </p>
            </div>
            <div className="border-brand-teal/40 bg-brand-teal/15 rounded-lg border p-2.5">
              <p className="font-mono text-base font-bold text-white">
                312 kWh
              </p>
              <p className="mt-0.5 text-[9px] tracking-wide text-white/55 uppercase">
                Credits generated
              </p>
            </div>
          </div>

          <div className="mb-3 flex h-16 items-end gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2.5">
            {bars.map((height, i) => (
              <div
                key={i}
                className="from-brand-green-hover to-brand-green flex-1 rounded-sm bg-gradient-to-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-2 py-2.5">
            {DISCOMS.map((d) => (
              <div key={d.code} className="flex-1 text-center">
                <div
                  className="mx-auto mb-1 flex size-6 items-center justify-center rounded-full text-[7px] font-extrabold text-white"
                  style={{ backgroundColor: d.color }}
                >
                  {d.code}
                </div>
                <p className="m-0 text-[7.5px] text-white/55">{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-brand-green/20 absolute top-[14%] -left-[12%] hidden items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] sm:flex">
        <span className="bg-brand-green/15 flex size-7 items-center justify-center rounded-lg text-sm">
          ⚡
        </span>
        <div>
          <p className="text-brand-void/60 m-0 text-[9px]">Reserved</p>
          <p className="text-brand-void m-0 text-sm font-bold">4.6 kW</p>
        </div>
      </div>

      <div className="border-brand-teal/25 absolute -right-[12%] bottom-[26%] hidden items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] sm:flex">
        <span className="bg-brand-teal/15 flex size-7 items-center justify-center rounded-lg text-sm">
          📈
        </span>
        <div>
          <p className="text-brand-void/60 m-0 text-[9px]">15-yr savings</p>
          <p className="text-brand-void m-0 text-sm font-bold">₹4.1L</p>
        </div>
      </div>
    </div>
  );
}
