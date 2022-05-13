import './App.css';
import { useEffect, useState } from 'react';

let formValues = {
  memeTemplate: 'aag',
  topText: '',
  bottomText: '',
};

sessionStorage.length === 0 &&
  sessionStorage.setItem('memeHistory', JSON.stringify([]));

async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc);
  const imageBlob = await image.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  const link = document.createElement('a');
  link.href = imageURL;
  link.download = 'custom_meme';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function SessionStorage() {
  return (
    <>
      <div>
        History
        <br />
        {JSON.parse(sessionStorage.getItem('memeHistory')).map((element) => {
          return (
            <>
              <img
                width="100px"
                src={`https://api.memegen.link/images/${element.memeTemplate}/${element.topText}/${element.bottomText}.gif`}
                alt="a meme you generated"
              />
              <br />
            </>
          );
        })}
      </div>
    </>
  );
}

function RequestHistory() {
  return (
    <>
      <SessionStorage />
    </>
  );
}

function App() {
  const [memeRequest, setMemeRequest] = useState({
    memeTemplate: 'buzz',
    topText: 'it',
    bottomText: 'works',
  });
  const [memeTemplates, setMemeTemplates] = useState([]);

  useEffect(() => {
    const url = 'https://api.memegen.link/templates';
    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();
      setMemeTemplates(json);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h2>react meme generator</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMemeRequest({
            memeTemplate: formValues.memeTemplate,
            topText: formValues.topText,
            bottomText: formValues.bottomText,
          });

          // can't put this into one line
          let array;
          array = JSON.parse(sessionStorage.getItem('memeHistory'));
          array.push(formValues);
          sessionStorage.setItem('memeHistory', JSON.stringify(array));
        }}
      >
        <label htmlFor="memeTemplate">Meme template</label>
        <select
          id="memeTemplate"
          onBlur={(e) => {
            formValues.memeTemplate = e.target.value;
          }}
        >
          {memeTemplates.map((element) => {
            return <option value={element.id}>{element.name}</option>;
          })}
        </select>
        <br />
        <label htmlFor="topText">Top text</label>
        <input
          type="text"
          id="topText"
          onBlur={(e) => {
            formValues.topText = encodeURIComponent(e.target.value).replace(
              '%2F',
              '%252F',
            );
          }}
        />
        <br />
        <label htmlFor="bottomText">Bottom text</label>
        <input
          type="text"
          id="bottomText"
          onBlur={(e) => {
            formValues.bottomText = encodeURIComponent(e.target.value).replace(
              '%2F',
              '%252F',
            );
          }}
        />
        <br />
        <input data-test-id="generate-meme" type="submit" value="Generate" />
        <button
          type="button"
          onClick={() => {
            downloadImage(
              `https://api.memegen.link/images/${memeRequest.memeTemplate}/${memeRequest.topText}/${memeRequest.bottomText}.gif`,
            );
          }}
        >
          Download
        </button>
      </form>
      <br></br>
      <div>
        <img
          src={`https://api.memegen.link/images/${memeRequest.memeTemplate}/${memeRequest.topText}/${memeRequest.bottomText}.gif`}
          alt="preview of your meme"
          data-test-id="meme-image"
          width="100px"
        />
      </div>
      <br></br>
      <RequestHistory />
    </div>
  );
}

export default App;