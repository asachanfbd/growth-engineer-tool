import React, { useState } from 'react';
import { Card, CardContent, Typography, CardHeader, CardActions, Stack, CardMedia, Divider, Chip, Avatar, Box, CircularProgress } from '@mui/material';
import { indigo } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageInfoRow from '../ImageInfoRow/ImageInfoRow';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Tooltip from '@mui/material/Tooltip';


const MetaLinksListField = ({ data, currentUrl = '', isEditable = false, showCopyButton = true, maxLength = 0, isWarning = false }) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [brokenLinks, setBrokenLinks] = useState({ internal: [], external: [] });
    const [linkStatuses, setLinkStatuses] = useState({});
    const [linkErrors, setLinkErrors] = useState({});

    const currentHostname = new URL(currentUrl).hostname;

    const internalLinks = data.list.filter(item => {
        try {
            const linkHostname = new URL(item.href).hostname;
            return linkHostname === currentHostname;
        } catch (e) {
            return false;
        }
    });

    const externalLinks = data.list.filter(item => {
        if (!item.href) return false;
        try {
            return new URL(item.href).hostname !== currentHostname;
        } catch {
            return false;
        }
    }).sort((a, b) => a.href?.localeCompare(b.href) || 0);
    
    const LinkStatus = ({ href }) => {
        if (!linkStatuses[href]) {
            return <CircularProgress size="12px" />;
        }
        return (
            <Box component="span" sx={{ ml: 1 }}>
                {linkStatuses[href] === 'checking' && 
                    <Tooltip title="Checking Link Status" placement="bottom-end"><CircularProgress size="12px" /></Tooltip>
                }
                {linkStatuses[href] === 'broken' && 
                    <Tooltip title={linkErrors[href]} placement="bottom-end"><HighlightOffIcon color="error" fontSize="inherit" /></Tooltip>
                }
                {linkStatuses[href] === 'valid' && 
                    <Tooltip title="Link is Valid" placement="bottom-end"><CheckCircleOutlineIcon color="success" fontSize="inherit" /></Tooltip>
                }
            </Box>
        );
    };

    const checkLinks = async (internalList, externalList) => {
        const checkLink = async (link) => {
            try {
                setLinkStatuses(prev => ({ ...prev, [link.href]: 'checking' }));
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
                
                const response = await fetch(link.href, { 
                    method: 'HEAD',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setLinkStatuses(prev => ({ ...prev, [link.href]: 'valid' }));
                return null;
            } catch (error) {
                setLinkStatuses(prev => ({ ...prev, [link.href]: 'broken' }));
                setLinkErrors(prev => ({ ...prev, [link.href]: error.message }));
                return link;
            }
        };

        // Process links in batches to prevent overwhelming the browser
        const batchSize = 5;
        const checkBatch = async (links) => {
            const results = [];
            for (let i = 0; i < links.length; i += batchSize) {
                const batch = links.slice(i, i + batchSize);
                const batchResults = await Promise.all(batch.map(checkLink));
                results.push(...batchResults);
            }
            return results;
        };

        const [internal, external] = await Promise.all([
            checkBatch(internalList),
            checkBatch(externalList)
        ]);

        setBrokenLinks({
            internal: internal.filter(Boolean),
            external: external.filter(Boolean)
        });
    };

    React.useEffect(() => {
        checkLinks(internalLinks, externalLinks);
    }, []);

    const handleImageClick = (src) => {
        setSelectedImage(src);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const renderLinks = (links, title, brokenLinksArray) => (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component="span" sx={{ width: '40%', flexShrink: 0 }}>{title} ({links.length})</Typography>
                {brokenLinksArray.length > 0 && <Typography color='error'>Broken ({brokenLinksArray.length}/{links.length})</Typography>}
            </AccordionSummary>
            <AccordionDetails>
                <List dense>
                    {links.map((item, index) => {
                        var imageLinked = false;
                        if (/<img[^>]+>/i.test(item.innerHTML)) {
                            imageLinked = true;
                        }
                        return (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    {imageLinked?<Avatar src={item.innerHTML.match(/src="([^"]+)"/i)?.[1] || ''} onClick={() => handleImageClick(item.innerHTML.match(/src="([^"]+)"/i)?.[1])} sx={{ cursor: 'pointer' }} ></Avatar>:<Avatar>{index+1}</Avatar>}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>{imageLinked?"Image Linked":item.innerHTML.replace(/<[^>]+>/g, '').trim()} <LinkStatus href={item.href} /></>}
                                    secondary={<>{item.href}</>}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </AccordionDetails>
            {selectedImage && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1300
                    }}
                    onClick={handleCloseModal}
                    >
                    <img
                        src={selectedImage}
                        style={{
                            maxWidth: '80%',
                            maxHeight: '80vh',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            )}
        </Accordion>
    );

    return (
        <>
            {renderLinks(externalLinks, 'External Links', brokenLinks.external)}
            {renderLinks(internalLinks, 'Internal Links', brokenLinks.internal)}
        </>
    );
};

export default MetaLinksListField;