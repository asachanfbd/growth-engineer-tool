import React, { useState, useEffect } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MetaField from './Components/PageMeta/MetaField';

// var chromeconsole = chrome.extension.getBackgroundPage();

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
    const title = {"key": "Page Title", "value": document.title};
    const description = {"key": "Meta Description", "value": (document.querySelector('meta[name="description"]')?.getAttribute('content') || '')};
    const lang = document.querySelector('html').getAttribute('lang')
    const url = document.URL
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''
    const author = document.querySelector('meta[name="author"]')?.getAttribute('content') || ''
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || ''
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
    }));
    const links = Array.from(document.querySelectorAll('a')).map(link => ({
        href: link.href,
        innerText: link.innerText || link.textContent || "~~~Empty~~~",
    }));
    
    return { title, description, lang, url, canonical, robots, author, ogTitle, ogDescription, ogImage, images, links};
  }

return (
    <div className="metadata-container">
        <h2>Page Metadata</h2>
        <Stack spacing={2}>
            <MetaField data={metadata.title} isEditable={true} maxLength={60}/>
            <MetaField data={metadata.description}  isEditable={true} maxLength={160} />
        </Stack>
        <p><strong>Lang:</strong> {metadata.lang}</p>
        <p><strong>URL:</strong> {metadata.url}</p>
        <p><strong>Canonical:</strong> {metadata.canonical}</p>
        <p><strong>Robots:</strong> {metadata.robots}</p>
        <p><strong>Author:</strong> {metadata.author}</p>
        <p><strong>OG Title:</strong> {metadata.ogTitle}</p>
        <p><strong>OG Description:</strong> {metadata.ogDescription}</p>
        <p><strong>OG Image:</strong> {metadata.ogImage}</p>
        <p><strong>Images:</strong></p>
        <ol>
            { metadata.images  && Array.isArray(metadata.images) ? metadata.images.map((image, index) => (
                    <li key={index}><img src={image.src} alt={image.alt} width="50px" /></li>
            )) : <li>No images found</li>}
        </ol>
        <p><strong>Links:</strong></p>
        <ol>
            {metadata.links && Array.isArray(metadata.links) ? metadata.links.map((link, index) => (
                    <li key={index}><a href={link.href}>{link.innerText}</a></li>
            )) : <li>No links found</li>}
        </ol>
    </div>
);
}

export default App;