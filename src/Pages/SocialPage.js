import React, { useState, useEffect } from 'react';
import {Stack} from '@mui/material';
import MetaTextField from '../Components/PageMeta/MetaTextField';
import MetaImageField from '../Components/PageMeta/MetaImageField';
import MetaImagesListField from '../Components/PageMeta/MetaImagesListField';
import MetaLinksListField from '../Components/PageMeta/MetaLinksListField';
import { fieldTypes } from '../Constants/common';


function SocialPage( {metadata} ) {
    console.log("metadata in SocialPage");
    console.log(metadata);
    if (!metadata) return <></>;
    return (
        <div className="metadata-container">
            <Stack spacing={1}>
                {Object.keys(metadata).map(function(key) {
                    if(metadata[key].fieldType == fieldTypes.text){
                        return <MetaTextField
                                    key={key}
                                    data={metadata[key]}
                                    isEditable={metadata[key].isEditable ?? false}
                                    showCopyButton={metadata[key].showCopyButton ?? true}
                                    maxLength={metadata[key].maxLength || 0}
                                    isWarning={metadata[key].isWarning ?? false}
                                    />
                    }else if(metadata[key].fieldType == fieldTypes.image){
                        return <MetaImageField
                                    key={key}
                                    data={metadata[key]}
                                    isEditable={metadata[key].isEditable ?? false}
                                    showCopyButton={metadata[key].showCopyButton ?? true}
                                    maxLength={metadata[key].maxLength || 0}
                                    isWarning={metadata[key].isWarning ?? false}
                                    />
                    }else if(metadata[key].fieldType == fieldTypes.imageslist){
                        return <MetaImagesListField
                                    key={key}
                                    data={metadata[key]}
                                    isEditable={metadata[key].isEditable ?? false}
                                    showCopyButton={metadata[key].showCopyButton ?? true}
                                    maxLength={metadata[key].maxLength || 0}
                                    isWarning={metadata[key].isWarning ?? false}
                                    />
                    }else if(metadata[key].fieldType == fieldTypes.linkslist){
                        return <MetaLinksListField
                                    key={key}
                                    data={metadata[key]}
                                    currentUrl={metadata['durl'].value}
                                    isEditable={metadata[key].isEditable ?? false}
                                    showCopyButton={metadata[key].showCopyButton ?? true}
                                    maxLength={metadata[key].maxLength || 0}
                                    isWarning={metadata[key].isWarning ?? false}
                                    />
                    }else{
                        return "No field type defined";
                    }
                })}
            </Stack>
        </div>
    );
}

export default SocialPage;