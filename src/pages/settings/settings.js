import React, { useState } from 'react';
import UploadAvatar from '../../components/settings/UploadAvatar';
import BasicModal from '../../components/modal/basicModal'
import UserName from '../../components/settings/UserName';
import UserEmail from '../../components/settings/UserEmail';
import UserPassword from '../../components/settings/UserPassword';
import "./settings.scss";
const Settings = ({ user, setReloadApp }) => {
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [contentModal, setContetModal] = useState(null);
    return (
        <div className="settings">
            <h1>Configuración</h1>
            <div className="avatar-name">
                <UploadAvatar user={user} setReloadApp={setReloadApp} />
                <UserName
                    user={user}
                    setShowModal={setShowModal}
                    setTitleModal={setTitleModal}
                    setContetModal={setContetModal}
                    setReloadApp={setReloadApp}
                />

            </div>
            <UserEmail
                user={user}
                setShowModal={setShowModal}
                setTitleModal={setTitleModal}
                setContetModal={setContetModal}
            />
            <UserPassword
                setShowModal={setShowModal}
                setTitleModal={setTitleModal}
                setContetModal={setContetModal}
            />
            <BasicModal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}
            >
                {contentModal}
            </BasicModal>

        </div>
    );
}

export default Settings;