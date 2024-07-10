import React, { useState, useEffect } from 'react';

const initialSubgenres = {
  'Observational': 'Point out the absurdities in everyday situations. Start with "Have you ever noticed...?"',
  'Dark Humor': 'Add a twisted or morbid element. Make sure it\'s more shocking than offensive.',
  'Surrealist': 'Introduce completely unexpected and illogical elements. The more absurd, the better!',
  'Physical Comedy': 'Describe exaggerated actions or slapstick elements. Think about how you could act it out.',
  'Wordplay': 'Focus on puns or double meanings. Try to incorporate a play on words.',
  'Self-deprecating': 'Make yourself the butt of the joke. Exaggerate your flaws or mishaps.',
  'Satire': 'Target societal issues or cultural norms. Use irony to make your point.',
  'Anti-humor': 'Subvert expectations by deliberately avoiding a traditional punchline. Be as mundane as possible.',
  'Topical': 'Reference current events or pop culture. Make sure it\'s timely and relevant.',
  'Anecdotal': 'Tell a personal story with a comedic twist. Embellish for comedic effect.',
  'Shock Humor': 'Push boundaries with controversial topics. Use discretion and read the room.',
  'Cringe Comedy': 'Create awkward situations that make the audience uncomfortable yet amused.',
};

function ComedySubgenreExplorer() {
  const [joke, setJoke] = useState('');
  const [selectedSubgenres, setSelectedSubgenres] = useState([]);
  const [adaptation, setAdaptation] = useState('');
  const [subgenres, setSubgenres] = useState(initialSubgenres);
  const [newSubgenre, setNewSubgenre] = useState({ name: '', description: '' });
  const [jokeHistory, setJokeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedSubgenres = localStorage.getItem('comedySubgenres');
    if (savedSubgenres) {
      setSubgenres(JSON.parse(savedSubgenres));
    }
    const savedHistory = localStorage.getItem('jokeAdaptationHistory');
    if (savedHistory) {
      setJokeHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('comedySubgenres', JSON.stringify(subgenres));
  }, [subgenres]);

  useEffect(() => {
    localStorage.setItem('jokeAdaptationHistory', JSON.stringify(jokeHistory));
  }, [jokeHistory]);

  const adaptJoke = () => {
    if (joke && selectedSubgenres.length > 0) {
      let adaptedJoke = joke;
      let adaptationSteps = [];

      selectedSubgenres.forEach(subgenre => {
        const adaptation = generateAdaptation(adaptedJoke, subgenre);
        adaptedJoke = adaptation.joke;
        adaptationSteps.push({
          subgenre,
          description: subgenres[subgenre],
          adaptation: adaptation.explanation
        });
      });

      const fullAdaptation = adaptationSteps.map(step => 
        `${step.subgenre}:\n${step.description}\n${step.adaptation}\n`
      ).join('\n');

      setAdaptation(`Original Joke:\n${joke}\n\nAdapted Joke:\n${adaptedJoke}\n\nAdaptation Process:\n${fullAdaptation}`);
      
      setJokeHistory([...jokeHistory, {
        original: joke,
        adapted: adaptedJoke,
        subgenres: selectedSubgenres,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const generateAdaptation = (originalJoke, subgenre) => {
    // This is a simplified adaptation. In a real-world scenario, you might use more sophisticated NLP techniques.
    let adaptedJoke = originalJoke;
    let explanation = '';

    switch (subgenre) {
      case 'Observational':
        adaptedJoke = `Have you ever noticed that ${originalJoke.toLowerCase()}?`;
        explanation = 'Framed the joke as an observation about everyday life.';
        break;
      case 'Dark Humor':
        adaptedJoke = `${originalJoke} ...and then everyone died.`;
        explanation = 'Added a morbid twist to the end of the joke.';
        break;
      case 'Surrealist':
        adaptedJoke = `${originalJoke} Suddenly, a fish wearing a top hat floats by.`;
        explanation = 'Introduced an absurd and unexpected element to the joke.';
        break;
      // Add cases for other subgenres...
      default:
        explanation = 'Applied general principles of the subgenre to modify the joke.';
    }

    return { joke: adaptedJoke, explanation };
  };

  const addNewSubgenre = () => {
    if (newSubgenre.name && newSubgenre.description) {
      setSubgenres({
        ...subgenres,
        [newSubgenre.name]: newSubgenre.description
      });
      setNewSubgenre({ name: '', description: '' });
    }
  };

  return (
    <div className="comedy-subgenre-explorer">
      <h2>Comedy Subgenre Explorer</h2>
      <textarea
        value={joke}
        onChange={(e) => setJoke(e.target.value)}
        placeholder="Enter your original joke here"
      />
      <div className="subgenre-selection">
        {Object.keys(subgenres).map((subgenre) => (
          <label key={subgenre}>
            <input
              type="checkbox"
              checked={selectedSubgenres.includes(subgenre)}
              onChange={() => {
                setSelectedSubgenres(prev => 
                  prev.includes(subgenre)
                    ? prev.filter(s => s !== subgenre)
                    : [...prev, subgenre]
                );
              }}
            />
            {subgenre}
          </label>
        ))}
      </div>
      <button onClick={adaptJoke}>Adapt Joke</button>
      {adaptation && (
        <div className="adaptation-suggestion">
          <h3>Adaptation Suggestion:</h3>
          <pre>{adaptation}</pre>
        </div>
      )}
      <div className="new-subgenre-form">
        <h3>Add New Subgenre</h3>
        <input
          type="text"
          value={newSubgenre.name}
          onChange={(e) => setNewSubgenre({...newSubgenre, name: e.target.value})}
          placeholder="Subgenre name"
        />
        <textarea
          value={newSubgenre.description}
          onChange={(e) => setNewSubgenre({...newSubgenre, description: e.target.value})}
          placeholder="Subgenre description"
        />
        <button onClick={addNewSubgenre}>Add Subgenre</button>
      </div>
      <div className="joke-history">
        <h3>Adaptation History</h3>
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
        {showHistory && (
          <ul>
            {jokeHistory.map((entry, index) => (
              <li key={index}>
                <strong>Original:</strong> {entry.original}<br />
                <strong>Adapted:</strong> {entry.adapted}<br />
                <strong>Subgenres:</strong> {entry.subgenres.join(', ')}<br />
                <strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ComedySubgenreExplorer;