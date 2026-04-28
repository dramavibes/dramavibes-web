import {
    // Pacing
    Snail, Turtle, Rabbit,
    // Emotional weight
    Smile, Meh, Frown,
    // Romance
    Heart, HeartOff,
    // Comfort
    Coffee, Flame, CloudRain,
    // Ending
    CircleDot, Laugh, HeartCrack,
    // Sun, Sunset, 
} from "lucide-react";

const BADGE_TEXT_SIZE = 12.5

// --- Pacing ------------------------------------------------------------------

const PACING_CONFIG = {
    slow:    { icon: Snail,  classes: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/18 dark:text-indigo-300" },
    steady:  { icon: Turtle, classes: "bg-sky-100    text-sky-700    dark:bg-sky-500/15    dark:text-sky-300"    },
    fast:    { icon: Rabbit, classes: "bg-cyan-100   text-cyan-700   dark:bg-cyan-500/15   dark:text-cyan-300"   },
    unknown: { icon: Meh,    classes: "bg-zinc-100   text-zinc-500   dark:bg-zinc-500/15   dark:text-zinc-400"   },
};

// --- Emotional Weight ---------------------------------------------------------

const EMOTIONAL_CONFIG = {
    light:    { icon: Smile, classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
    moderate: { icon: Meh,   classes: "bg-amber-100   text-amber-700   dark:bg-amber-500/15   dark:text-amber-300"   },
    heavy:    { icon: Frown, classes: "bg-purple-100  text-purple-700  dark:bg-purple-500/18  dark:text-purple-300"  },
    unknown:  { icon: Meh,   classes: "bg-zinc-100    text-zinc-500    dark:bg-zinc-500/15    dark:text-zinc-400"    },
};
// --- Romance Level ------------------------------------------------------------

const ROMANCE_CONFIG = {
    none:    { icon: HeartOff, classes: "bg-zinc-100  text-zinc-500   dark:bg-zinc-500/15  dark:text-zinc-400",  filled: false, label: "No Romance" },
    low:     { icon: Heart,    classes: "bg-zinc-100  text-zinc-500   dark:bg-zinc-500/15  dark:text-zinc-400",  filled: false, label: "Low Romance" },
    medium:  { icon: Heart,    classes: "bg-pink-100  text-pink-700   dark:bg-pink-500/18  dark:text-pink-300",  filled: false, label: "Medium Romance"},
    high:    { icon: Heart,    classes: "bg-rose-100  text-rose-700   dark:bg-rose-500/25  dark:text-rose-300",  filled: true , label: "High Romance" },
    unknown: { icon: HeartOff, classes: "bg-zinc-100  text-zinc-500   dark:bg-zinc-500/15  dark:text-zinc-400",  filled: false, },
};

// --- Comfort Level ------------------------------------------------------------

const COMFORT_CONFIG = {
    healing:   { icon: Coffee,    classes: "bg-teal-100    text-teal-700    dark:bg-teal-500/15    dark:text-teal-300"    },
    relaxing:  { icon: Coffee,    classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
    stressful: { icon: Flame,     classes: "bg-orange-100  text-orange-700  dark:bg-orange-500/18  dark:text-orange-300"  },
    draining:  { icon: CloudRain, classes: "bg-slate-200   text-slate-700   dark:bg-slate-500/25   dark:text-slate-300"   },
    unknown:   { icon: Meh,       classes: "bg-zinc-100    text-zinc-500    dark:bg-zinc-500/15    dark:text-zinc-400"    },
};


// --- Ending Type --------------------------------------------------------------

const ENDING_CONFIG = {
    happy:       { icon: Smile,      classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300", label: "Happy Ending"      },
    bittersweet: { icon: HeartCrack, classes: "bg-blue-100   text-blue-700   dark:bg-blue-500/18   dark:text-blue-300",   label: "Bittersweet Ending" },
    sad:         { icon: Frown,      classes: "bg-slate-100  text-slate-700  dark:bg-slate-500/20  dark:text-slate-300",  label: "Sad Ending"         },
    open:        { icon: CircleDot,  classes: "bg-zinc-100   text-zinc-500   dark:bg-zinc-500/15   dark:text-zinc-400",   label: "Open Ended"         },
    unknown:     { icon: Meh,        classes: "bg-zinc-100   text-zinc-500   dark:bg-zinc-500/15   dark:text-zinc-400",   label: "Unknown Ending"     },
};

// --- Tones --------------------------------------------------------------------

const TONE_CLASSES = {
    lighthearted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/12 dark:text-yellow-300",
    heartwarming: "bg-pink-100   text-pink-700   dark:bg-pink-500/12   dark:text-pink-300",
    melancholic:  "bg-violet-100 text-violet-700 dark:bg-violet-500/18 dark:text-violet-300",
    dark:         "bg-slate-100  text-slate-700  dark:bg-slate-500/18  dark:text-slate-300",
    gritty:       "bg-stone-100  text-stone-700  dark:bg-stone-500/18  dark:text-stone-300",
    suspenseful:  "bg-red-100    text-red-700    dark:bg-red-500/15    dark:text-red-300",
    intense:      "bg-orange-100 text-orange-700 dark:bg-orange-500/18 dark:text-orange-300",
    cerebral:     "bg-blue-100   text-blue-700   dark:bg-blue-500/15   dark:text-blue-300",
    satirical:    "bg-lime-100   text-lime-700   dark:bg-lime-500/15   dark:text-lime-300",
};

const getToneClasses = (tone) => {
    return TONE_CLASSES[tone?.toLowerCase()] ?? "bg-zinc-500/15 text-zinc-400";
}

// --- Category config lookup ---------------------------------------------------

const CATEGORY_CONFIG = {
    pacing:           PACING_CONFIG,
    emotional_weight: EMOTIONAL_CONFIG,
    romance_level:    ROMANCE_CONFIG,
    comfort_level:    COMFORT_CONFIG,
    ending_type:      ENDING_CONFIG,
};


// --- BaseTagBadge (generic) -------------------------------------------------------
// Generic colored text chip — for tones, genres, plain tags.

export function BaseTagBadge({ children, className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 pb-[5px] pt-[4px] rounded-full
        text-[${BADGE_TEXT_SIZE}px] font-medium leading-none capitalize
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// --- ToneBadge ----------------------------------------------------------------
// Tone chip - get colors from TONE_CLASSES.

export function ToneBadge({ tone, className }) {
    return <BaseTagBadge className={getToneClasses(tone) + " " + className}>
        {tone}
    </BaseTagBadge>;
}

// --- VibeBadge ----------------------------------------------------------------

// Icon + value chip for a vibe category.
// icon communicates the category, chip communicates the value.
// Returns null for unknown/missing values to keep cards clean.

export function VibeBadge({ category, value }) {
    const config = CATEGORY_CONFIG[category];
    if (!config) return null;

    const v = value?.toLowerCase() ?? "unknown";
    const entry = config[v] ?? config["unknown"];
    if (!entry) return null;

    // Skip rendering unknown values entirely — keeps the card clean
    if (v === "unknown" && category!="ending_type") return null;

    const IconComponent = entry.icon;
    // const isFilled = category === "romance_level" && entry.filled;
    const isFilled = entry.filled;

    return (
        <BaseTagBadge className={entry.classes}>
            <IconComponent
                size={BADGE_TEXT_SIZE}
                strokeWidth={2}
                fill={isFilled ? "currentColor" : "none"}
                className="shrink-0"
            />
            {entry.label || value}
        </BaseTagBadge>
    );
}

// --- MatchScoreBadge ----------------------------------------------------------

// Semantic search match % badge with red -> amber -> lime -> green color ramp.
// Returns null when score is absent (classic search results).
// param: score between 0-1

export function MatchScoreBadge({ score }) {
    if (score == null) return null;

    const pct = Math.round(score * 100);

   const colorClass =
        pct >= 85 ? "bg-emerald-500/80 text-white ring-1 ring-emerald-400/50" :
        pct >= 70 ? "bg-lime-500/80    text-white ring-1 ring-lime-400/50"    :
        pct >= 50 ? "bg-amber-500/80   text-white ring-1 ring-amber-400/50"   :
                    "bg-red-500/80     text-red-100     ring-1 ring-red-400/50";
    return (
        <span
        className={`
            inline-flex items-center px-2 py-0.5 rounded-full
            text-[12.5px] font-semibold leading-none tabular-nums
            ${colorClass}
        `}
        >
        {pct}% match
        </span>
    );
}

// const toTitleCase = (str) => {
//     if (!str) return "";
//     return str
//         .split(/[\s_-]+/)        // split on spaces, underscores, hyphens
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
// }