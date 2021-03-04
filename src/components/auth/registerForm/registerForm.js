import React, { useState } from 'react';
import { Button, Icon, Form, Input } from 'semantic-ui-react';
import { toast } from "react-toastify"
import { validateEmail } from '../../../utils/Validation'
import firebase from '../../../utils/Firebase';
import "firebase/auth";
import './registerForm.scss'
const RegisterForm = ({ setSelectedForm }) => {

    const [formDatos, setFormDatos] = useState({
        email: '',
        password: '',
        username: '',
    })
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const { email, password, username } = formDatos

    const onSubmit = () => {

        setError({});
        let error = {}
        let formOk = true;
        if (!validateEmail(email)) {
            error.email = true;
            formOk = false;
        }

        if (password.length < 6) {
            error.password = true;
            formOk = false;
        }

        if (!username) {
            error.username = true;
            formOk = false;
        }

        setError(error)

        if (!formOk) {
            toast.error("Ah ocurrido un error al enviar el formulario")
        }
        if (formOk) {
            setIsLoading(true)
            firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
                toast.success("Registro correcto")
                changeUserName()
                verificationEmail()
            }).catch(() => {
                toast.error("Error al crear la cuenta")
            }).finally(() =>
                setIsLoading(false)
            )
        }
    }

    const changeUserName = () => {
        firebase.auth().currentUser.updateProfile({
            displayName: username
        }).catch(() => {
            toast.error("Error al asignar el nombre de usuario.")
        })
    }

    const verificationEmail = () => {
        firebase.auth().currentUser.sendEmailVerification().then(() => {
            toast.success("Se a enviado un email de verificacion.")
        }).catch(() => {
            toast.error("Error al enviar el email de verificacion.")
        })
    }

    const onChange = e => {
        setFormDatos({
            ...formDatos,
            [e.target.name]: e.target.value
        })
    }

    const handlerShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="register-form">
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input
                        type="text"
                        name="email"
                        placeholder="Correo electronico"
                        icon="mail outline"
                        error={error.email}
                    />
                    {error.email && (
                        <span className="error-text">
                            Por favor introduce un correo electronico valido
                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                        icon={showPassword ? (
                            <Icon name="eye slash outline" link onClick={handlerShowPassword} />
                        ) : (
                                <Icon name="eye" link onClick={handlerShowPassword} />
                            )}
                        error={error.password}
                    />
                    {error.password && (
                        <span className="error-text">
                            Elige una contraseña superior a 6 caracteres
                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input
                        type="text"
                        name="username"
                        placeholder="Como deberiamos llamarte"
                        icon="user circle outline"
                        error={error.username}
                    />
                    {error.username && (
                        <span className="error-text">
                            Por favor introduce un nombre de usuario
                        </span>
                    )}
                </Form.Field>
                <Button type="submit" loading={isLoading}>
                    Continuar
                </Button>
            </Form>
            <div className="register-form__options">
                <p onClick={() => setSelectedForm(null)}>Volver</p>
                <p>¿ya tienes muxic? <span onClick={() => setSelectedForm("login")}>Inicar sesión</span></p>

            </div>
        </div>
    );
}

export default RegisterForm;