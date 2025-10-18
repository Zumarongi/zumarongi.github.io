import React from "react";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";


// utils inside TopicSection.jsx or extracted to helper file
function pad(n) { return String(n).padStart(2, '0'); }

/**
 * Format ISO/Date to "yyyy-mm-dd hh:mm" in the local timezone of the running environment (browser).
 * If iso is null/invalid returns null.
 * If omitZeroTime = true and time is 00:00, returns just "yyyy-mm-dd".
 */
function formatToLocal(iso, { omitZeroTime = false } = {}) {
  if (!iso) return null;
  const d = (iso instanceof Date) ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());

  if (omitZeroTime && hh === '00' && min === '00') {
    return `${yyyy}-${mm}-${dd}`;
  }
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}


/**
 * 主题区块组件
 *
 * Props:
 *  - topic: { name: string, link?: string }
 *  - articles: Array<{
 *      id: string;
 *      title: string;
 *      summary: string;
 *      link: string;
 *      tags?: string[];
 *      cover?: string;
 *      date?: string;         // optional, for metadata line
 *      readingTime?: string;  // optional, e.g. "6 min"
 *    }>
 */
export default function TopicSection({ topic, articles = [] }) {
  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {topic.name}
        </Typography>

        {topic.link && (
          <Button
            href={topic.link}
            component="a"
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2,
            }}
          >
            查看主题
          </Button>
        )}
      </Box>

      <Grid container spacing={3} sx={{ width: "100%", alignItems: "stretch" }}>
        {articles.map((art, idx) => (
          <Grid
            key={art.id}
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{
              display: "flex",
              mt: "0 !important", // 覆盖 starlight 的 margin-top
            }}
          >
            <Card
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "background.paper",
                boxShadow: "0 6px 20px rgba(10,10,10,0.04)",
                transition: "transform .28s cubic-bezier(.2,.9,.2,1), box-shadow .24s",
                transformOrigin: "center center",
                "&:hover": {
                  transform: "translateY(-10px) rotateZ(-0.25deg)",
                  boxShadow: "0 18px 40px rgba(12,12,20,0.12)",
                },
              }}
            >
              {/* 视觉侧栏：斜切图片 / 渐变占位 */}
              <CardActionArea
                component="a"
                href={art.link}
                sx={{
                  display: "flex",
                  textDecoration: "none",
                  color: "inherit",
                  flexDirection: "column",
                  flexGrow: 1,
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 160,
                    overflow: "hidden",
                    background:
                      "linear-gradient(120deg, rgba(124,58,237,0.9) 0%, rgba(6,182,212,0.9) 100%)",
                    // create a subtle diagonal cut using clip-path
                    clipPath: "polygon(0 0, 100% 0, 100% 78%, 0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {art.cover ? (
                    <CardMedia
                      component="img"
                      image={art.cover}
                      alt={art.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.06)",
                        transition: "transform .6s ease",
                        // on hover of card, scale image slightly for parallax
                        " .MuiCard-root:hover &": {
                          transform: "scale(1.12) translateY(-6px)",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(255,255,255,0.95)",
                        fontWeight: 700,
                        zIndex: 2,
                        px: 3,
                        textAlign: "center",
                      }}
                    >
                      {art.title}
                    </Typography>
                  )}

                  {/* Accent overlay for depth */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />
                </Box>

                {/* 内容区 */}
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.25,
                    flexGrow: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 700, lineHeight: 1.15 }}
                  >
                    {art.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {art.summary}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                      {art.tags?.slice(0, 4).map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            borderColor: "rgba(15, 23, 42, 0.06)",
                            bgcolor: "rgba(15,23,42,0.02)",
                            color: "text.primary",
                            fontSize: 12,
                          }}
                        />
                      ))}
                    </Stack>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      {(art.date || art.readingTime) && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {art.date && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <CalendarIconSmall />
                              <span>{formatToLocal(art.date)}</span>
                            </span>
                          )}
                          {art.readingTime && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                              <AccessTimeIcon sx={{ fontSize: 14 }} />
                              <span>{formatToLocal(art.readingTime)}</span>
                            </span>
                          )}
                        </Typography>
                      )}

                      {/* quick actions (visual only) */}
                      <IconButton size="small" aria-label="save">
                        <BookmarkBorderIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" aria-label="share">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>

              {/* footer strip: subtle gradient line */}
              <Box
                sx={{
                  height: 6,
                  background: idx % 2 === 0 ? "linear-gradient(90deg,#7c3aed,#06b6d4)" : "linear-gradient(90deg,#06b6d4,#7c3aed)",
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* tiny inline helper: small calendar glyph without external icon import
   keeps bundle tiny and looks crisp at small sizes */
function CalendarIconSmall() {
  return (
    <Box component="span" sx={{ width: 14, height: 14, display: "inline-block" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M7 11h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"></rect>
        <path d="M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </Box>
  );
}
