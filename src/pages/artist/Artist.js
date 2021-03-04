import React, { useState, useEffect } from 'react';
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import { withRouter } from 'react-router-dom';
import BannerArtist from '../../components/artists/BannerArtist';
import "./Artist.scss";

const db = firebase.firestore(firebase);

const Artist = ({ match }) => {

    const [artist, setArtist] = useState(null);
    useEffect(() => {
        db.collection("Artists").doc(match?.params?.id).get().then(res => {
            setArtist(res.data())
        })
    }, [match])
    return (
        <div className="artist">
            {artist && (
                <BannerArtist artist={artist} />
            )}
            <h2>Mas información</h2>
        </div>
    );
}

export default withRouter(Artist);