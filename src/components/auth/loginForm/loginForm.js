import React, { useState } from 'react';
import { Button, Icon, Form, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify'
import { validateEmail } from "../../../utils/Validation"
import firebase from '../../../utils/Firebase'
import "firebase/auth"
import "./loginForm.scss";

const LoginForm = ({ setSelectedForm }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [userActive, setUserActive] = useState(true)
    const [user, setUser] = useState(null)

    const { email, password } = loginData
    const hanlerShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handlerChange = e => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = () => {
        setError({})
        let errors = {}
        let formOk = true

        if (!validateEmail(email)) {
            errors.email = true
            formOk = false
        }

        if (password.length < 6) {
            errors.password = true
            formOk = false
        }

        setError(errors)

        if (formOk) {
            setIsLoading(true)
            firebase
                .auth().signInWithEmailAndPassword(email, password)
                .then(res => {
                    setUser(res.user)
                    setUserActive(res.user.emailVerified)
                    if (!res.user.emailVerified) {
                        toast.warning("Para poder hacer login verifica tu cuenta")
                    }
                })
                .catch(err => {
                    hanlderErrors(err.code)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    return (
        <div className="login-form">
            <h1>Música para todos</h1>
            <Form onSubmit={onSubmit} onChange={handlerChange}>
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
                            Por favor, introduce un correo electronico valido
                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                        icon={showPassword ? (
                            <Icon
                                name="eye slash outline"
                                onClick={hanlerShowPassword}
                                link
                            />
                        ) :
                            <Icon
                                name="eye"
                                onClick={hanlerShowPassword}
                                link
                            />
                        }
                        error={error.password}
                    />
                    {error.password && (
                        <span className="error-text">
                            La contraseña tiene que ser superior a 6 caracteres
                        </span>
                    )}
                </Form.Field>
                <Button
                    type="submit"
                    loading={isLoading}
                >
                    Iniciar sesión
                </Button>
            </Form>

            {!userActive && (
                <ButtonResetSendEmailVerification
                    user={user}
                    setIsLoading={setIsLoading}
                    setUserActive={setUserActive}
                />
            )}

            <div className="login-form__options">
                <p onClick={() => setSelectedForm(null)}>Volver</p>
                <p>¿No tienes cuenta? <span onClick={() => setSelectedForm("register")}>Registrarse</span></p>

            </div>
        </div>
    );
}

function ButtonResetSendEmailVerification({ user, setIsLoading, setUserActive }) {
    const resendVerificationEmail = () => {
        user.sendEmailVerification().then(() => {
            toast.success("Se ha enviado el email de verificacion")
        }).catch(err => {
            hanlderErrors(err)
        }).finally(() => {
            setIsLoading(false)
            setUserActive(true)
        })
    }

    return (
        <div className="resend-verification-email">
            <p>
                Si no has recibido el email de verificación puedes volver a reenviarlo haciendo click
                <span onClick={resendVerificationEmail}>Aqui</span>
            </p>
        </div>
    )
}

function hanlderErrors(code) {
    switch (code) {
        case "auth/wrong-password":
            toast.warning("El usuario y la contraseña son incorrectos")
            break;
        case "auth/too-many-request":
            toast.warning("has enviado demasiadas solicitudes de reenvio de email de confirmacion en muy pooco tiempo")
            break;
        case "auth/user-not-found":
            toast.warning("Ingresa un correo valido o contraseña valido")
            break;
        default:
            break;
    }
}
export default LoginForm;