const items = [
  "Kerbside pickup",
  "Delivery",
  "Takeaway",
  "Dine-in",
  "Quick bite",
  "Small plates",
  "Vegetarian options",
  "Table service",
  "Casual & Trendy",
  "Good for kids",
  "Free parking",
  "NFC payments",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-[#0F0F0F] py-4">
      <div className="flex w-max animate-marquee gap-3 whitespace-nowrap text-sm font-medium text-white/80 hover:[animation-play-state:paused] sm:text-base">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="flex items-center gap-3">
            {item}
            <span className="text-[#D4AF37]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
