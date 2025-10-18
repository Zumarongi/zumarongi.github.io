import React from 'react';
import TopicSection from './TopicSection';

export default function TopicSections({ topics }) {
  return (
    <>
      {topics.map((t) => (
        <TopicSection key={t.topic.name} topic={t.topic} articles={t.articles} />
      ))}
    </>
  );
}
