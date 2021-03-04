import React, { useCallback, useState } from 'react';
import { Form, Input, Button, Image } from 'semantic-ui-react';
import { toast } from "react-toastify";
import { v4 as uuid } from 'uuid'
import { useDropzone } from 'react-dropzone';
import NoImage from '../../../assets/png/no-image.png';
import "./AddArtistForm.scss";
import firebase from '../../../utils/Firebase';
import "firebase/storage";
import "firebase/firestore"

const db = firebase.firestore(firebase);

const AddArtistForm = ({ setShowModal }) => {

    const [banner, setBanner] = useState(null);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState(initialValueForm());
    const [loading, setLoading] = useState(null)

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setFile(file)
        setBanner(URL.createObjectURL(file))
    });

    const uploadImage = fileName => {
        const ref = firebase.storage().ref().child(`Artists/${fileName}`);
        return ref.put(file)
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg,image/png",
        noKeyboard: true,
        onDrop: onDrop
    })

    const resetForm = () => {
        setFormData(initialValueForm())
        setFile(null);
        setBanner(null);
    }

    const onSubmit = () => {
        if (!formData.name) {
            toast.warning("Añada el nombre del artista")
        } else if (!file) {
            toast.warning("Añade la imagen del artista")
        } else {
            setLoading(true);
            const fileName = uuid();
            console.log(fileName)
            uploadImage(fileName).then(res => {
                db.collection("Artists").add({ name: formData.name, banner: fileName }).then(res => {
                    toast.success("Artista creado correctamente")
                    resetForm()
                    setLoading(false)
                    setShowModal(false)
                }).catch(err => {
                    toast.error("Error al crear el artista")
                    setLoading(false)
                })
            }).catch(err => {
                toast.error('Error al subir la imagen')
                setLoading(false)
            })
            //setShowModal(false);
        }
    }
    return (
        <Form className="add-artist-form" onSubmit={onSubmit}>
            <Form.Field className="artist-banner" >
                <div
                    className="banner"
                    {...getRootProps()}
                    style={{ backgroundImage: `url('${banner}')` }}
                />
                <input {...getInputProps()} />
                {!banner && <Image src={NoImage} />}
            </Form.Field>
            <Form.Field className="artist-avatar">
                <div
                    className="avatar"
                    style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder="Artista"
                    onChange={e => { setFormData({ name: e.target.value }) }}
                />
            </Form.Field>
            <Button type="submit" loading={loading}>
                Crear artista
            </Button>
        </Form >
    );
}

function initialValueForm() {
    return {
        name: ""
    }
}

export default AddArtistForm;