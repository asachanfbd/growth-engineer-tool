import React, { useState, useEffect } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import MetaField from './Components/PageMeta/MetaField';

function App() {
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    lang: '',
    url: '',
    canonical: '',
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
    const metadata = {
        atitle:{"key": "Page Title", "value": document.title, "isEditable": true, "maxLength": 60, "showCopyButton": true },
        bdescription:{"key": "Meta Description", "value": (document.querySelector('meta[name="description"]')?.getAttribute('content') || ''), "isEditable": true, "maxLength": 160},
        clang:{"key": "Lang", "value": document.querySelector('html').getAttribute('lang')},
        durl:{"key": "Page URL", "value": document.URL},
        ecanonical:{"key": "Canonical URL", "value": document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '', "isWarning":(document.querySelector('link[rel="canonical"]')?.getAttribute('href') !== document.URL)},
        frobots:{"key": "Robots", "value": document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''},
        gog_title:{"key": "OG Title", "value": document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '', "isEditable": true},
        hog_description:{"key": "OG Description", "value": document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '', "isEditable": true},
        iog_image:{"key": "OG Image", "value": document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '', "fieldType": "image"},
        jimages:{"key": "Images", "value":"", "showCopyButton": false, "fieldType":"imageslist", "list": Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
        }))},
        klinks:{"key": "Links", "value":"", "showCopyButton": false, "fieldType":"list", "list": Array.from(document.querySelectorAll('a')).map(link => ({
            href: link.href,
            innerText: link.innerText || link.textContent || "~~~Empty~~~",
        }))}
    };
    return metadata;
  }

return (
    <div className="metadata-container">
        <h2>Page Metadata</h2>
        <Stack spacing={2}>
            {Object.keys(metadata).map(function(key) {
                return (
                    <MetaField
                        key={key}
                        data={metadata[key]}
                        isEditable={metadata[key].isEditable || false}
                        showCopyButton={metadata[key].showCopyButton || true}
                        maxLength={metadata[key].maxLength || 0}
                        isWarning={metadata[key].isWarning || false}
                        fieldType={metadata[key].fieldType || 'text'}
                    />
                );
            })}
        </Stack>
    </div>
);
}

export default App;