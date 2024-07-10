import React, { useState, useEffect } from 'react';

const initialPunchlinePatterns = [
  { setup: /why did the (.+) cross the road/i, punchline: "To get to the other side! (But seriously, {1} don't cross roads, silly!)" },
  { setup: /what do you call a (.+) with (.+)/i, punchline: "A {1} with {2}... or as I like to call it, Tuesday!" },
  { setup: /how many (.+) does it take to (.+)/i, punchline: "Just one, but they'll need {2} {1}s to help!" },
  { setup: /what's the difference between (.+) and (.+)/i, punchline: "One is {1}, the other is {2}. Don't get them confused at parties!" },
  { setup: /why don't (.+) and (.+) get along/i, punchline: "Because {1} always {2}s the {2}!" },
  { setup: /what did the (.+) say to the (.+)/i, punchline: "Hey {2}, want to {1} together sometime?" },
];

function PunchlinePredictor() {
  const [setup, setSetup] = useState('');
  const [predictedPunchlines, setPredictedPunchlines] = useState([]);
  const [punchlinePatterns, setPunchlinePatterns] = useState(initialPunchlinePatterns);
  const [customSetup, setCustomSetup] = useState('');
  const [customPunchline, setCustomPunchline] = useState('');
  const [jokeHistory, setJokeHistory] = useState([]);

  useEffect(() => {
    const savedPatterns = localStorage.getItem('punchlinePatterns');
    if (savedPatterns) {
      setPunchlinePatterns(JSON.parse(savedPatterns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('punchlinePatterns', JSON.stringify(punchlinePatterns));
  }, [punchlinePatterns]);

  const predictPunchline = () => {
    let predictions = [];
    for (let pattern of punchlinePatterns) {
      const match = setup.match(pattern.setup);
      if (match) {
        let punchline = pattern.punchline;
        for (let i = 1; i < match.length; i++) {
          punchline = punchline.replace(new RegExp(`\\{${i}\\}`, 'g'), match[i]);
        }
        predictions.push(punchline);
      }
    }
    if (predictions.length === 0) {
      predictions.push(generateRandomPunchline(setup));
    }
    setPredictedPunchlines(predictions);
    setJokeHistory([...jokeHistory, { setup, punchlines: predictions }]);
  };

  const generateRandomPunchline = (setup) => {
    const randomWords = setup.match(/\b(\w+)\b/g);
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    return `I don't know, but it probably involves a ${randomWord}!`;
  };

  const addCustomPattern = () => {
    if (customSetup && customPunchline) {
      const newPattern = {
        setup: new RegExp(customSetup.replace(/\((.+?)\)/g, '(.+)'), 'i'),
        punchline: customPunchline.replace(/\{(\d+)\}/g, '{$1}')
      };
      setPunchlinePatterns([...punchlinePatterns, newPattern]);
      setCustomSetup('');
      setCustomPunchline('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      predictPunchline();
    }
  };

  return (
    <div className="punchline-predictor">
      <h2>Punchline Predictor</h2>
      <div className="setup-input">
        <input
          type="text"
          value={setup}
          onChange={(e) => setSetup(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your joke setup"
        />
        <button onClick={predictPunchline}>Predict Punchline</button>
      </div>
      {predictedPunchlines.length > 0 && (
        <div className="predicted-punchlines">
          <h3>Predicted Punchlines:</h3>
          {predictedPunchlines.map((punchline, index) => (
            <p key={index}>{index + 1}. {punchline}</p>
          ))}
        </div>
      )}
      <div className="custom-pattern">
        <h3>Add Custom Joke Pattern</h3>
        <input
          type="text"
          value={customSetup}
          onChange={(e) => setCustomSetup(e.target.value)}
          placeholder="Custom setup pattern (use () for variables)"
        />
        <input
          type="text"
          value={customPunchline}
          onChange={(e) => setCustomPunchline(e.target.value)}
          placeholder="Custom punchline (use {1}, {2}, etc. for variables)"
        />
        <button onClick={addCustomPattern}>Add Pattern</button>
      </div>
      <div className="joke-history">
        <h3>Joke History</h3>
        {jokeHistory.map((joke, index) => (
          <div key={index} className="joke-entry">
            <p><strong>Setup:</strong> {joke.setup}</p>
            <p><strong>Punchlines:</strong></p>
            <ul>
              {joke.punchlines.map((punchline, pIndex) => (
                <li key={pIndex}>{punchline}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PunchlinePredictor;