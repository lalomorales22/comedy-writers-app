import React, { useState, useEffect } from 'react';

function CallbackTracker({ jokes }) {
  const [callbacks, setCallbacks] = useState([]);
  const [callbackNetwork, setCallbackNetwork] = useState([]);
  const [minWordLength, setMinWordLength] = useState(4);
  const [minOccurrences, setMinOccurrences] = useState(2);
  const [excludedWords, setExcludedWords] = useState(['the', 'and', 'but', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with']);
  const [selectedCallback, setSelectedCallback] = useState(null);
  const [callbackSuggestions, setCallbackSuggestions] = useState([]);

  useEffect(() => {
    findCallbacks();
  }, [jokes, minWordLength, minOccurrences, excludedWords]);

  const findCallbacks = () => {
    const potentialCallbacks = [];
    const words = {};
    const network = [];

    jokes.forEach((joke, jokeIndex) => {
      const jokeWords = joke.content.toLowerCase().split(/\W+/);
      network.push([]);
      jokeWords.forEach((word, wordIndex) => {
        if (word.length >= minWordLength && !excludedWords.includes(word)) {
          if (words[word]) {
            words[word].occurrences++;
            words[word].positions.push({ jokeIndex, wordIndex });
            network[jokeIndex].push(words[word].positions[0].jokeIndex);
          } else {
            words[word] = { 
              occurrences: 1, 
              positions: [{ jokeIndex, wordIndex }]
            };
          }
        }
      });
    });

    Object.entries(words).forEach(([word, data]) => {
      if (data.occurrences >= minOccurrences) {
        for (let i = 1; i < data.positions.length; i++) {
          potentialCallbacks.push({
            word: word,
            originalJoke: data.positions[0].jokeIndex,
            callbackJoke: data.positions[i].jokeIndex,
            originalPosition: data.positions[0].wordIndex,
            callbackPosition: data.positions[i].wordIndex,
            occurrences: data.occurrences
          });
        }
      }
    });

    setCallbacks(potentialCallbacks);
    setCallbackNetwork(network);
  };

  const generateCallbackSuggestions = (callback) => {
    const originalJoke = jokes[callback.originalJoke].content;
    const callbackJoke = jokes[callback.callbackJoke].content;
    const wordContext = getWordContext(originalJoke, callback.originalPosition);

    const suggestions = [
      `Remember ${wordContext} from earlier? Well, now ${callback.word}...`,
      `Speaking of ${callback.word}, it reminds me of when I said ${wordContext}...`,
      `That ${callback.word} situation? It's just like the ${wordContext} I mentioned before...`,
      `You thought ${wordContext} was bad? Wait till you hear about this ${callback.word}...`,
      `Remember when I talked about ${wordContext}? This ${callback.word} is even crazier...`
    ];

    setCallbackSuggestions(suggestions);
  };

  const getWordContext = (text, position) => {
    const words = text.split(/\W+/);
    const start = Math.max(0, position - 2);
    const end = Math.min(words.length, position + 3);
    return words.slice(start, end).join(' ');
  };

  const handleCallbackClick = (callback) => {
    setSelectedCallback(callback);
    generateCallbackSuggestions(callback);
  };

  return (
    <div className="callback-tracker">
      <h2>Callback Tracker</h2>
      <div className="controls">
        <label>
          Minimum Word Length:
          <input 
            type="number" 
            value={minWordLength} 
            onChange={(e) => setMinWordLength(Number(e.target.value))}
            min="2"
          />
        </label>
        <label>
          Minimum Occurrences:
          <input 
            type="number" 
            value={minOccurrences} 
            onChange={(e) => setMinOccurrences(Number(e.target.value))}
            min="2"
          />
        </label>
        <label>
          Excluded Words (comma-separated):
          <input 
            type="text" 
            value={excludedWords.join(', ')} 
            onChange={(e) => setExcludedWords(e.target.value.split(',').map(word => word.trim()))}
          />
        </label>
      </div>
      <button onClick={findCallbacks}>Refresh Callbacks</button>
      {callbacks.length > 0 && (
        <div className="callbacks-list">
          <h3>Potential Callbacks:</h3>
          {callbacks.map((callback, index) => (
            <div key={index} className="callback-item" onClick={() => handleCallbackClick(callback)}>
              <p>
                "{callback.word}" (Occurrences: {callback.occurrences})
                <br />
                Original: Joke {callback.originalJoke + 1}, Word {callback.originalPosition + 1}
                <br />
                Callback: Joke {callback.callbackJoke + 1}, Word {callback.callbackPosition + 1}
              </p>
            </div>
          ))}
        </div>
      )}
      {selectedCallback && (
        <div className="callback-details">
          <h3>Callback Details</h3>
          <p>Original Joke: {jokes[selectedCallback.originalJoke].content}</p>
          <p>Callback Joke: {jokes[selectedCallback.callbackJoke].content}</p>
          <h4>Callback Suggestions:</h4>
          <ul>
            {callbackSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="callback-network">
        <h3>Callback Network</h3>
        <div className="network-visualization">
          {callbackNetwork.map((connections, jokeIndex) => (
            <div key={jokeIndex} className="joke-node">
              Joke {jokeIndex + 1}
              {connections.map((connection, index) => (
                <div key={index} className="connection-line" style={{
                  top: `${(connection - jokeIndex) * 30}px`,
                  height: `${Math.abs(connection - jokeIndex) * 30}px`
                }}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CallbackTracker;