const ITEMS = [
  "CADT",
  "EHT",
  "IMSE",
  "PSE-WMAD",
  "Trusted by Cambodian Students",
];

// 3 copies → CSS animation scrolls to -33.333% (= 1 full set) for a seamless loop
const REPEATED = [...ITEMS, ...ITEMS, ...ITEMS];

export default function TrustBar() {
  return (
    <div className="bg-[#080C14] py-4 overflow-hidden">
      <div
        className="flex gap-12 w-max"
        style={{ animation: "trustbar-scroll 20s linear infinite" }}
      >
        {REPEATED.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-[13px] font-bold tracking-[2px] uppercase text-white whitespace-nowrap"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes trustbar-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
