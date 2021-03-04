import React, { Fragment, useState, useEffect } from 'react';
import "./home.scss";
import BannerHome from "../../components/BannerHome";
import BasicSlider from "../../components/Sliders/BasicSlider";
import firebase from "../../utils/Firebase";
import { map } from 'lodash';
import "firebase/firestore";

const db = firebase.firestore(firebase)

const Home = () => {

    const [artists, setArtists] = useState();
    const [albums, setAlbums] = useState([]);
    useEffect(() => {
        db.collection("Artists").get().then(res => {
            const arrayArtist = [];
            map(res?.docs, artists => {
                const data = artists.data()
                data.id = artists.id;
                arrayArtist.push(data)

            });
            setArtists(arrayArtist)
        }).catch(() => {

        })
    }, [])

    useEffect(() => {
        db.collection("Albums").get().then(res => {
            const arrayAlbums = [];
            map(res?.docs, album => {
                const data = album.data()
                data.id = album.id
                arrayAlbums.push(data);
            })
            setAlbums(arrayAlbums);
        })
    }, [])

    return (
        <Fragment>
            <BannerHome />
            <div className="home">

                <BasicSlider
                    title="Ultimos artistas"
                    data={artists}
                    folderimage="Artists"
                    url="artist" />

                <BasicSlider
                    title="Ultimos albúmes"
                    data={albums}
                    folderimage="Album"
                    url="artist" />
            </div>
        </Fragment>
    );
}

export default Home;