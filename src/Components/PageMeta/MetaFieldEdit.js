import React, { useState } from 'react';
import { TextareaAutosize } from '@mui/material';

const MetaFieldEdit = ({ data, maxAllowed = 0 }) => {
    const [desc, setDesc] = useState(String(data.value));
    const [charsLeft, setCharsLeft] = useState(maxAllowed - String(data.value).length);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setDesc(newValue);
        setCharsLeft(maxAllowed - newValue.length);
    };

    const handleCopy = (e) => {
        navigator.clipboard.writeText(desc);
        e.target.innerText = 'Copied!';
        let ele = e.target;
        setTimeout(() => {
            ele.innerText = 'Copy';
        }, 1000);
    };

    return (
        <div style={{paddingBottom: "10px"}} >
            <TextareaAutosize
                onChange={handleChange}
                minRows={2}
                value={desc}
                style={{ width: '100%' }}
                variant="outlined"
            />
            <div>
                <span style={{ color: charsLeft >= 0 ? 'green' : 'red' }}>
                    Characters: {desc.length} &bull;&nbsp;
                    {charsLeft >= 0
                        ? `Remaining: ${charsLeft}`
                        : `Extra: ${Math.abs(charsLeft)}`}
                </span>
                &nbsp;&bull;&nbsp;
                <a href="#" onClick={handleCopy} style={{ textDecoration: "none", color: "blue" }}>Copy</a>
            </div>
        </div>
    );
};

export default MetaFieldEdit;