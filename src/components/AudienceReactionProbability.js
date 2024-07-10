import React, { useState, useEffect } from 'react';

const reactionTypes = [
  'Uproarious Laughter', 'Chuckles', 'Giggles', 'Smirks', 'Groans', 
  'Eye Rolls', 'Silence', 'Confused Looks', 'Applause', 'Gasps', 
  'Awkward Coughs', 'Whispers', 'Boos', 'Standing Ovation', 'Walkouts'
];

const jokeCategories = [
  'Observational', 'Wordplay', 'Sarcasm', 'Self-deprecating', 'Dark Humor',
  'Slapstick', 'Absurdist', 'Topical', 'Anecdotal', 'Anti-Joke'
];

const audienceTypes = [
  'General Public', 'Comedy Club Regulars', 'Corporate Event', 'College Students',
  'Senior Citizens', 'Children', 'International Audience', 'Industry Professionals'
];

const keywordSentiments = {
  positive: ['happy', 'love', 'joy', 'excited', 'wonderful'],
  negative: ['sad', 'angry', 'upset', 'terrible', 'awful'],
  neutral: ['the', 'a', 'an', 'it', 'they']
};

function EnhancedAudienceReactionProbability() {
  const [jokeText, setJokeText] = useState('');
  const [jokeCategory, setJokeCategory] = useState('');
  const [audienceType, setAudienceType] = useState('');
  const [reactions, setReactions] = useState({});
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [reactionHistory, setReactionHistory] = useState([]);
  const [jokeTiming, setJokeTiming] = useState(0);
  const [jokeComplexity, setJokeComplexity] = useState(50);

  useEffect(() => {
    // Simulating loading previous reaction history
    setReactionHistory([
      { joke: "Why don't scientists trust atoms? Because they make up everything!", topReaction: "Chuckles", confidence: 75 },
      { joke: "I used to be addicted to soap, but I'm clean now.", topReaction: "Groans", confidence: 60 },
    ]);
  }, []);

  const analyzeSentiment = (text) => {
    const words = text.toLowerCase().split(/\W+/);
    let sentiment = 0;
    words.forEach(word => {
      if (keywordSentiments.positive.includes(word)) sentiment++;
      if (keywordSentiments.negative.includes(word)) sentiment--;
    });
    return sentiment;
  };

  const calculateComplexity = (text) => {
    const words = text.split(/\W+/);
    return Math.min(100, Math.max(0, words.length * 5));
  };

  const estimateReactions = () => {
    if (!jokeText.trim() || !jokeCategory || !audienceType) return;

    const sentiment = analyzeSentiment(jokeText);
    const complexity = calculateComplexity(jokeText);
    setJokeComplexity(complexity);

    const newReactions = {};
    let remainingProbability = 100;

    // Factor in joke category and audience type
    const categoryIndex = jokeCategories.indexOf(jokeCategory);
    const audienceIndex = audienceTypes.indexOf(audienceType);

    reactionTypes.forEach((type, index) => {
      let baseProbability = Math.floor(Math.random() * remainingProbability);
      
      // Adjust based on joke category and audience type
      baseProbability += (categoryIndex - index) * 2;
      baseProbability += (audienceIndex - index) * 2;

      // Adjust based on sentiment
      if (sentiment > 0 && ['Uproarious Laughter', 'Chuckles', 'Applause'].includes(type)) {
        baseProbability += sentiment * 5;
      } else if (sentiment < 0 && ['Groans', 'Silence', 'Boos'].includes(type)) {
        baseProbability += Math.abs(sentiment) * 5;
      }

      // Adjust based on joke timing
      if (jokeTiming < 30 && ['Confused Looks', 'Silence'].includes(type)) {
        baseProbability += 10;
      } else if (jokeTiming > 120 && ['Awkward Coughs', 'Whispers'].includes(type)) {
        baseProbability += 10;
      }

      // Adjust based on joke complexity
      if (complexity > 75 && ['Confused Looks', 'Silence'].includes(type)) {
        baseProbability += 15;
      } else if (complexity < 25 && ['Chuckles', 'Smirks'].includes(type)) {
        baseProbability += 15;
      }

      baseProbability = Math.max(0, Math.min(remainingProbability, baseProbability));

      if (index === reactionTypes.length - 1) {
        newReactions[type] = remainingProbability;
      } else {
        newReactions[type] = baseProbability;
        remainingProbability -= baseProbability;
      }
    });

    setReactions(newReactions);
    const newConfidence = Math.floor(Math.random() * 40) + 60; // 60-100
    setConfidenceScore(newConfidence);

    // Update reaction history
    setReactionHistory(prev => [
      { joke: jokeText, topReaction: Object.keys(newReactions).reduce((a, b) => newReactions[a] > newReactions[b] ? a : b), confidence: newConfidence },
      ...prev
    ].slice(0, 5));
  };

  return (
    <div className="enhanced-audience-reaction-probability">
      <h2>Audience Reaction Probability Analyzer</h2>
      <div className="joke-input">
        <textarea
          value={jokeText}
          onChange={(e) => setJokeText(e.target.value)}
          placeholder="Enter your joke here"
        />
        <select value={jokeCategory} onChange={(e) => setJokeCategory(e.target.value)}>
          <option value="">Select Joke Category</option>
          {jokeCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select value={audienceType} onChange={(e) => setAudienceType(e.target.value)}>
          <option value="">Select Audience Type</option>
          {audienceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <div className="joke-timing">
          <label>Estimated Joke Delivery Time (seconds):</label>
          <input
            type="number"
            value={jokeTiming}
            onChange={(e) => setJokeTiming(Math.max(0, parseInt(e.target.value)))}
          />
        </div>
      </div>
      <button onClick={estimateReactions}>Analyze Audience Reaction</button>
      {Object.keys(reactions).length > 0 && (
        <div className="reaction-display">
          <h3>Estimated Audience Reactions:</h3>
          {Object.entries(reactions)
            .sort(([,a], [,b]) => b - a)
            .map(([type, probability]) => (
              <div key={type} className="reaction-bar">
                <span className="reaction-type">{type}:</span>
                <div className="probability-bar" style={{width: `${probability}%`}}></div>
                <span className="probability-value">{probability}%</span>
              </div>
            ))}
          <p>Confidence Score: {confidenceScore}%</p>
          <p>Joke Complexity: {jokeComplexity}%</p>
        </div>
      )}
      <div className="reaction-history">
        <h3>Recent Joke Reaction History:</h3>
        <ul>
          {reactionHistory.map((item, index) => (
            <li key={index}>
              <strong>Joke:</strong> {item.joke.substring(0, 50)}...
              <br />
              <strong>Top Reaction:</strong> {item.topReaction} (Confidence: {item.confidence}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EnhancedAudienceReactionProbability;