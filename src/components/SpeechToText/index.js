/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import TextBox from '../TextBox';

import languages from './languages.json';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const mic = new SpeechRecognition();

mic.continue = true;
mic.interimResult = true;

function SpeechToText() {
  const [isListing, setIsListing] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('tr');
  const [targetLanguageCode, setTargetLanguageCode] = useState('ar');
  const [originalText, setOriginalText] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);

  const getTranslation = useCallback(async (transcript) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.append('q', transcript);
      encodedParams.append('target', targetLanguageCode);
      encodedParams.append('source', speechLanguage);

      const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/json',
          'X-RapidAPI-Key': '469c1ee794msh8a7c6f3db2abd58p1e322ejsn1ead0ede256f',
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        },
        data: encodedParams,
      };
      const { data: { data: { translations } } } = await axios(options);
      setTranslatedText(translations[0].translatedText);
      return translations[0].translatedText;
    } catch (e) {
      return console.error(e);
    }
  }, [speechLanguage, targetLanguageCode]);

  const handleListing = useCallback(() => {
    if (isListing) {
      mic.lang = speechLanguage;
      mic.start();
      mic.onend = () => {
        console.log('Continue ...');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped ...');
        getTranslation();
      };
    }
    mic.onstart = () => {
      console.log('Microphone started');
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setOriginalText(transcript);
      getTranslation(transcript);
      mic.onerror = (eventError) => {
        console.log(eventError.error);
      };
    };
  }, [isListing, speechLanguage, getTranslation]);

  useEffect(() => {
    handleListing();
  }, [handleListing]);

  return (
    <div style={{
      height: '95vh', width: '100vw', display: 'flex', flexDirection: 'column', marginTop: '5vh',
    }}
    >
      <div style={{
        margin: '0 auto', width: '25%', border: '1p solid green', height: '5vh', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}
      >
        {console.log(languages.filter((e) => e.id === speechLanguage)[0].value)}
        From:
        <select
          value={speechLanguage}
          style={{
            padding: '0.5rem',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '18px',
          }}
          onChange={(event) => setSpeechLanguage(event.target.value)}
        >
          {languages.map((language) => (
            <option value={language.id}>{language.value}</option>
          ))}
        </select>
        To:
        <select
          value={targetLanguageCode}
          style={{
            padding: '0.5rem', fontSize: '14px', fontWeight: '600', borderRadius: '18px',
          }}
          onChange={(event) => setTargetLanguageCode(event.target.value)}
        >
          {languages.map((language) => (
            <option value={language.id}>{language.value}</option>
          ))}
        </select>
      </div>
      <div style={{
        margin: '3rem auto',
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '15vh',
      }}
      >
        <button
          style={{
            width: '10em',
            height: ' 5ex',
            backgroundImage: 'linear-gradient(135deg, #f34079 40%, #6E7FD4)',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
          }}
          type="button"
          onClick={() => {
            const target = targetLanguageCode;
            const speech = speechLanguage;
            setSpeechLanguage(target);
            setTargetLanguageCode(speech);
          }}
        >
          Switch
        </button>
        <button
          style={{
            width: '10em',
            height: ' 5ex',
            backgroundImage: 'linear-gradient(135deg, #fc894d 40%, #f34079)',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',

          }}
          type="button"
          onClick={() => setIsListing((prevState) => !prevState)}
        >
          {isListing ? 'Stop' : 'Record'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
      >
        <TextBox title="Original Text" body={originalText} />
        <TextBox title="Result" body={translatedText} />
      </div>
    </div>
  );
}

export default SpeechToText;
