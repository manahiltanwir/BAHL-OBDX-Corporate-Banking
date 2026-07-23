import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";

export const CardShell = styled(Box)(({ }) => ({
    position: "relative",
    // margin: '0, 10, 0, 10',
    padding:0
}));

export const StyledCarouselCard = styled(Box)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    padding: theme.spacing(6, 10),
    color: theme.palette.common.white,
    background: `${theme.palette.mode === 'dark' ? `linear-gradient(115deg, ${theme.palette.customColors.deep} 0%, ${theme.palette.customColors.mid} 48%, ${theme.palette.customColors.bright} 78%, ${theme.palette.customColors.gold} 145%)` : null} `,
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

export const ChipMark = styled(Box)(({ theme: { palette: { customColors: { goldSoft, gold } } } }) => ({
    width: 34,
    height: 26,
    borderRadius: 6,
    background: `linear-gradient(145deg, ${goldSoft}, ${gold})`,
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
}));

export const ArrowButton = styled(IconButton)(({ theme: { palette: { customColors: { mid, gold } } } }) => ({
    background: "rgba(255,255,255,0.95)",
    color: mid,
    width: 44,
    height: 44,
    boxShadow: "0 10px 24px rgba(0,56,31,0.25)",
    "&:hover": {
        background: gold,
        color: "#fff",
    },
    transition: "0.25s ease",
}));

export const ContentFade = styled(Box, {
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