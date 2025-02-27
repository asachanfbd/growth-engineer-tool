import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getPageMetadata,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            setMetadata(results[0].result);
          }
        }
      );
    });
  }, []);

  function getPageMetadata() {
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    console.log({ title, description, keywords });
    return { title, description, keywords };
  }

  return (
    <div className="metadata-container">
      <h2>Page Metadata</h2>
      <p><strong>Title:</strong> {metadata.title}</p>
      <p><strong>Description:</strong> {metadata.description}</p>
      <p><strong>Keywords:</strong> {metadata.keywords}</p>
    </div>
  );
}

export default App;