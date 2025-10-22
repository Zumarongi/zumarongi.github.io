import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// utils inside ArticleCard.jsx
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
 * tiny inline helper: small calendar glyph without external icon import
 * keeps bundle tiny and looks crisp at small sizes
 */
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

/**
 * 文章卡片组件
 * 
 * @param {Object} props
 * @param {string} props.id - 文章ID
 * @param {string} props.title - 文章标题
 * @param {string} props.summary - 文章摘要
 * @param {string} props.link - 文章链接
 * @param {string[]} props.tags - 标签数组
 * @param {string} props.cover - 封面图片URL
 * @param {string} props.date - 发布日期
 * @param {string} props.readingTime - 阅读时间
 * @param {number} props.index - 卡片索引（用于渐变条）
 */
export default function ArticleCard({ 
  id,
  title,
  summary,
  link,
  tags = [],
  cover,
  date,
  readingTime,
  index = 0
}) {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "300px",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.08)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transformOrigin: "center center",
        // 背景图片设置
        ...(cover && {
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(1px)",
            zIndex: 1,
          },
        }),
        // 没有封面时的默认背景
        ...(!cover && {
          bgcolor: "background.paper",
        }),
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 32px rgba(124, 58, 237, 0.15)",
          borderColor: "rgba(124, 58, 237, 0.2)",
        },
      }}
    >
      <CardActionArea
        component="a"
        href={link}
        sx={{
          display: "flex",
          textDecoration: "none",
          color: "inherit",
          flexDirection: "column",
          flexGrow: 1,
          alignItems: "stretch",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* 内容区 */}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            p: 3,
            gap: 1,
          }}
        >
          {/* 标题区域 */}
          <Box sx={{ flexGrow: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{ 
                fontWeight: 700, 
                lineHeight: 1.3,
                fontSize: '1.1rem',
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          {/* 描述区域 */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {summary || "暂无描述"}
            </Typography>
          </Box>

          {/* 标签区域 */}
          {tags && tags.length > 0 && (
            <Box sx={{ flexGrow: 0 }}>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                {tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      borderRadius: 1.5,
                      borderColor: "rgba(124, 58, 237, 0.2)",
                      bgcolor: "rgba(124, 58, 237, 0.05)",
                      color: "primary.main",
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: "rgba(124, 58, 237, 0.1)",
                      },
                    }}
                  />
                ))}
                {tags.length > 3 && (
                  <Chip
                    label={`+${tags.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      borderRadius: 1.5,
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      bgcolor: "rgba(0, 0, 0, 0.05)",
                      color: "text.secondary",
                    }}
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* 底部元数据区域 */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            alignItems: "center",
            pt: 1,
            borderTop: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.1)",
            opacity: 0.7,
          }}>
            {/* 日期和阅读时间 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {date && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarIconSmall />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatToLocal(date, { omitZeroTime: true })}
                  </Typography>
                </Box>
              )}
              {readingTime && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 12 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {readingTime}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* footer strip: subtle gradient line */}
      <Box
        sx={{
          height: 6,
          background: index % 2 === 0 ? "linear-gradient(90deg,#7c3aed,#06b6d4)" : "linear-gradient(90deg,#06b6d4,#7c3aed)",
        }}
      />
    </Card>
  );
}
