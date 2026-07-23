import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight, EyeOutline, EyeOffOutline, Bank, ArrowRight } from "mdi-material-ui";
import { useDashboard } from "src/@core/hooks/apps/useDashboard";
import { ArrowButton, CardShell, ChipMark, ContentFade, StyledCarouselCard } from "./styled-component";

export interface CasaAccount {
    id: string;
    label: string;
    accountNumber: string;
    balance: string;
    currency: string;
    holderName: string
}

interface CasaAccountCarouselProps {
    accounts: CasaAccount[];
    btnLabel?: string;
    onViewDetails?: (account: CasaAccount) => void;
}

const CasaAccountCarousel = ({
    accounts,
    btnLabel = "View Details",
    onViewDetails,
}: CasaAccountCarouselProps) => {

    // Hook

    const theme = useTheme();

    const { activeIndex, setActiveIndex, showBalance, setShowBalance, showAccountNumber, setShowAccountNumber, direction, setDirection, cardAnimating, setCardAnimating } = useDashboard(null);

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
                                        // color: "#fff",
                                        fontWeight: 600,
                                        fontSize: 12,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {active.label}
                                </Typography>
                                <Typography variant="h6" sx={{
                                    fontWeight: 800,
                                    //  color: "#fff",
                                    mt: 0.25
                                }}>
                                    CASA Account
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {hasMultiple && (
                                <Typography variant="caption" sx={{
                                    opacity: 0.8,
                                    //  color: "#fff"
                                }}>
                                    {activeIndex + 1} / {accounts.length}
                                </Typography>
                            )}
                            <Bank sx={{ fontSize: 20, opacity: 0.75, color: theme.palette.mode == 'light' ? theme.palette.primary.main : null }} />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3.5, display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                        <Box>
                            <Typography sx={{
                                opacity: 0.8,
                                //  color: "#fff",
                                fontSize: 12, display: "block", mb: 0.5
                            }}>
                                Available Balance
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                    // color: "#fff",
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
                            sx={{
                                //  color: "#fff",
                                opacity: 0.85, mb: 0.5, "&:hover": { opacity: 1 }
                            }}
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
                            <Typography sx={{
                                opacity: 0.8,
                                //  color: "#fff",
                                fontSize: 12, display: "block", mb: 0.5
                            }}>
                                Account Number
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    // color: "#fff",
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
                                // color: palette.mid,
                                // background: "#fff",
                                fontWeight: 800,
                                fontSize: "0.8125rem",
                                cursor: "pointer",
                                transition: ".25s ease",
                                "&:hover": {
                                    // background: palette.gold,
                                    // color: "#fff",
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
                                // bgcolor: idx === activeIndex ? palette.mid : "rgba(0,56,31,0.18)",
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