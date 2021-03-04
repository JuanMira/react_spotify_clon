import { toast } from 'react-toastify';

const alertError = (type) => {
    switch (type) {
        case "auth/wrong-password":
            toast.warning("La contraseña introducida no es correcta.");
            break;
        case "auth/email-already-in-use":
            toast.warning("El email que intenta ingresar ya esta en uso.")
            break;
        default:
            toast.warning("Error del servidor, intentelo mas tarde.")
            break;
    }
}

export default alertError;