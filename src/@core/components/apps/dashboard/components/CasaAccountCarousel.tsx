import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, IconButton, Typography } from "@mui/material";
import {
    ChevronLeft,
    ChevronRight,
    EyeOutline,
    EyeOffOutline,
    Bank,
    ArrowRight,
} from "mdi-material-ui";

export interface CasaAccount {
    id: string;
    label: string;
    accountNumber: string;
    balance: string;
    currency: string;
}

interface CasaAccountCarouselProps {
    accounts: CasaAccount[];
    btnLabel?: string;
    onViewDetails?: (account: CasaAccount) => void;
}

// ** Palette pulled from the corporate green/gold direction already in use
const palette = {
    deep: "#00381F",
    mid: "#00693E",
    bright: "#0AA06E",
    gold: "#C9A227",
    goldSoft: "#E4C766",
};

const CardShell = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
}));

const StyledCarouselCard = styled(Box)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    padding: theme.spacing(4.5, 6),
    color: "#fff",
    background: `linear-gradient(115deg, ${palette.deep} 0%, ${palette.mid} 48%, ${palette.bright} 78%, ${palette.gold} 145%)`,
    minHeight: 232,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: `0 24px 48px -12px rgba(0,56,31,0.45)`,
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 32px 64px -12px rgba(0,56,31,0.55)`,
    },
    // faint diagonal guilloché-style texture, like a currency note
    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 14px)",
        pointerEvents: "none",
    },
    // slow, subtle sheen — not a flashy loop
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-130%",
        width: "55%",
        height: "100%",
        background:
            "linear-gradient(120deg, transparent, rgba(255,255,255,0.14), transparent)",
        transform: "skewX(-20deg)",
        animation: "shine 7s ease-in-out infinite",
    },
    "@keyframes shine": {
        "0%": { left: "-130%" },
        "35%": { left: "140%" },
        "100%": { left: "140%" },
    },
    "& > *": {
        position: "relative",
        zIndex: 2,
    },
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(4, 3),
        minHeight: 220,
    },
}));

// Small embossed chip mark — the one "card-like" signature detail
const ChipMark = styled(Box)({
    width: 34,
    height: 26,
    borderRadius: 6,
    background: `linear-gradient(145deg, ${palette.goldSoft}, ${palette.gold})`,
    position: "relative",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
    "&::before, &::after": {
        content: '""',
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        border: "1px solid rgba(0,56,31,0.35)",
    },
    "&::before": { width: "70%", height: "70%", borderRadius: 3 },
    "&::after": { width: "38%", height: "100%" },
});

const ArrowButton = styled(IconButton)(({ theme }) => ({
    background: "rgba(255,255,255,0.95)",
    color: palette.mid,
    width: 44,
    height: 44,
    boxShadow: "0 10px 24px rgba(0,56,31,0.25)",
    "&:hover": {
        background: palette.gold,
        color: "#fff",
    },
    transition: "0.25s ease",
}));

const ContentFade = styled(Box, {
    shouldForwardProp: (prop) => prop !== "direction",
})<{ direction: "left" | "right" }>(({ direction }) => ({
    animation: `${direction === "left" ? "slideLeft" : "slideRight"} 0.6s ease`,

    "@keyframes slideLeft": {
        "0%": {
            opacity: 0,
            transform: "translateX(-50px)",
        },
        "100%": {
            opacity: 1,
            transform: "translateX(0)",
        },
    },

    "@keyframes slideRight": {
        "0%": {
            opacity: 0,
            transform: "translateX(50px)",
        },
        "100%": {
            opacity: 1,
            transform: "translateX(0)",
        },
    },
}));

const CasaAccountCarousel = ({
    accounts,
    btnLabel = "View Details",
    onViewDetails,
}: CasaAccountCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showBalance, setShowBalance] = useState(true);
    const [showAccountNumber, setShowAccountNumber] = useState(true);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [cardAnimating, setCardAnimating] = useState(false);

    if (!accounts.length) return null;

    const active = accounts[activeIndex];
    const hasMultiple = accounts.length > 1;

    const handlePrev = () => {
        setDirection("left");
        setCardAnimating(true);

        setTimeout(() => {
            setActiveIndex((prev) =>
                prev === 0 ? accounts.length - 1 : prev - 1
            );
            setCardAnimating(false);
        }, 300);
    };


    const handleNext = () => {
        setDirection("right");
        setCardAnimating(true);

        setTimeout(() => {
            setActiveIndex((prev) =>
                prev === accounts.length - 1 ? 0 : prev + 1
            );
            setCardAnimating(false);
        }, 300);
    };

    return (
        <CardShell>
            {hasMultiple && (
                <ArrowButton
                    onClick={handlePrev}
                    aria-label="Previous account"
                    sx={{
                        position: "absolute",
                        left: { xs: 4, md: -22 },
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 3,
                    }}
                >
                    <ChevronLeft />
                </ArrowButton>
            )}

            <StyledCarouselCard
                sx={{
                    transform: cardAnimating
                        ? direction === "right"
                            ? "translateX(-40px)"
                            : "translateX(40px)"
                        : "translateX(0)",
                    opacity: cardAnimating ? 0.7 : 1,
                }}
            >
                <ContentFade key={active.id} direction={direction}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <ChipMark />
                            <Box>
                                <Typography
                                    sx={{
                                        opacity: 0.85,
                                        letterSpacing: 2,
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: 12,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {active.label}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff", mt: 0.25 }}>
                                    CASA Account
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {hasMultiple && (
                                <Typography variant="caption" sx={{ opacity: 0.8, color: "#fff" }}>
                                    {activeIndex + 1} / {accounts.length}
                                </Typography>
                            )}
                            <Bank sx={{ fontSize: 20, opacity: 0.75 }} />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3.5, display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                        <Box>
                            <Typography sx={{ opacity: 0.8, color: "#fff", fontSize: 12, display: "block", mb: 0.5 }}>
                                Available Balance
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                    color: "#fff",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {showBalance ? `${active.currency} ${active.balance}` : "•••••••••"}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => {
                                setShowBalance((prev) => !prev);
                                setShowAccountNumber((prev) => !prev);
                            }}
                            aria-label={showBalance ? "Hide balance" : "Show balance"}
                            sx={{ color: "#fff", opacity: 0.85, mb: 0.5, "&:hover": { opacity: 1 } }}
                        >
                            {showBalance ? <EyeOffOutline fontSize="small" /> : <EyeOutline fontSize="small" />}
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            mt: 3.5,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography sx={{ opacity: 0.8, color: "#fff", fontSize: 12, display: "block", mb: 0.5 }}>
                                Account Number
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    color: "#fff",
                                    fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                                }}
                            >
                                {showAccountNumber ? active.accountNumber : "••••••••••••"}
                            </Typography>
                        </Box>

                        <Box
                            component="button"
                            onClick={() => onViewDetails?.(active)}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                border: 0,
                                borderRadius: 50,
                                px: 3,
                                py: 1,
                                color: palette.mid,
                                background: "#fff",
                                fontWeight: 800,
                                fontSize: "0.8125rem",
                                cursor: "pointer",
                                transition: ".25s ease",
                                "&:hover": {
                                    background: palette.gold,
                                    color: "#fff",
                                    gap: 1.25,
                                },
                            }}
                        >
                            {btnLabel}
                            <ArrowRight fontSize="small" />
                        </Box>
                    </Box>
                </ContentFade>
            </StyledCarouselCard>

            {hasMultiple && (
                <ArrowButton
                    onClick={handleNext}
                    aria-label="Next account"
                    sx={{
                        position: "absolute",
                        right: { xs: 4, md: -22 },
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 3,
                    }}
                >
                    <ChevronRight />
                </ArrowButton>
            )}

            {hasMultiple && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mt: 3.5 }}>
                    {accounts.map((acc, idx) => (
                        <Box
                            key={acc.id}
                            onClick={() => setActiveIndex(idx)}
                            sx={{
                                width: idx === activeIndex ? 28 : 8,
                                height: 6,
                                borderRadius: 20,
                                bgcolor: idx === activeIndex ? palette.mid : "rgba(0,56,31,0.18)",
                                cursor: "pointer",
                                transition: "all .3s ease",
                            }}
                        />
                    ))}
                </Box>
            )}
        </CardShell>
    );
};

export default CasaAccountCarousel;