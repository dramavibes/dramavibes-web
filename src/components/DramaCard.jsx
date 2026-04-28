import { useNavigate } from "react-router";
import { Star } from "lucide-react";
import { VibeBadge, ToneBadge, MatchScoreBadge } from "./TagBadge";
import { Card } from "@heroui/react";

export default function DramaCard({ drama, showEnding=false }) {
    const navigate = useNavigate();

    const {
        slug,
        title,
        type,
        country,
        year,
        rating,
        image_url,
        pacing,
        romance_level,
        emotional_weight,
        comfort_level,
        ending_type,
        tones = [],
        recommendation_score,
    } = drama;

    const get_medium_image = (url) => {
        if (url) {
            const lastIndex = url.lastIndexOf('.')
            if (lastIndex > 0) {
                // split by '.'
                let firstPart = url.substring(0, lastIndex);
                const secondPart = url.substring(lastIndex);
                const lastChar = firstPart.slice(-1);
                if (lastChar == "s") {
                    const result = firstPart.slice(0, -1) + 'c' + secondPart;   // gives medium sized image
                    return result;
                }
            }
        }
        return url;
    }

    return (
        <Card
            onClick={() => navigate(`/title/${slug}`)}
            className="
                p-0 gap-0
                group relative flex flex-col rounded-xl overflow-hidden
                bg-surface border border-border dark:border-accent/10
                cursor-pointer select-none
                transition-transform duration-200 ease-out
                hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20
                dark:hover:shadow-xl dark:hover:shadow-accent/20
            "
        >
        {/* -- Poster -------------------------------------------------------- */}
        <div className="relative w-full aspect-5/6 overflow-hidden">
            <img
                src={get_medium_image(image_url)}
                alt={title}
                loading="lazy"
                className="
                    w-full h-full object-cover object-center
                "
            />

            {/* Gradient fade — poster bleeds into card surface */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[52%] pointer-events-none"
                style={{
                    // background: "linear-gradient(to top, var(--color-surface) 0%, var(--color-surface) 8%, transparent 100%)",
                    background: "linear-gradient(to top, var(--color-surface) 0%, transparent 100%)",
                }}
            />


            {/* Match score — top right, only for semantic search results */}
            {(recommendation_score != null) && (
            <div className="absolute top-1 right-2">
                <MatchScoreBadge score={recommendation_score} />
            </div>
            )}

            {type && (
                <span
                    className="
                        absolute bottom-2 right-1
                        text-muted text-[10px] font-semibold
                        uppercase tracking-wider px-1.5 py-0.5 rounded
                        backdrop-filter backdrop-blur-xs
                    "
                >
                    {type}
                </span>
            )}
        </div>

        {/* -- Card body ----------------------------------------------------- */}
        <Card.Content className="px-2.5 pb-3 -mt-1 flex flex-col">

            {/* Title */}
            <h3 className="text-[13px] font-bold text-foreground leading-snug truncate mb-1">
            {title}
            </h3>

            {/* Meta: rating · year · country · type */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted mb-2 flex-wrap">
            {rating != null && (
                <>
                <Star size={11} className="text-yellow-500 fill-yellow-500 shrink-0" />
                <span className="text-foreground/80 font-semibold">{rating.toFixed(1)}</span>
                <MetaDot />
                </>
            )}
            {year && <span>{year}</span>}
            {country && (
                <>
                <MetaDot />
                <span className="truncate max-w-[90px]">{country}</span>
                </>
            )}
            
            </div>

            {/* Vibe chips — wrapping row, icon + value, no labels */}
            <div className="flex flex-wrap gap-1.5">
                <VibeBadge category="pacing"           value={pacing} />
                <VibeBadge category="romance_level"    value={romance_level} />
                <VibeBadge category="emotional_weight" value={emotional_weight} />
                <VibeBadge category="comfort_level"    value={comfort_level} />
            </div>

            {/* Remaining tones below divider */}
            {tones?.length > 0 && (
            <>
                <div className="h-px bg-border/80 dark:bg-border/80 my-1" />
                <div className="flex flex-wrap gap-1">
                {tones.map((tone) => (
                    <ToneBadge key={tone} tone={tone} />
                ))}
                {showEnding && ending_type && 
                    <VibeBadge category="ending_type" value={ending_type} />
                }
                </div>
            </>
            )}
        </Card.Content>
        </Card>
    );
}

// --- Helpers -----------------------------------------------------------------

function MetaDot() {
    return <span className="w-0.5 h-0.5 rounded-full bg-muted/50 shrink-0" />;
}