import './App.css';
import { useState } from 'react';
import { MemeForm, RequestHistory } from './components.js';

sessionStorage.length === 0 &&
  sessionStorage.setItem('memeHistory', JSON.stringify([]));

function App() {
  const [memeRequest, setMemeRequest] = useState({
    memeTemplate: 'buzz',
    topText: 'memes',
    bottomText: 'memes everywhere',
  });

  return (
    <div className="App">
      <h2>react meme generator</h2>
      <MemeForm memeRequest={memeRequest} setMemeRequest={setMemeRequest} />
      <br />
      <div>
        <img
          src={`https://api.memegen.link/images/${memeRequest.memeTemplate}/${memeRequest.topText}/${memeRequest.bottomText}.gif`}
          alt="preview of your meme"
          data-test-id="meme-image"
          width="300px"
        />
      </div>
      <br />
      <RequestHistory />
    </div>
  );
}

export default App;
