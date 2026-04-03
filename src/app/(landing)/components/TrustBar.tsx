"use client";

export default function TrustBar() {
  const items = [
    "CADT",
    "EHT",
    "IMSE",
    "PSE-WMAD",
    "Trusted by Cambodian Students",
  ];

  return (
    <>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 20s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="bg-[#080C14] py-4 overflow-hidden flex">
        <div className="marquee-track flex gap-12 whitespace-nowrap min-w-max">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-12 text-[13px] font-bold tracking-[2px] uppercase text-white"
            >
              {item}
              <span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
