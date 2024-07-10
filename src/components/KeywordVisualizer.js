import React from 'react';

function KeywordVisualizer({ jokes }) {
  const keywordCount = jokes.reduce((acc, joke) => {
    joke.keywords.forEach(keyword => {
      acc[keyword] = (acc[keyword] || 0) + 1;
    });
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(keywordCount));

  return (
    <div className="keyword-visualizer">
      <h2>Keyword Cloud</h2>
      <div className="keyword-cloud">
        {Object.entries(keywordCount).map(([keyword, count]) => (
          <span
            key={keyword}
            className="keyword"
            style={{
              fontSize: `${(count / maxCount) * 2 + 1}em`,
              opacity: count / maxCount * 0.5 + 0.5
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

export default KeywordVisualizer;