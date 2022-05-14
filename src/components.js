import { useEffect, useState } from 'react';

const formValues = {
  memeTemplate: 'aag',
  topText: '',
  bottomText: '',
};

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

export function MemeForm({ memeRequest, setMemeRequest }) {
  const [memeTemplates, setMemeTemplates] = useState([]);

  useEffect(() => {
    const url = 'https://api.memegen.link/templates';
    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();
      setMemeTemplates(json);
    };

    fetchData().catch((reject) => {
      throw reject;
    });
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setMemeRequest({
          memeTemplate: formValues.memeTemplate,
          topText: formValues.topText,
          bottomText: formValues.bottomText,
        });

        // can't put this into one line
        const array = JSON.parse(sessionStorage.getItem('memeHistory'));
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
          return (
            <option key={element.id} value={element.id}>
              {element.name}
            </option>
          );
        })}
      </select>
      <br />
      <label htmlFor="topText">Top text</label>
      <input
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
          ).catch((reject) => {
            throw reject;
          });
        }}
      >
        Download
      </button>
    </form>
  );
}

export function RequestHistory() {
  return (
    <div>
      History
      <br />
      {JSON.parse(sessionStorage.getItem('memeHistory')).map((element) => {
        return (
          <div key={element.memeTemplate}>
            <img
              width="100px"
              src={`https://api.memegen.link/images/${element.memeTemplate}/${element.topText}/${element.bottomText}.gif`}
              alt="a meme you generated"
            />
            <br />
          </div>
        );
      })}
    </div>
  );
}
