import React, { useState } from 'react';
import { 
    TextField, 
    Typography, 
    Box,
    Stack 
} from '@mui/material';

const MetaFieldRepeater = ({ fields, label }) => {
    return (
        <Box sx={{ margin: '1rem 0' }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 2 
            }}>
                <Typography variant="h6">{label}</Typography>
            </Box>
            <Stack spacing={1}>
                {fields.map((item, index) => (
                    <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 
                    }}>
                        <TextField
                            fullWidth
                            size="small"
                            value={item}
                            disabled
                            placeholder={`Enter ${label}`}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default MetaFieldRepeater;
