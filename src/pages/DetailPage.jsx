import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Spinner, Chip, Separator, Button, Link } from "@heroui/react";
import {
    ArrowLeft,
    Star,
    Users,
    Trophy,
    TrendingUp,
    Calendar,
    Clock,
    Tv,
    Globe,
    ExternalLink,
    Film,
    Play, 
    MonitorPlay, 
    SparklesIcon
} from "lucide-react";
import { getDetailsBySlug, getSimilarTitles } from "../services/api";
import { VibeBadge, ToneBadge, BaseTagBadge } from "../components/TagBadge";

import { getMediumSizeImage, truncate } from "../utils";

// --- Platform config ----------------------------------------------------------

const PLATFORM_CONFIG = {
    // Netflix
    Netflix: {
        color: "text-red-500",
        bg: "bg-red-500/10 dark:bg-red-500/20",
    },

    // Prime Video
    "Prime Video": {
        color: "text-sky-500",
        bg: "bg-sky-500/10 dark:bg-sky-500/20",
    },
    "Amazon Prime Video": {
        color: "text-sky-500",
        bg: "bg-sky-500/10 dark:bg-sky-500/20",
    },

    // Disney
    "Disney+": {
        color: "text-indigo-500",
        bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    },
    "Disney+ Hotstar": {
        color: "text-indigo-500",
        bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    },

    // Apple TV+
    "Apple TV+": {
        color: "text-neutral-700 dark:text-neutral-300",
        bg: "bg-neutral-500/10 dark:bg-neutral-500/20",
    },

    // HBO Max
    "HBO Max": {
        color: "text-purple-500",
        bg: "bg-purple-500/10 dark:bg-purple-500/20",
    },

    // Hulu
    Hulu: {
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },

    // Viki
    Viki: {
        color: "text-cyan-500",
        bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    },

    // iQIYI (green brand IRL but slightly toned)
    iQIYI: {
        color: "text-green-500",
        bg: "bg-green-500/10 dark:bg-green-500/20",
    },

    // WeTV
    WeTV: {
        color: "text-orange-500",
        bg: "bg-orange-500/10 dark:bg-orange-500/20",
    },

    // TVING
    TVING: {
        color: "text-rose-500",
        bg: "bg-rose-500/10 dark:bg-rose-500/20",
    },

    // Wavve
    Wavve: {
        color: "text-blue-500",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
    },

    // Kocowa
    Kocowa: {
        color: "text-amber-500",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },

    // iflix
    iflix: {
        color: "text-red-400",
        bg: "bg-red-400/10 dark:bg-red-400/20",
    },

    // Roku
    "Roku Channel": {
        color: "text-fuchsia-500",
        bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    },

    // Tubi
    Tubi: {
        color: "text-orange-400",
        bg: "bg-orange-400/10 dark:bg-orange-400/20",
    },

    // TVer
    TVer: {
        color: "text-blue-400",
        bg: "bg-blue-400/10 dark:bg-blue-400/20",
    },

    // Lemino
    Lemino: {
        color: "text-red-400",
        bg: "bg-red-400/10 dark:bg-red-400/20",
    },

    // KBS World
    "KBS World": {
        color: "text-sky-600",
        bg: "bg-sky-500/10 dark:bg-sky-500/20",
    },

    // SBS
    SBS: {
        color: "text-blue-600",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
};
const getPlatformConfig = (platformName) => {
    return (
        PLATFORM_CONFIG[platformName] || {
            color: "#6b7280",
            bg: "#111827",
            textColor: "#fff",
            icon: <Play size={12} color="#9ca3af" />,
        }
    );
};

// --- Helpers ------------------------------------------------------------------

const safeParseJson = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
        return JSON.parse(val);
    } catch {
        return [];
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatNumber = (n) => {
    if (n == null) return null;
    return new Intl.NumberFormat("en-US").format(n);
};

// --- Sub-components -----------------------------------------------------------

function StatPill({ icon: Icon, label, value }) {
    if (value == null || value === "") return null;
    return (
        <div className="flex items-center gap-1.5 text-sm text-default-foreground/80">
            <Icon size={14} className="text-foreground/50 shrink-0" />
            <span className="text-foreground/50 text-xs">{label}</span>
            <span className="font-medium text-foreground/80">{value}</span>
        </div>
    );
}

function SectionHeading({ children, className }) {
    return (
        <h2 className={`text-xs font-semibold uppercase tracking-widest text-foreground mb-3 ${className}`}>
            {children}
        </h2>
    );
}

function VibeRow({ label, category, value, spoiler=false }) {
    if (!value || value === "unknown") return null;
    return (
        <div className="flex items-center gap-3 py-1.5">
            <span className="text-sm text-foreground/80 w-36 shrink-0">{label}</span>
            {spoiler? 
                <Spoiler>
                    <VibeBadge category={category} value={value} />
                </Spoiler>
                :
                <VibeBadge category={category} value={value} />
            }
        </div>
    );
}

function PlatformButton({ platform, url }) {
    const cfg = getPlatformConfig(platform);

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                transition-all hover:scale-[1.03] active:scale-[0.98]
                ${cfg.bg || "bg-amber-500/10 dark:bg-amber-500/20"}
                text-foreground border border-default
            `}
        >
            <MonitorPlay size={14} className={cfg.color || "text-amber-500"} />
            <span>{platform}</span>
            <ExternalLink size={12} className="text-muted" />
        </a>
    );
}

function Spoiler({ children, warningText="Reveal Spoiler!" }) {
    const [open, setOpen] = useState(false);

    return open ? (
        <span onClick={() => setOpen(false)} className="cursor-pointer">
            {children}
        </span>
    ) : (
        <Button
            onClick={() => setOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs text-muted h-6"
            // className="text-xs text-muted border border-default px-2 py-1 rounded-md cursor-pointer"
        >
            {warningText}
        </Button>
    );
}

function CastInitials({ name }) {
    const initials = name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const colors = [
        "bg-violet-500/30 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
        "bg-sky-500/30 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
        "bg-teal-500/30 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
        "bg-rose-500/30 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
        "bg-amber-500/30 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    ];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div className="flex items-center gap-3">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${color}`}
            >
                {initials}
            </div>
            <span className="text-sm text-foreground/80">{name}</span>
        </div>
    );
}

// --- Main Page ----------------------------------------------------------------

export default function DetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spoilerOpen, setSpoilerOpen] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        getDetailsBySlug(slug)
            .then(setData)
            .catch(() => setError("Couldn't load details. Please try again."))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-foreground/80">{error || "Title not found."}</p>
                <Button variant="flat" onPress={() => navigate(-1)}>
                    Go back
                </Button>
            </div>
        );
    }

    const cast = safeParseJson(data.top_cast);
    const platforms = safeParseJson(data.where_to_watch);
    const alsoKnownAs = data.also_known_as || [];
    const genres = data.genres || [];
    const tags = data.tags || [];
    const tones = data.tones || [];
    const themes = data.themes || [];

    const mainCast = cast.filter((c) => c.type === "Main Role");
    const supportCast = cast.filter((c) => c.type === "Support Role");

    const mdlUrl = `https://mydramalist.com/${slug}`;

    const airedRange =
        data.type === "Movie" || (data.aired_start_date == data.aired_end_date)
            ? formatDate(data.aired_start_date)
            : data.aired_start_date
                ? `${formatDate(data.aired_start_date)}${data.aired_end_date
                    ? ` - ${formatDate(data.aired_end_date)}`
                    : ""
                }`
                : null;

    const hasVibes =
        data.pacing || data.romance_level || data.comfort_level || data.emotional_weight || data.ending_type;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-2">
            {/* Back nav */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground/90 transition-colors mb-8 group cursor-pointer"
            >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to results
            </button>

            {/* -- Hero ----------------------------------------------------------- */}
            <div className="flex flex-col sm:flex-row gap-7 mb-10">
                {/* Poster */}
                <div className="shrink-0">
                    <div className=" w-[240px] sm:w-[210px] rounded-2xl overflow-hidden ring-1 ring-border shadow-md">
                        {data.image_url ? (
                            <img
                                src={getMediumSizeImage(data.image_url)}
                                alt={data.title}
                                className="w-full object-cover"
                                style={{ aspectRatio: "2/3" }}
                            />
                        ) : (
                            <div
                                className="w-full bg-default-100 flex items-center justify-center"
                                style={{ aspectRatio: "2/3" }}
                            >
                                <Film size={36} className="text-default-300" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Title block */}
                <div className="flex flex-col gap-3 min-w-0">
                    {/* Type + country */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Chip size="sm" color="default" className="text-xs">
                            {data.country}
                        </Chip>
                        <Chip size="sm" variant="flat" color="secondary" className="text-xs text-foreground/80">
                            {data.type}
                        </Chip>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                            {data.title}
                        </h1>
                        {data.native_title && (
                            <p className="text-foreground/50 text-base mt-1">{data.native_title}</p>
                        )}
                        {alsoKnownAs.length > 0 && (
                            <p className="text-foreground/50 text-xs mt-1">
                                Also known as: {alsoKnownAs.join(", ")}
                            </p>
                        )}
                    </div>

                    {/* Ratings row */}
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                        {data.rating != null && (
                            <div className="flex items-center gap-1.5">
                                <Star size={16} className="text-amber-400 fill-amber-400" />
                                <span className="text-xl font-bold text-foreground">{data.rating}</span>
                                {data.scored_by_user_count && (
                                    <span className="text-xs text-foreground/50">
                                        ({formatNumber(data.scored_by_user_count)} ratings)
                                    </span>
                                )}
                            </div>
                        )}
                        {data.watchers != null && (
                            <div className="flex items-center gap-1 text-foreground/80 text-sm">
                                <Users size={13} />
                                <span>{formatNumber(data.watchers)} watching</span>
                            </div>
                        )}
                    </div>

                    {/* Meta pills */}
                    {/* <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-0.5"> */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 max-w-md">
                        <StatPill icon={Calendar} label="" value={airedRange} />
                        <StatPill icon={Clock} label="" value={data.runtime ? `${data.runtime} min / ep` : null} />
                        <StatPill icon={Tv} label="Episodes" value={data.episodes} />
                        <StatPill icon={Globe} label="Network" value={data.original_network} />
                        {data.content_rating && (
                            <StatPill icon={Film} label="" value={data.content_rating} />
                        )}
                    </div>

                    {data.ranking != null && (
                        <div className="flex items-center gap-4 mt-0.5">
                            <div className="flex items-center gap-1 text-xs text-foreground/50">
                                <Trophy size={12} className="text-amber-400" />
                                Rank #{data.ranking}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-foreground/50">
                                <TrendingUp size={12} className="text-sky-400" />
                                Popularity #{data.popularity}
                            </div>
                        </div>
                    )}

                    {/* MDL link — prominent */}
                    <div className="mt-2">
                        <a
                            href={mdlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                            <ExternalLink size={13} />
                            View on MyDramaList
                        </a>
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            {/* -- Body ----------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-2">

                {/* Left column */}
                <div className="flex flex-col gap-9 bg-surface rounded-xl p-4">

                    {/* Genres + Tags */}
                    {(genres.length > 0 || tags.length > 0) && (
                        <section>
                            {genres.length > 0 && (
                                <div className="mb-3">
                                    <SectionHeading>Genres</SectionHeading>
                                    <div className="flex flex-wrap gap-1.5">
                                        {genres.map((g) => (
                                            <Chip key={g} size="sm" variant="flat" color="default">
                                                {g}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {tags.length > 0 && (
                                <div>
                                    <SectionHeading>Tags</SectionHeading>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map((t) => (
                                            <Chip key={t} size="sm" variant="bordered" color="default" className="text-xs text-foreground/80">
                                                {t}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    

                    <section className="rounded-2xl border border-default bg-default-soft p-4">
                        <div className="flex gap-2 ">
                            <SparklesIcon size={20} />
                            <div>
                                <h1 className="text-xs font-semibold uppercase tracking-widest">AI Insights</h1>
                                <p className="text-xs text-muted mb-4">
                                    Generated using AI. May be inaccurate.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-9 mt-6">
                            {/* Review summary */}
                            {data.review_summary && (
                                <section>
                                    <SectionHeading>Summary</SectionHeading>
                                    <div className="text-sm text-default-foreground/80 leading-relaxed">
                                        {data.review_summary}
                                    </div>
                                </section>
                            )}

                            {/* Tones */}
                            {tones.length > 0 && (
                                <section>
                                    <SectionHeading>Tone</SectionHeading>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tones.map((tone) => (
                                            <ToneBadge key={tone} tone={tone} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Vibe tags */}
                            {hasVibes && (
                                <section>
                                    <SectionHeading>Vibes</SectionHeading>
                                    <div className="flex flex-col divide-y divide-default-100">
                                        <VibeRow label="Pacing" category="pacing" value={data.pacing} />
                                        <VibeRow label="Romance" category="romance_level" value={data.romance_level} />
                                        <VibeRow label="Emotional Weight" category="emotional_weight" value={data.emotional_weight} />
                                        <VibeRow label="Comfort Level" category="comfort_level" value={data.comfort_level} />
                                        <VibeRow label="Ending" category="ending_type" value={data.ending_type} spoiler={true} />
                                    </div>
                                </section>
                            )}

                            {/* Themes */}
                            {themes.length > 0 && (
                                <section>
                                    <SectionHeading>Themes</SectionHeading>
                                    {/* <p className="text-sm text-default-foreground/80 leading-relaxed capitalize">
                                        {themes.join(" · ")}
                                    </p> */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {themes.map((t) => (
                                            <Chip key={t} size="sm" variant="flat" className="text-xs capitalize text-foreground/80">
                                                {t}
                                            </Chip>
                                        ))}
                                    </div>
                                </section>
                            )}





                            {/* Ending details (spoiler) */}
                            {data.ending_details && (
                                <section>
                                    <SectionHeading>Ending Details</SectionHeading>
                                    <Spoiler>
                                        <p className="text-sm text-foreground/80 leading-relaxed">
                                            {data.ending_details}
                                        </p>
                                    </Spoiler>
                                </section>
                            )}
                        </div>
                    </section>

                    {/* Synopsis */}
                    <section>
                        <SectionHeading>Synopsis</SectionHeading>
                        <p className="text-sm text-foreground/80 leading-relaxed">{truncate(data.synopsis, 500)}</p>
                        <a
                            href={mdlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-primary mt-2 transition-colors"
                        >
                            <ExternalLink size={11} />
                            Full synopsis on MyDramaList
                        </a>
                    </section>

                </div>

                {/* Right column */}
                <div className="flex flex-col gap-8 bg-surface rounded-xl p-4">

                    {/* Where to watch */}
                    {platforms.length > 0 && (
                        <section>
                            <SectionHeading>Where to Watch</SectionHeading>
                            <div className="flex flex-col gap-2">
                                {platforms.map((p) => (
                                    <PlatformButton key={p.platform} platform={p.platform} url={p.url} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Cast */}
                    {cast.length > 0 && (
                        <section>
                            <SectionHeading>Cast</SectionHeading>
                            <div className="flex flex-col gap-4">
                                {mainCast.length > 0 && (
                                    <div>
                                        <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Main</p>
                                        <div className="flex flex-col gap-2.5">
                                            {mainCast.map((c) => (
                                                <CastInitials key={c.name} name={c.name} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {supportCast.length > 0 && (
                                    <div>
                                        <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Supporting</p>
                                        <div className="flex flex-col gap-2.5">
                                            {supportCast.map((c) => (
                                                <CastInitials key={c.name} name={c.name} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* MDL credit box */}
                    <div className="rounded-xl border border-default-200 bg-default-50 p-4 text-center">
                        <p className="text-xs text-foreground/50 mb-2 leading-relaxed">
                            Data sourced from MyDramaList. Visit MDL for full cast, community reviews, ratings, and more details.
                        </p>
                        <a
                            href={mdlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        >
                            <ExternalLink size={13} />
                            Open on MyDramaList
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}