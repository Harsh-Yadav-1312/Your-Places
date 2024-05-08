import React, {useEffect, useRef, useState} from 'react';
import './ImageUpload.css';
import Button from './Button';


const ImageUpload = props => {

    const filePickerRef = useRef();

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    useEffect(() =>{
        if(!file){
            return;
        }

        const fileReader = new FileReader();        // FileReader is inbuilt api of browser
        fileReader.readAsDataURL(file);            // readAsDataURL convert the file into binary data
        fileReader.onload = () =>{
            setPreviewUrl(fileReader.result);        // result data of fileReader is now previewing
        };
        
    },[file]);

    const pickedHandler = (event) =>{
        let pickedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            fileIsValid = true;
            setIsValid(true);
        }
        else{
            fileIsValid = false;
            setIsValid(false);
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () =>{
        filePickerRef.current.click();
    };

    return (
        <div className='form-control'>
            <input 
            type='file' 
            id={props.id} 
            style={{display: 'none'}} 
            accept='.jpg, .png, .jpeg' 
            ref={filePickerRef} 
            onChange={pickedHandler} 
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt='preview' />}
                    {!previewUrl && <p>Please Pick an Image</p>}
                </div>
                <Button type='button' onClick={pickImageHandler} >Pick Image</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;