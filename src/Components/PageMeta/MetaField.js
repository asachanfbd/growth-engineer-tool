import React, { useState } from 'react';
import { Card, CardContent, Typography, CardHeader, CardActions, IconButton, ExpandMore, Collapse} from '@mui/material';
import { indigo } from '@mui/material/colors';
import MetaFieldEdit from './MetaFieldEdit';

const MetaField = ({ data, isEditable = false, showCopyButton = true, maxLength = 0 }) => {
    const [editEnabled, setEditEnabled] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleCopy = (e) => {
        navigator.clipboard.writeText(data.value);
        e.target.innerText = 'Copied!';
        let ele = e.target;
        setTimeout(() => {
            ele.innerText = 'Copy ' + data.key;
        }, 1000);
    };

    const handleEdit = () => {
        setEditEnabled(!editEnabled);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card 
            variant="outlined" 
            color={(String(data.value).length > maxLength)?"error":"text.secondary"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardHeader
                title={
                    <Typography variant="caption" color={(String(data.value).length > maxLength)?"error":"text.secondary"}>
                    {data.key} {maxLength > 0 && `(${String(data.value).length}/${maxLength})`}
                    </Typography>}
                disableTypography={true}
                action={
                    <CardActions sx={{ 
                        marginBottom: 0,
                        visibility: isHovered ? 'visible' : 'hidden'
                    }}>
                        {isEditable && <a href="#" onClick={handleEdit} style={{ textDecoration: "none", color: indigo[500]}}>Create New</a>}
                        {showCopyButton && <a href="#" onClick={handleCopy} style={{ textDecoration: "none", color: indigo[500]}}>Copy {data.key}</a>} 
                    </CardActions>
                }
                sx={{ marginBottom: 0, paddingBottom: "10px" }} />
            <CardContent sx={{ height: '100%', marginTop: 0, paddingTop: 0, paddingBottom: "0 !important" }}>
                <Typography variant="subtitle2" component="div">
                    {data.value}
                </Typography>
                <br />
                {editEnabled && <MetaFieldEdit data={data} maxAllowed={maxLength} />}
            </CardContent>
        </Card>
    );
};

export default MetaField;