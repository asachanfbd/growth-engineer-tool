import React, { useState, useEffect } from 'react';
import './App.css';
import {Box, AppBar, Toolbar, Typography, Button} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomeIcon from '@mui/icons-material/Home';
import EmptyPage from './Pages/EmptyPage';
import SocialPage from './Pages/SocialPage';
import PageMeta from './Pages/PageMeta';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    primary: {
      main: '#007FFF',
      dark: '#0066CC',
    },
  },
});

const navItems = {
  "home"      : <HomeIcon />, 
  "meta"      : 'Meta', 
  "social"    : 'Social', 
  "schema"    : 'Schema'};

function App() {
  const [metadata, setMetadata] = useState({});

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
    const pagemeta = {
      atitle: {
          "key": "Page Title", 
          "value": document.title, 
          "isEditable": true, 
          "maxLength": 60,
          "fieldType": "text",
          "showCopyButton": true
      },
      bdescription:{"key": "Meta Description",
          "fieldType": "text", "value": (document.querySelector('meta[name="description"]')?.getAttribute('content') || ''), "isEditable": true, "maxLength": 160},
      clang:{"key": "Lang",
          "fieldType": "text", "value": document.querySelector('html').getAttribute('lang')},
      durl:{"key": "Page URL",
          "fieldType": "text", "value": document.URL},
      ecanonical:{"key": "Canonical URL",
          "fieldType": "text", "value": document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '', "isWarning":(document.querySelector('link[rel="canonical"]')?.getAttribute('href') !== document.URL)},
      frobots:{"key": "Robots",
          "fieldType": "text", "value": document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''},
      gimages:{
          "key": "Images", 
          "value":"", 
          "showCopyButton": false, 
          "fieldType":"imageslist", 
          "list": Array.from(document.querySelectorAll('img')).map(img => ({
              src: img.src,
              alt: img.alt,
          }))
      },
      hlinks:{
          "key": "Links", 
          "value":"", 
          "showCopyButton": false, 
          "fieldType":"linkslist", 
          "list": Array.from(document.querySelectorAll('a')).map(link => ({
              href: link.href,
              innerHTML: link.innerHTML,
          }))
      }
    };
    const socialdata = {
      iog_title:{"key": "OG Title", "fieldType": "text", "value": document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '', "isEditable": true},
      
      jog_description:{"key": "OG Description", "fieldType": "text", "value": document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '', "isEditable": true},
      
      kog_image:{"key": "OG Image", "value": document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '', "fieldType": "image"}
    };
    return {"pagemeta": pagemeta, "socialmeta": socialdata};
  }

  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tab) => {
    console.log("metadata[pagemeta]");
    console.log(metadata["pagemeta"]);
    setActiveTab(tab);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Growth Toolkit
            </Typography>
            <Box>
              {Object.keys(navItems).map((key) => (
                <Button key={key} sx={{ color: '#fff' }} onClick={() => handleTabChange(key)}>
                  {navItems[key]}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <div style={{ minWidth: 500 }}>
          {activeTab=="home" && <PageMeta metadata={metadata["pagemeta"]} />}
          {activeTab=="meta" && <PageMeta metadata={metadata["pagemeta"]} />}
          {activeTab=="social" && <SocialPage metadata={metadata["socialmeta"]} />}
          {activeTab=="schema" && <EmptyPage pageName={navItems['schema']} />}
        </div>
      </Box>
    </ThemeProvider>
  );
}

export default App;