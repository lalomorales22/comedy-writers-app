import React, { useState, useEffect } from 'react';

const styleKeywords = {
  observational: ['notice', 'ever wonder', 'why do', 'what\'s the deal', 'have you seen', 'isn\'t it funny how'],
  sarcastic: ['great', 'fantastic', 'wonderful', 'genius', 'brilliant', 'obviously', 'clearly'],
  absurdist: ['suddenly', 'unexpectedly', 'bizarrely', 'strangely', 'out of nowhere', 'for no reason'],
  selfDeprecating: ['I\'m so', 'I always', 'I never', 'I can\'t', 'my life', 'why am I'],
  wordplay: ['pun', 'play on words', 'double meaning', 'sounds like', 'homophone', 'anagram'],
  physical: ['fell', 'tripped', 'stumbled', 'face', 'body', 'gesture'],
  topical: ['news', 'politics', 'celebrity', 'trending', 'viral', 'current events'],
  dark: ['death', 'tragedy', 'misery', 'pain', 'suffering', 'dark side'],
  deadpan: ['seriously', 'honestly', 'truly', 'matter-of-factly', 'straight face'],
  surreal: ['dream', 'reality', 'dimension', 'universe', 'impossible', 'physics-defying'],
};

const toneIndicators = {
  lighthearted: ['happy', 'joy', 'fun', 'light', 'silly'],
  cynical: ['bitter', 'jaded', 'pessimistic', 'skeptical'],
  witty: ['clever', 'smart', 'intelligent', 'sharp'],
  raunchy: ['explicit', 'crude', 'vulgar', 'offensive'],
  philosophical: ['deep', 'meaning', 'life', 'existence', 'purpose'],
};

function ComedyStyleAnalyzer({ jokes }) {
  const [styleAnalysis, setStyleAnalysis] = useState({});
  const [toneAnalysis, setToneAnalysis] = useState({});
  const [wordFrequency, setWordFrequency] = useState({});
  const [jokeLengthStats, setJokeLengthStats] = useState({});
  const [topKeywords, setTopKeywords] = useState([]);
  const [selectedJoke, setSelectedJoke] = useState(null);

  useEffect(() => {
    if (jokes.length > 0) {
      analyzeStyle();
    }
  }, [jokes]);

  const analyzeStyle = () => {
    const styleAnalysis = Object.keys(styleKeywords).reduce((acc, style) => {
      acc[style] = 0;
      return acc;
    }, {});

    const toneAnalysis = Object.keys(toneIndicators).reduce((acc, tone) => {
      acc[tone] = 0;
      return acc;
    }, {});

    const wordFreq = {};
    const jokeLengths = [];

    jokes.forEach(joke => {
      const jokeText = `${joke.setup} ${joke.punchline}`.toLowerCase();
      jokeLengths.push(jokeText.split(' ').length);

      // Style analysis
      Object.entries(styleKeywords).forEach(([style, keywords]) => {
        if (keywords.some(keyword => jokeText.includes(keyword))) {
          styleAnalysis[style]++;
        }
      });

      // Tone analysis
      Object.entries(toneIndicators).forEach(([tone, indicators]) => {
        if (indicators.some(indicator => jokeText.includes(indicator))) {
          toneAnalysis[tone]++;
        }
      });

      // Word frequency
      jokeText.split(/\W+/).forEach(word => {
        if (word.length > 3) {  // Ignore short words
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
    });

    setStyleAnalysis(styleAnalysis);
    setToneAnalysis(toneAnalysis);
    setWordFrequency(wordFreq);
    setJokeLengthStats({
      average: jokeLengths.reduce((a, b) => a + b, 0) / jokeLengths.length,
      min: Math.min(...jokeLengths),
      max: Math.max(...jokeLengths),
    });
    setTopKeywords(Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count })));
  };

  const getStylePercentage = (style) => {
    const total = Object.values(styleAnalysis).reduce((a, b) => a + b, 0);
    return total > 0 ? (styleAnalysis[style] / total * 100).toFixed(1) : 0;
  };

  const getTonePercentage = (tone) => {
    const total = Object.values(toneAnalysis).reduce((a, b) => a + b, 0);
    return total > 0 ? (toneAnalysis[tone] / total * 100).toFixed(1) : 0;
  };

  const analyzeJoke = (joke) => {
    setSelectedJoke(joke);
  };

  return (
    <div className="comedy-style-analyzer">
      <h2>Comedy Style Analyzer</h2>
      <button onClick={analyzeStyle}>Analyze My Style</button>
      {Object.keys(styleAnalysis).length > 0 && (
        <div className="analysis-results">
          <div className="style-breakdown">
            <h3>Your Comedy Style Breakdown:</h3>
            {Object.entries(styleAnalysis).map(([style, count]) => (
              <div key={style} className="style-bar">
                <span className="style-name">{style}:</span>
                <div className="bar-container">
                  <div className="bar" style={{width: `${getStylePercentage(style)}%`}}></div>
                </div>
                <span className="style-count">{count} joke(s) - {getStylePercentage(style)}%</span>
              </div>
            ))}
          </div>
          <div className="tone-analysis">
            <h3>Tone Analysis:</h3>
            {Object.entries(toneAnalysis).map(([tone, count]) => (
              <div key={tone} className="tone-bar">
                <span className="tone-name">{tone}:</span>
                <div className="bar-container">
                  <div className="bar" style={{width: `${getTonePercentage(tone)}%`}}></div>
                </div>
                <span className="tone-count">{count} joke(s) - {getTonePercentage(tone)}%</span>
              </div>
            ))}
          </div>
          <div className="additional-stats">
            <h3>Additional Statistics:</h3>
            <p>Average Joke Length: {jokeLengthStats.average.toFixed(1)} words</p>
            <p>Shortest Joke: {jokeLengthStats.min} words</p>
            <p>Longest Joke: {jokeLengthStats.max} words</p>
          </div>
          <div className="top-keywords">
            <h3>Top Keywords:</h3>
            <ul>
              {topKeywords.map(({ word, count }) => (
                <li key={word}>{word}: {count} occurrence(s)</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="joke-analyzer">
        <h3>Analyze Individual Joke</h3>
        <select onChange={(e) => analyzeJoke(jokes[e.target.value])}>
          <option value="">Select a joke</option>
          {jokes.map((joke, index) => (
            <option key={index} value={index}>Joke {index + 1}</option>
          ))}
        </select>
        {selectedJoke && (
          <div className="joke-analysis">
            <p><strong>Setup:</strong> {selectedJoke.setup}</p>
            <p><strong>Punchline:</strong> {selectedJoke.punchline}</p>
            <p><strong>Detected Styles:</strong> {Object.entries(styleKeywords)
              .filter(([style, keywords]) => keywords.some(keyword => 
                `${selectedJoke.setup} ${selectedJoke.punchline}`.toLowerCase().includes(keyword)
              ))
              .map(([style]) => style)
              .join(', ')}
            </p>
            <p><strong>Detected Tones:</strong> {Object.entries(toneIndicators)
              .filter(([tone, indicators]) => indicators.some(indicator => 
                `${selectedJoke.setup} ${selectedJoke.punchline}`.toLowerCase().includes(indicator)
              ))
              .map(([tone]) => tone)
              .join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComedyStyleAnalyzer;