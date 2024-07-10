import React, { useState, useEffect } from 'react';

function JokeEvolutionTimeline() {
  const [jokes, setJokes] = useState({});
  const [currentJoke, setCurrentJoke] = useState('');
  const [selectedJokeId, setSelectedJokeId] = useState(null);
  const [jokeTitle, setJokeTitle] = useState('');
  const [editingVersion, setEditingVersion] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    const savedJokes = localStorage.getItem('jokeEvolutionTimeline');
    if (savedJokes) {
      setJokes(JSON.parse(savedJokes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jokeEvolutionTimeline', JSON.stringify(jokes));
  }, [jokes]);

  const addJokeVersion = () => {
    if (currentJoke.trim()) {
      const newVersion = {
        version: (jokes[selectedJokeId]?.versions.length || 0) + 1,
        text: currentJoke,
        timestamp: new Date().toISOString()
      };

      setJokes(prevJokes => ({
        ...prevJokes,
        [selectedJokeId]: {
          ...prevJokes[selectedJokeId],
          versions: [...(prevJokes[selectedJokeId]?.versions || []), newVersion]
        }
      }));

      setCurrentJoke('');
    }
  };

  const createNewJoke = () => {
    if (jokeTitle.trim()) {
      const newJokeId = Date.now().toString();
      setJokes(prevJokes => ({
        ...prevJokes,
        [newJokeId]: { title: jokeTitle, versions: [] }
      }));
      setSelectedJokeId(newJokeId);
      setJokeTitle('');
    }
  };

  const editVersion = (versionIndex) => {
    setEditingVersion(versionIndex);
    setCurrentJoke(jokes[selectedJokeId].versions[versionIndex].text);
  };

  const saveEditedVersion = () => {
    if (currentJoke.trim() && editingVersion !== null) {
      setJokes(prevJokes => ({
        ...prevJokes,
        [selectedJokeId]: {
          ...prevJokes[selectedJokeId],
          versions: prevJokes[selectedJokeId].versions.map((v, index) =>
            index === editingVersion ? { ...v, text: currentJoke } : v
          )
        }
      }));
      setEditingVersion(null);
      setCurrentJoke('');
    }
  };

  const calculateWordDiff = (oldText, newText) => {
    const oldWords = oldText.split(' ');
    const newWords = newText.split(' ');
    let diffHtml = '';

    let i = 0, j = 0;
    while (i < oldWords.length || j < newWords.length) {
      if (i >= oldWords.length) {
        diffHtml += `<span class="added">${newWords.slice(j).join(' ')}</span>`;
        break;
      }
      if (j >= newWords.length) {
        diffHtml += `<span class="removed">${oldWords.slice(i).join(' ')}</span>`;
        break;
      }
      if (oldWords[i] === newWords[j]) {
        diffHtml += `${oldWords[i]} `;
        i++; j++;
      } else {
        diffHtml += `<span class="removed">${oldWords[i]}</span> `;
        diffHtml += `<span class="added">${newWords[j]}</span> `;
        i++; j++;
      }
    }

    return diffHtml;
  };

  return (
    <div className="joke-evolution-timeline">
      <h2>Joke Evolution Timeline</h2>
      <div className="joke-selector">
        <select onChange={(e) => setSelectedJokeId(e.target.value)} value={selectedJokeId || ''}>
          <option value="">Select a joke</option>
          {Object.entries(jokes).map(([id, joke]) => (
            <option key={id} value={id}>{joke.title}</option>
          ))}
        </select>
        <input
          type="text"
          value={jokeTitle}
          onChange={(e) => setJokeTitle(e.target.value)}
          placeholder="New joke title"
        />
        <button onClick={createNewJoke}>Create New Joke</button>
      </div>
      {selectedJokeId && (
        <>
          <textarea
            value={currentJoke}
            onChange={(e) => setCurrentJoke(e.target.value)}
            placeholder="Enter your joke version here"
          />
          <button onClick={editingVersion !== null ? saveEditedVersion : addJokeVersion}>
            {editingVersion !== null ? 'Save Edit' : 'Add Version'}
          </button>
          <label>
            <input
              type="checkbox"
              checked={showDiff}
              onChange={(e) => setShowDiff(e.target.checked)}
            />
            Show differences
          </label>
          <div className="timeline">
            {jokes[selectedJokeId].versions.map((version, index) => (
              <div key={index} className="version-entry">
                <h4>Version {version.version}</h4>
                {showDiff && index > 0 ? (
                  <div dangerouslySetInnerHTML={{
                    __html: calculateWordDiff(
                      jokes[selectedJokeId].versions[index - 1].text,
                      version.text
                    )
                  }} />
                ) : (
                  <p>{version.text}</p>
                )}
                <small>{new Date(version.timestamp).toLocaleString()}</small>
                <button onClick={() => editVersion(index)}>Edit</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default JokeEvolutionTimeline;