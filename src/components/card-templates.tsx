import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CardTemplate {
  id: string;
  name: string;
  bgStyle: (colors: { primary: string; accent: string }) => React.CSSProperties;
  textClass: string;
  font: string;
  defaultPrimary: string;
  defaultAccent: string;
  preview: string; // short description
}

export const cardTemplates: CardTemplate[] = [
  {
    id: "gradient",
    name: "Gradient",
    bgStyle: ({ primary, accent }) => ({
      background: `linear-gradient(135deg, ${primary}, ${accent})`,
    }),
    textClass: "text-white",
    font: "Plus Jakarta Sans",
    defaultPrimary: "#3B82F6",
    defaultAccent: "#8B5CF6",
    preview: "Bold gradient blend",
  },
  {
    id: "dark",
    name: "Dark Elite",
    bgStyle: ({ primary }) => ({
      background: `linear-gradient(160deg, #0f172a, #1e293b)`,
      borderLeft: `4px solid ${primary}`,
    }),
    textClass: "text-white",
    font: "Inter",
    defaultPrimary: "#22d3ee",
    defaultAccent: "#0f172a",
    preview: "Sleek dark mode",
  },
  {
    id: "minimal",
    name: "Minimal",
    bgStyle: ({ primary }) => ({
      background: "#ffffff",
      borderBottom: `3px solid ${primary}`,
    }),
    textClass: "text-gray-900",
    font: "Inter",
    defaultPrimary: "#0f172a",
    defaultAccent: "#64748b",
    preview: "Clean & simple",
  },
  {
    id: "corporate",
    name: "Corporate",
    bgStyle: ({ primary }) => ({
      background: `linear-gradient(180deg, ${primary} 0%, ${primary}dd 100%)`,
    }),
    textClass: "text-white",
    font: "Plus Jakarta Sans",
    defaultPrimary: "#1e3a5f",
    defaultAccent: "#2563eb",
    preview: "Professional look",
  },
  {
    id: "sunset",
    name: "Sunset",
    bgStyle: () => ({
      background: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)",
    }),
    textClass: "text-white",
    font: "Plus Jakarta Sans",
    defaultPrimary: "#f97316",
    defaultAccent: "#ec4899",
    preview: "Warm & vibrant",
  },
  {
    id: "glass",
    name: "Glassmorphism",
    bgStyle: ({ primary }) => ({
      background: `linear-gradient(135deg, ${primary}22, ${primary}44)`,
      backdropFilter: "blur(20px)",
      border: `1px solid ${primary}33`,
    }),
    textClass: "text-foreground",
    font: "Inter",
    defaultPrimary: "#6366f1",
    defaultAccent: "#a78bfa",
    preview: "Frosted glass effect",
  },
  {
    id: "zigzag",
    name: "Zigzag Pattern",
    bgStyle: ({ primary }) => ({
      background: `${primary}`,
      backgroundImage: `linear-gradient(135deg, ${primary}cc 25%, transparent 25%), linear-gradient(225deg, ${primary}cc 25%, transparent 25%), linear-gradient(45deg, ${primary}cc 25%, transparent 25%), linear-gradient(315deg, ${primary}cc 25%, transparent 25%)`,
      backgroundSize: "20px 20px",
      backgroundPosition: "10px 0, 10px 0, 0 0, 0 0",
    }),
    textClass: "text-white",
    font: "Inter",
    defaultPrimary: "#6b7280",
    defaultAccent: "#9ca3af",
    preview: "Geometric zigzag",
  },
  {
    id: "neon",
    name: "Neon Glow",
    bgStyle: ({ primary }) => ({
      background: "#0a0a0a",
      boxShadow: `inset 0 0 60px ${primary}33, 0 0 20px ${primary}22`,
      border: `1px solid ${primary}66`,
    }),
    textClass: "text-white",
    font: "Plus Jakarta Sans",
    defaultPrimary: "#00ff88",
    defaultAccent: "#00cc66",
    preview: "Cyberpunk neon",
  },
  {
    id: "pastel",
    name: "Pastel Dream",
    bgStyle: ({ primary, accent }) => ({
      background: `linear-gradient(135deg, ${primary}40, ${accent}40, #fde68a40)`,
    }),
    textClass: "text-gray-800",
    font: "Georgia",
    defaultPrimary: "#f9a8d4",
    defaultAccent: "#a5b4fc",
    preview: "Soft pastel tones",
  },
  {
    id: "marble",
    name: "Marble",
    bgStyle: () => ({
      background: "linear-gradient(135deg, #f5f5f4, #e7e5e4, #d6d3d1, #e7e5e4, #f5f5f4)",
      backgroundSize: "400% 400%",
    }),
    textClass: "text-gray-900",
    font: "Georgia",
    defaultPrimary: "#78716c",
    defaultAccent: "#a8a29e",
    preview: "Elegant marble",
  },
  {
    id: "aurora",
    name: "Aurora",
    bgStyle: () => ({
      background: "linear-gradient(135deg, #0f172a, #1e3a5f, #065f46, #1e3a5f, #4c1d95)",
    }),
    textClass: "text-white",
    font: "Plus Jakarta Sans",
    defaultPrimary: "#34d399",
    defaultAccent: "#818cf8",
    preview: "Northern lights",
  },
  {
    id: "golden",
    name: "Golden Luxury",
    bgStyle: () => ({
      background: "linear-gradient(135deg, #1a1a2e, #16213e)",
      borderBottom: "3px solid #d4a847",
    }),
    textClass: "text-white",
    font: "Georgia",
    defaultPrimary: "#d4a847",
    defaultAccent: "#f0c35c",
    preview: "Premium gold accent",
  },
];

interface CardTemplatePickerProps {
  selected: string;
  onSelect: (template: CardTemplate) => void;
}

export function CardTemplatePicker({ selected, onSelect }: CardTemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cardTemplates.map((t) => {
        const isActive = selected === t.id;
        const style = t.bgStyle({ primary: t.defaultPrimary, accent: t.defaultAccent });
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={cn(
              "relative rounded-xl p-4 text-left transition-all h-28 flex flex-col justify-between overflow-hidden group",
              isActive
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
                : "hover:scale-[1.02] hover:shadow-md"
            )}
            style={style}
          >
            {isActive && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <span className={cn("text-xs font-bold uppercase tracking-wider opacity-80", t.textClass)}>
              {t.name}
            </span>
            <span className={cn("text-[10px] opacity-60", t.textClass)}>{t.preview}</span>
          </button>
        );
      })}
    </div>
  );
}

interface CardPreviewRendererProps {
  template: CardTemplate;
  card: { name: string; company: string; designation: string; phone: string; email: string };
  colors: { primary: string; accent: string };
  font?: string;
  showSocial?: boolean;
  rounded?: boolean;
}

export function CardPreviewRenderer({
  template,
  card,
  colors,
  font,
  showSocial = true,
  rounded = true,
}: CardPreviewRendererProps) {
  const style = template.bgStyle(colors);
  const displayFont = font || template.font;

  return (
    <div
      className={cn("p-6 min-h-[200px] flex flex-col justify-between", rounded ? "rounded-xl" : "")}
      style={{ ...style, fontFamily: displayFont }}
    >
      <div>
        <p className={cn("text-xs opacity-80 uppercase tracking-wider", template.textClass)}>
          {card.company}
        </p>
        <p className={cn("text-xl font-bold mt-2", template.textClass)}>{card.name}</p>
        <p className={cn("text-sm opacity-80", template.textClass)}>{card.designation}</p>
      </div>
      <div className={cn("space-y-1 text-sm opacity-80", template.textClass)}>
        <p>{card.phone}</p>
        <p>{card.email}</p>
        {showSocial && <p className="text-xs mt-2 opacity-60">LinkedIn · Twitter · Website</p>}
      </div>
    </div>
  );
}
