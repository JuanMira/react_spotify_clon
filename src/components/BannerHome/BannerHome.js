import React, { useState, useEffect } from 'react';
import firebase from '../../utils/Firebase';
import "firebase/storage";
import "./BannerHome.scss";
const BannerHome = () => {

    const [banner, setBanner] = useState(null);

    useEffect(() => {
        firebase.storage().ref('other/banner-home.jpg').getDownloadURL().then(bannerUrl => {
            setBanner(bannerUrl)
        }).catch(() => { })
    }, [])

    if (!banner) {
        return null
    }

    return (
        <div
            className="banner-home"
            style={{ backgroundImage: `url('${banner}')` }}
        />
    );
}

export default BannerHome;