import React, { useState } from 'react';
import { Card, CardContent, Typography, CardHeader, CardActions, CardMedia} from '@mui/material';
import { indigo } from '@mui/material/colors';
import MetaFieldEdit from './MetaFieldEdit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

const MetaTextField = ({ data, isEditable = false, showCopyButton = true, maxLength = 0, isWarning = false }) => {
    const [editEnabled, setEditEnabled] = useState(false);

    const handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(data.value);
        e.target.innerText = 'Copied!';
        let ele = e.target;
        setTimeout(() => {
            ele.innerText = 'Copy ' + data.key;
        }, 1000);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setEditEnabled(!editEnabled);
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
                    <Typography variant="caption" color={(maxLength != 0 && String(data.value).length > maxLength)?"error":(isWarning?"warning":"text.secondary")}>
                    {data.key} {maxLength > 0 && `(${String(data.value).length}/${maxLength})`}
                    </Typography>}
                disableTypography={true}
                action={
                    <CardActions sx={{ 
                        marginBottom: 0,
                        visibility: isHovered ? 'visible' : 'hidden'
                    }}>
                        {isEditable && <a href="#" onClick={handleEdit} style={{ fontSize: 14, textDecoration: "none", color: indigo[500]}}><Tooltip title="Open Local Editor" placement="bottom-end"><EditNoteRoundedIcon fontSize='inherit' /></Tooltip></a>}
                        {showCopyButton && <a href="#" onClick={handleCopy} style={{ fontSize: 11, textDecoration: "none", color: indigo[500]}}><Tooltip title="Copy Content" placement="bottom-end"><ContentCopyIcon fontSize="inherit" /></Tooltip></a>} 
                    </CardActions>
                }
                sx={{ marginBottom: 0, paddingBottom: "10px" }} />
            <CardContent sx={{ height: '100%', marginTop: 0, paddingTop: 0, paddingBottom: "0 !important" }}>
                <Typography variant="subtitle2" component="div"  sx={{ display: 'flex' }}>
                    {data.value}
                </Typography>
                <br />
                {editEnabled && <MetaFieldEdit data={data} maxAllowed={maxLength} />}
            </CardContent>
        </Card>
    );
};

export default MetaTextField;