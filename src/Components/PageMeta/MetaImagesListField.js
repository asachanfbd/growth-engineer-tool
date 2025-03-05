import React, { useState } from 'react';
import { Card, CardContent, Typography, CardHeader, CardActions, Stack, CardMedia, Divider, Chip, Avatar, Box} from '@mui/material';
import { indigo } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageInfoRow from '../ImageInfoRow/ImageInfoRow';

const MetaImagesListField = ({ data, isEditable = false, showCopyButton = true, maxLength = 0, isWarning = false }) => {

    const countEmptyAlt = data.list.filter(item => item.alt == "").length;

    return (
    <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                >
                <Typography component="span" sx={{ width: '40%', flexShrink: 0 }}>{data.key} ({data.list.length})</Typography>
                {countEmptyAlt>0 && <Typography component="span" color='error'>Missing Alt ({countEmptyAlt}/{data.list.length})</Typography>}
            </AccordionSummary>
            <AccordionDetails>
                <Stack>
                    {data.fieldType === 'imageslist' && data.list.map((item, index) => (
                        <ImageInfoRow key={index} src={item.src} display_link={item.src} alt={item.alt} />
                    ))}
                    {data.fieldType === 'linkslist' && data.list.map((item, index) => (
                        <ImageInfoRow key={index} src={item.src} display_link={item.src} alt={item.alt} />
                    ))}
                </Stack>
            </AccordionDetails>
        </Accordion>
    </div>
    );
};

export default MetaImagesListField;