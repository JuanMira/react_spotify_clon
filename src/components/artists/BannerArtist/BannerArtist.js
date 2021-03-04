import React, { useState, useEffect } from 'react';
import firebase from "../../../utils/Firebase";
import "firebase/storage";
import "./BannerArtist.scss"
const BannerArtist = ({ artist }) => {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        firebase.storage().ref(`Artists/${artist?.banner}`).getDownloadURL().then(url => {
            setBanner(url);
        })
    }, [artist])

    return (
        <div className="banner-artist"
            style={{ backgroundImage: `url('${banner}')` }}
        >
            <div className="banner-artist__gradiant"></div>
            <div className="banner-artist__info">
                <h4>Artista</h4>
                <h1>{artist.name}</h1>
            </div>
        </div>
    );
}

export default BannerArtist;