import React, {useState} from 'react';
import './ImageInfoRow.css';
import { Box, Typography } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ImageInfoRow = ({src, display_link="", alt="", showAlt=true}) => {

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (src) => {
        setSelectedImage(src);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };
    
    return (
        <>
            <Box className="image-url-row">
                <Box className="image-url-image-box"
                        sx={{
                            backgroundImage: `url(${src?.replace(/\u00A0/g, ' ')})`,
                            '&:hover .zoom-icon': { opacity: 1 }
                        }}
                        onClick={() => handleImageClick(src?.replace(/\u00A0/g, ' '))} >
                    <Box className="zoom-icon">
                        <ZoomInIcon sx={{ color: 'white' }} />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    {showAlt?<Typography variant="caption" color={alt == ""?"error":""}>{alt || "~~~ Alt empty ~~~"}</Typography>:""}
                    <Typography variant="caption" sx={{wordBreak: "break-all"}}>{display_link}</Typography>
                </Box>
            </Box>
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
        </>
    )
}

export default ImageInfoRow;