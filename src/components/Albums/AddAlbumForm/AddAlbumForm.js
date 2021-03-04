import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Image, Dropdown } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { map } from 'lodash';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import firebase from '../../../utils/Firebase';
import "firebase/firestore";
import "firebase/storage";
import NoImage from '../../../assets/png/no-image.png'
import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

const AddAlbumForm = ({ setShowModal }) => {

    const [albumImage, setAlbumImage] = useState(null);
    const [file, setFile] = useState(null);
    const [artist, setArtist] = useState([]);
    const [formData, setFormData] = useState(initialValueForm)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        db.collection("Artists").get().then(res => {
            const arrayArtist = [];
            map(res?.docs, item => {
                const data = item.data()
                arrayArtist.push({
                    key: item.id,
                    value: item.id,
                    text: data.name
                })
            })
            setArtist(arrayArtist);
        }).catch(err => {

        })
    }, [])

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setFile(file);
        setAlbumImage(URL.createObjectURL(file))
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg,image/png",
        noKeyboard: true,
        onDrop
    });

    const uploadImage = (fileName) => {
        const ref = firebase.storage().ref().child(`Album/${fileName}`);
        return ref.put(file);
    }

    const onSubmit = () => {
        if (!formData.name || !formData.artist) {
            toast.warning("El nombre del album o el artista son obligatorios");
        } else if (!file) {
            toast.warning("La imagen del albúm es obligatoria")
        } else {
            setLoading(true);
            const fileName = uuid()
            uploadImage(fileName).then(() => {
                db.collection('Albums').add({
                    name: formData.name,
                    artist: formData.artist,
                    banner: fileName
                }).then(() => {
                    toast.success("Albúm creado");
                    resetForm();
                    setLoading(false);
                    setShowModal(false);
                }).catch(err => {
                    toast.warning("Error al crear el Albúm");
                    setLoading(false);
                })
            }).catch(err => {
                toast.warning("Error al subir la imagen del album")
                setLoading(false);
            });
        }
    }

    const resetForm = () => {
        setFormData(initialValueForm());
        setFile(null);
        setAlbumImage(null);
    }

    return (
        <Form className="add-album-form" onSubmit={onSubmit}>
            <Form.Group>
                <Form.Field className="album-avatar" width={5}>
                    <div
                        {...getRootProps()}
                        className="avatar"
                        style={{ backgroundImage: `url('${albumImage}')` }}
                    />
                    <input {...getInputProps()} />
                    {
                        !albumImage && <Image src={NoImage} />
                    }
                </Form.Field>
                <Form.Field className="album-inputs" width={11}>
                    <Input
                        placeholder="Nombre del Album"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Dropdown
                        placeholder="El Album pertenece ..."
                        fluid
                        selection
                        search
                        options={artist}
                        lazyLoad
                        onChange={(e, data) => setFormData({ ...formData, artist: data.value })}
                    />
                </Form.Field>
            </Form.Group>
            <Button type="submit" loading={loading}>
                Crear Albúm
            </Button>
        </Form>
    );
}

function initialValueForm() {
    return {
        name: "",
        artist: ""
    }
}

export default AddAlbumForm;