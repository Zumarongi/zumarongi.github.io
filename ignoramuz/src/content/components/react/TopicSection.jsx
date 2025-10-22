import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import ArticleCard from "./ArticleCard";

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
        {articles.map((article, index) => (
          <Grid
            key={article.id}
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{
              display: "flex",
              mt: "0 !important", // 覆盖 starlight 的 margin-top
            }}
          >
            <ArticleCard
              id={article.id}
              title={article.title}
              summary={article.summary}
              link={article.link}
              tags={article.tags}
              cover={article.cover}
              date={article.date}
              readingTime={article.readingTime}
              index={index}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}