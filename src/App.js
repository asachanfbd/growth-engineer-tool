import React, { useState, useEffect } from 'react';
import './App.css';

var chromeconsole = chrome.extension.getBackgroundPage();

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
    const lang = document.querySelector('html').getAttribute('lang')
    const url = document.URL
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''
    const author = document.querySelector('meta[name="author"]')?.getAttribute('content') || ''
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || ''
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
    const images = document.querySelectorAll('img')
    if(images){
        images = Array.from(images)
    }else{
        images = []
    }
    chromeconsole.console.log("images");
    chromeconsole.console.log(images);
    const links = Array.from(document.querySelectorAll('a'))

    if(images && Array.isArray(images)){
        images.forEach(image => {
            chromeconsole.console.log(image.src, image.alt);
        });
    }else{
        chromeconsole.console.log('No images found');
    }
    if(links && Array.isArray(links)){
        links.forEach(link => {
            chromeconsole.console.log(link.innerText, link.href);
        });
    }else{
        chromeconsole.console.log('No links found');
    }
    chromeconsole.console.log({ title, description, keywords, lang, url, canonical, robots, author, ogTitle, ogDescription, ogImage, images, links});
    return { title, description, keywords, lang, url, canonical, robots, author, ogTitle, ogDescription, ogImage, images, links};
  }

return (
    <div className="metadata-container">
        <h2>Page Metadata</h2>
        <p><strong>Title:</strong> {metadata.title}</p>
        <p><strong>Description:</strong> {metadata.description}</p>
        <p><strong>Keywords:</strong> {metadata.keywords}</p>
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
                    <li key={index}><img src={image.src} alt={image.alt} /></li>
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