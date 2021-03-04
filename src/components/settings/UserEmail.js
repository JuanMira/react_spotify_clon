import React, { useState } from 'react';
import { Form, Input, Button, Icon } from 'semantic-ui-react';
import { reauthentication } from '../../utils/api';
import alertError from '../../utils/AlerError';
import { toast } from 'react-toastify';
import firebase from '../../utils/Firebase';
import "firebase/auth";
const UserEmail = ({ user, setShowModal, setTitleModal, setContetModal }) => {

    const onEdit = () => {
        console.log("Editando");
        setTitleModal("Actualizar Email")
        setContetModal(
            <ChangeEmail
                user={user.email}
                setShowModal={setShowModal}
            />
        )
        setShowModal(true);
    }


    //15.funcion para controlar errores de firebase


    return (
        <div className="user-email">
            <h3>Email: {user.email}</h3>
            <Button circular onClick={onEdit}>
                Actualizar
            </Button>
        </div>
    );
}

function ChangeEmail({ setShowModal, user }) {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = () => {
        if (!formData.email) {
            toast.warning("El Email es el mismo");
        } else {
            setIsLoading(true);
            reauthentication(formData.password).then(() => {
                const currentUser = firebase.auth().currentUser;
                currentUser.updateEmail(formData.email).then(() => {
                    toast.success("Email actualizado.");
                    setIsLoading(false);
                    setShowModal(false);
                    currentUser.sendEmailVerification().then(() => {
                        firebase.auth().signOut();
                    })
                }).catch(err => {
                    alertError(err?.code)
                    setIsLoading(false);
                })
            }).catch(err => {
                console.log(err)
                alertError(err?.code);
                setIsLoading(false);
            });
        }

    }

    const handlerPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <Input
                    type="text"
                    defaultValue={user}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
            </Form.Field>
            <Form.Field>
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    icon={<Icon name={
                        showPassword ? "eye slash outline" : "eye"
                    }
                        link onClick={handlerPassword}></Icon>}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                Actualizar Email
            </Button>
        </Form>
    )
}

export default UserEmail;