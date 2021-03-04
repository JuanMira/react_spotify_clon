import React, { useState, useCallback } from 'react';
import { Image } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import firebase from "../../utils/Firebase";
import "firebase/storage";
import "firebase/auth";
import NoAvatar from '../../assets/png/logo-user.png'
const UploadAvatar = ({ user, setReloadApp }) => {
    const [avatarUrl, setAvatarUrl] = useState(user.photoURL)
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setAvatarUrl(URL.createObjectURL(file));
        uploadImage(file).then(() => {
            updateUserAvatar()
        })

    });
    const updateUserAvatar = () => {

        firebase.storage().ref(`avatar/${user.uid}`).getDownloadURL().then(async res => {
            await firebase.auth().currentUser.updateProfile({ photoURL: res })
            setReloadApp(prevState => !prevState)
        }).catch(err => {
            toast.error("Error al actualizar el avatar")
        })
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        onDrop: onDrop
    })

    const uploadImage = file => {
        const ref = firebase.storage().ref().child(`avatar/${user.uid}`);
        return ref.put(file)
    }


    return (
        <div className="user-avatar" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <Image src={NoAvatar} />
            ) : (
                    <Image src={avatarUrl ? avatarUrl : NoAvatar} />
                )}
        </div>
    );
}

export default UploadAvatar;