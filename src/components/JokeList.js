import React from 'react';

function JokeList({ jokes }) {
  return (
    <div className="joke-list">
      <h2>Your Jokes</h2>
      {jokes.map(joke => (
        <div key={joke.id} className="joke-item">
          {joke.type === 'text' ? (
            <p>{joke.content}</p>
          ) : (
            <audio src={joke.content} controls />
          )}
          <p>Keywords: {joke.keywords.join(', ')}</p>
          <p>Created: {new Date(joke.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default JokeList;