import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import { isUserAdmin } from '../../utils/api';
import AddArtistForm from '../../components/artists/addArtistForm';
import AddAlbumForm from '../../components/Albums/AddAlbumForm';
import BasicModal from '../../components/modal/basicModal';
import "./menuLeft.scss";
const MenuLeft = ({ user, location }) => {
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const [userAdmin, setUserAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null)

    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    useEffect(() => {
        isUserAdmin(user.uid).then(res => {
            setUserAdmin(res)
        })
    }, [user])

    const handlerMenu = (e, menu) => {
        setActiveMenu(menu.to)
    };

    const handlerModal = type => {
        switch (type) {
            case "artists":
                setTitleModal("Nuevo artista")
                setShowModal(true)
                setContentModal(<AddArtistForm setShowModal={setShowModal} />)
                break;
            case "album":
                setTitleModal("Nuevo album")
                setShowModal(true)
                setContentModal(<AddAlbumForm setShowModal={setShowModal} />)
                break;

            case "song":
                setTitleModal("Nueva canción")
                setShowModal(true)
                setContentModal(<h2> Nueva cancion </h2>)
                break;

            default:
                setTitleModal(null)
                setContentModal(null)
                setShowModal(false)
                break;
        }
    }

    return (
        <Menu className="menu-left" vertical>
            <div className="top">
                <Menu.Item
                    as={Link}
                    to="/"
                    name="home"
                    active={activeMenu === "/"}
                    onClick={handlerMenu}
                >
                    <Icon name="home" /> Inicio
                </Menu.Item>
                <Menu.Item
                    as={Link}
                    to="/artists"
                    name="artists"
                    active={activeMenu === "/artists"}
                    onClick={handlerMenu}
                >
                    <Icon name="user" /> Artistas
                </Menu.Item>
                <Menu.Item
                    as={Link}
                    to="/albums"
                    name="albums"
                    active={activeMenu === "/albums"}
                    onClick={handlerMenu}
                >
                    <Icon name="window maximize outline" /> Albúmes
                </Menu.Item>
            </div>

            {userAdmin && (
                <div className="footer">
                    <Menu.Item onClick={() => handlerModal("artists")}>
                        <Icon name="plus square outline" /> Nuevo artista
                    </Menu.Item>
                    <Menu.Item onClick={() => handlerModal("album")}>
                        <Icon name="plus square outline" /> Nuevo album
                    </Menu.Item>
                    <Menu.Item onClick={() => handlerModal("song")}>
                        <Icon name="plus square outline" /> Nuevas canciones
                    </Menu.Item>

                </div>
            )}
            <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
                {contentModal}
            </BasicModal>
        </Menu>

    );
}

export default withRouter(MenuLeft);