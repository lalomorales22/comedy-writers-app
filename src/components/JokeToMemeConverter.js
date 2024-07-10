import React, { useState, useRef, useEffect } from 'react';

const memeTemplates = [
  { name: 'Classic', background: '/meme-templates/classic.jpg' },
  { name: 'Doge', background: '/meme-templates/doge.jpg' },
  { name: 'Distracted Boyfriend', background: '/meme-templates/distracted-boyfriend.jpg' },
  { name: 'Woman Yelling at Cat', background: '/meme-templates/woman-yelling-at-cat.jpg' },
  { name: 'Drake', background: '/meme-templates/drake.jpg' },
];

function JokeToMemeConverter() {
  const [jokeText, setJokeText] = useState('');
  const [memeText, setMemeText] = useState({ topText: '', bottomText: '' });
  const [selectedTemplate, setSelectedTemplate] = useState(memeTemplates[0]);
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textShadow, setTextShadow] = useState(true);
  const canvasRef = useRef(null);
  const [memeHistory, setMemeHistory] = useState([]);

  useEffect(() => {
    if (memeText.topText || memeText.bottomText) {
      drawMemeOnCanvas();
    }
  }, [memeText, selectedTemplate, fontSize, textColor, textShadow]);

  const convertToMeme = () => {
    const parts = jokeText.split('\n');
    if (parts.length >= 2) {
      setMemeText({
        topText: parts[0],
        bottomText: parts[parts.length - 1]
      });
    } else {
      const words = jokeText.split(' ');
      const middleIndex = Math.floor(words.length / 2);
      setMemeText({
        topText: words.slice(0, middleIndex).join(' '),
        bottomText: words.slice(middleIndex).join(' ')
      });
    }
  };

  const drawMemeOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.font = `bold ${fontSize}px Impact`;
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      
      if (textShadow) {
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 7;
        ctx.lineWidth = 5;
      }

      // Draw top text
      ctx.fillText(memeText.topText, canvas.width / 2, 50);
      if (textShadow) {
        ctx.strokeText(memeText.topText, canvas.width / 2, 50);
      }

      // Draw bottom text
      ctx.fillText(memeText.bottomText, canvas.width / 2, canvas.height - 20);
      if (textShadow) {
        ctx.strokeText(memeText.bottomText, canvas.width / 2, canvas.height - 20);
      }
    };
    img.src = selectedTemplate.background;
  };

  const saveMeme = () => {
    const canvas = canvasRef.current;
    const memeDataUrl = canvas.toDataURL('image/png');
    setMemeHistory(prevHistory => [...prevHistory, { 
      dataUrl: memeDataUrl, 
      joke: jokeText,
      template: selectedTemplate.name
    }]);
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'joke-meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="joke-to-meme-converter">
      <h2>Joke-to-Meme Converter</h2>
      <textarea
        value={jokeText}
        onChange={(e) => setJokeText(e.target.value)}
        placeholder="Enter your joke here"
      />
      <div className="meme-controls">
        <select onChange={(e) => setSelectedTemplate(memeTemplates.find(t => t.name === e.target.value))}>
          {memeTemplates.map(template => (
            <option key={template.name} value={template.name}>{template.name}</option>
          ))}
        </select>
        <input 
          type="number" 
          value={fontSize} 
          onChange={(e) => setFontSize(Number(e.target.value))} 
          min="12" 
          max="72"
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
        <label>
          Text Shadow:
          <input
            type="checkbox"
            checked={textShadow}
            onChange={(e) => setTextShadow(e.target.checked)}
          />
        </label>
      </div>
      <button onClick={convertToMeme}>Convert to Meme</button>
      <button onClick={saveMeme}>Save Meme</button>
      <button onClick={downloadMeme}>Download Meme</button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="meme-display">
        <img src={canvasRef.current?.toDataURL()} alt="Generated Meme" />
      </div>
      <div className="meme-history">
        <h3>Meme History</h3>
        {memeHistory.map((meme, index) => (
          <div key={index} className="history-item">
            <img src={meme.dataUrl} alt={`Meme ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
            <p>{meme.joke}</p>
            <p>Template: {meme.template}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JokeToMemeConverter;