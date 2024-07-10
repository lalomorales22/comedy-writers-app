import React, { useState, useEffect } from 'react';

const jokesDatabase = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!", category: "Science", complexity: 2 },
  { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field!", category: "Wordplay", complexity: 3 },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up!", category: "Food", complexity: 1 },
  { setup: "What do you call a fake noodle?", punchline: "An impasta!", category: "Food", complexity: 2 },
  { setup: "Why did the math book look so sad?", punchline: "Because it had too many problems.", category: "Education", complexity: 2 },
  { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts.", category: "Halloween", complexity: 3 },
  { setup: "What do you call a can opener that doesn't work?", punchline: "A can't opener!", category: "Household", complexity: 2 },
  { setup: "Why did the golfer bring two pairs of pants?", punchline: "In case he got a hole in one!", category: "Sports", complexity: 4 },
  { setup: "How do you organize a space party?", punchline: "You planet!", category: "Space", complexity: 3 },
  { setup: "Why did the invisible man turn down the job offer?", punchline: "He couldn't see himself doing it.", category: "Fantasy", complexity: 3 },
  // Add more jokes here...
];

const fusionMethods = [
  { name: "Simple Fusion", method: (joke1, joke2) => ({ 
    setup: joke1.setup.split(' ').slice(0, -3).join(' ') + ' ' + joke2.setup.split(' ').slice(-3).join(' '),
    punchline: joke1.punchline.split(' ').slice(0, 2).join(' ') + ' ' + joke2.punchline.split(' ').slice(2).join(' ')
  })},
  { name: "Crossover", method: (joke1, joke2) => ({
    setup: joke1.setup,
    punchline: joke2.punchline
  })},
  { name: "Mashup", method: (joke1, joke2) => ({
    setup: `Why did the ${joke1.setup.split(' ').slice(-1)[0]} ${joke2.setup.split(' ').slice(-1)[0]}?`,
    punchline: `Because ${joke1.punchline.toLowerCase()}`
  })},
  { name: "Double Punchline", method: (joke1, joke2) => ({
    setup: joke1.setup,
    punchline: `${joke1.punchline} And that's why ${joke2.punchline.toLowerCase()}`
  })},
];

function EnhancedJokeFusionGenerator() {
  const [fusedJoke, setFusedJoke] = useState({ setup: '', punchline: '' });
  const [jokeHistory, setJokeHistory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [complexityRange, setComplexityRange] = useState([1, 5]);
  const [selectedMethod, setSelectedMethod] = useState(fusionMethods[0].name);
  const [customJoke, setCustomJoke] = useState({ setup: '', punchline: '' });

  useEffect(() => {
    const savedHistory = localStorage.getItem('jokeHistory');
    if (savedHistory) {
      setJokeHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jokeHistory', JSON.stringify(jokeHistory));
  }, [jokeHistory]);

  const generateFusion = () => {
    let filteredJokes = jokesDatabase;
    
    if (selectedCategories.length > 0) {
      filteredJokes = filteredJokes.filter(joke => selectedCategories.includes(joke.category));
    }
    
    filteredJokes = filteredJokes.filter(joke => 
      joke.complexity >= complexityRange[0] && joke.complexity <= complexityRange[1]
    );

    if (filteredJokes.length < 2) {
      alert("Not enough jokes match the selected criteria. Please adjust your filters.");
      return;
    }

    const joke1 = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
    let joke2 = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
    while (joke2 === joke1) {
      joke2 = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
    }

    const fusionMethod = fusionMethods.find(method => method.name === selectedMethod).method;
    const newFusedJoke = fusionMethod(joke1, joke2);

    setFusedJoke(newFusedJoke);
    setJokeHistory(prevHistory => [newFusedJoke, ...prevHistory.slice(0, 9)]);
  };

  const addCustomJoke = () => {
    if (customJoke.setup && customJoke.punchline) {
      jokesDatabase.push({...customJoke, category: "Custom", complexity: 3});
      setCustomJoke({ setup: '', punchline: '' });
      alert("Custom joke added successfully!");
    } else {
      alert("Please enter both setup and punchline for the custom joke.");
    }
  };

  const categories = [...new Set(jokesDatabase.map(joke => joke.category))];

  return (
    <div className="enhanced-joke-fusion-generator">
      <h2>Joke Fusion Generator</h2>
      <div className="controls">
        <div className="categories">
          <h4>Select Categories:</h4>
          {categories.map(category => (
            <label key={category}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => {
                  setSelectedCategories(prev => 
                    prev.includes(category) 
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                }}
              />
              {category}
            </label>
          ))}
        </div>
        <div className="complexity">
          <h4>Joke Complexity:</h4>
          <input
            type="range"
            min="1"
            max="5"
            value={complexityRange[0]}
            onChange={(e) => setComplexityRange([parseInt(e.target.value), complexityRange[1]])}
          />
          <input
            type="range"
            min="1"
            max="5"
            value={complexityRange[1]}
            onChange={(e) => setComplexityRange([complexityRange[0], parseInt(e.target.value)])}
          />
          <span>Range: {complexityRange[0]} - {complexityRange[1]}</span>
        </div>
        <div className="fusion-method">
          <h4>Fusion Method:</h4>
          <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
            {fusionMethods.map(method => (
              <option key={method.name} value={method.name}>{method.name}</option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={generateFusion}>Generate Fused Joke</button>
      {fusedJoke.setup && (
        <div className="fused-joke">
          <h3>Fused Joke:</h3>
          <p><strong>Setup:</strong> {fusedJoke.setup}</p>
          <p><strong>Punchline:</strong> {fusedJoke.punchline}</p>
        </div>
      )}
      <div className="joke-history">
        <h3>Joke Fusion History:</h3>
        <ul>
          {jokeHistory.map((joke, index) => (
            <li key={index}>
              <strong>Setup:</strong> {joke.setup}<br />
              <strong>Punchline:</strong> {joke.punchline}
            </li>
          ))}
        </ul>
      </div>
      <div className="custom-joke-input">
        <h3>Add Custom Joke:</h3>
        <input
          type="text"
          placeholder="Setup"
          value={customJoke.setup}
          onChange={(e) => setCustomJoke(prev => ({...prev, setup: e.target.value}))}
        />
        <input
          type="text"
          placeholder="Punchline"
          value={customJoke.punchline}
          onChange={(e) => setCustomJoke(prev => ({...prev, punchline: e.target.value}))}
        />
        <button onClick={addCustomJoke}>Add Custom Joke</button>
      </div>
    </div>
  );
}

export default EnhancedJokeFusionGenerator;