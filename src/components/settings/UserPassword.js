import React, { useState } from 'react';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { reauthentication } from '../../utils/api';
import alertError from '../../utils/AlerError'
import firebase from '../../utils/Firebase';
import "firebase/auth";
const UserPassword = ({ setShowModal, setTitleModal, setContetModal }) => {
    const onEdit = () => {
        setShowModal(true)
        setTitleModal("Actualizar contraseña")
        setContetModal(<PasswordChange setShowModal={setShowModal} />)
    }
    return (
        <div className="user-password">
            <h3>Contraseña: **** **** ****</h3>
            <Button circular onClick={onEdit}>
                Actualizar
            </Button>
        </div>
    );
}

function PasswordChange({ setShowModal }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        repeatNewPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.repeatNewPassword) {
            toast.warning("Las contraseñas no pueden estan vacias");
        } else if (formData.currentPassword === formData.newPassword) {
            toast.warning("La nueva contraseña no puede ser igual a la actual");
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            toast.warning("Las nuevas contraseñas no son iguales");
        } else if (formData.newPassword.length < 6) {
            toast.warning("La contraseña tiene que tener minimo 6 caracteres")
        } else {
            setIsLoading(true);
            reauthentication(formData.currentPassword).then(() => {
                const currentUser = firebase.auth().currentUser;
                currentUser.updatePassword(formData.newPassword).then(() => {
                    toast.success("Contraseña actualizada");
                    setShowModal(false);
                    setIsLoading(false);
                    firebase.auth().signOut();
                }).catch(err => {
                    alertError(err?.code);
                    setIsLoading(false);
                })
            }).catch(err => {
                console.log(err);
                alertError(err?.code);
                setIsLoading(false);
            })
        }
    }

    const passwordHandler = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Form onSubmit={onSubmit} >
            <Form.Field>
                <Input
                    placeholder="Contraseña actual"
                    type={showPassword ? "text" : "password"}
                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                    icon={<Icon
                        name={showPassword ? "eye slash outline" : "eye"}
                        link
                        onClick={passwordHandler}
                    />}
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder="Nueva contraseña"
                    type={showPassword ? "text" : "password"}
                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                    icon={<Icon
                        name={showPassword ? "eye slash outline" : "eye"}
                        link
                        onClick={passwordHandler}
                    />}
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder="Repetir"
                    type={showPassword ? "text" : "password"}
                    onChange={e => setFormData({ ...formData, repeatNewPassword: e.target.value })}
                    icon={<Icon
                        name={showPassword ? "eye slash outline" : "eye"}
                        link
                        onClick={passwordHandler}
                    />}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                Actualizar
            </Button>
        </Form>
    )
}

export default UserPassword;