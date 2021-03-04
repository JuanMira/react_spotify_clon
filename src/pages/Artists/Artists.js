import React, { useState, useEffect } from 'react';
import { map } from 'lodash';
import firebase from '../../utils/Firebase';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "firebase/firestore";
import "./Artists.scss";

const db = firebase.firestore(firebase);

const Artists = () => {

    const [artists, setArtists] = useState([])

    useEffect(() => {
        db.collection('Artists').get().then(response => {
            const arrayArtists = [];
            map(response?.docs, item => {
                const data = item.data();
                data.id = item.id;
                arrayArtists.push(data);
            });
            setArtists(arrayArtists);
        }).catch(() => {

        })
    }, [])

    return (
        <div className="artists">
            <h1>Artistas</h1>
            <Grid>
                {map(artists, artist => (
                    <Grid.Column key={artist.id} mobile={8} tablet={4} computer={3}>
                        <RenderArtist artist={artist} key={artist.id} />
                    </Grid.Column>
                ))}
            </Grid>
        </div>
    );
}

function RenderArtist({ artist, key }) {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        firebase.storage().ref(`Artists/${artist.banner}`).getDownloadURL().then(res => {
            setBanner(res)
        }).catch(err => {

        })
    }, [artist])
    return (
        <Link to={`/artist/${artist.id}`}>
            <div className="artists__item">
                <div
                    className="avatar"
                    style={{ backgroundImage: `url('${banner}')` }}
                />
                <h3>{artist.name}</h3>
            </div>
        </Link>
    )
}

export default Artists;