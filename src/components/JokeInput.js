import React, { useState } from 'react';

function JokeInput({ addJoke }) {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addJoke({
      type: 'text',
      content: text,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      timestamp: new Date().toISOString()
    });
    setText('');
    setKeywords('');
  };

  return (
    <form onSubmit={handleSubmit} className="joke-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your joke here..."
      />
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Keywords (comma-separated)"
      />
      <button type="submit">Save Joke</button>
    </form>
  );
}

export default JokeInput;