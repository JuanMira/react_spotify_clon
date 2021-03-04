import React, { useEffect, useState } from 'react';
import "./BasicSlider.scss";
import { map, size } from 'lodash';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import firebase from "../../../utils/Firebase";
import "firebase/storage";

const BasicSlider = ({ title, data, folderimage, url }) => {

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        className: "basic-slider-items__list"
    }

    if (size(data) < 5) {
        return null
    }

    return (
        <div className="basic-slider-items">
            <h2>{title}</h2>
            <Slider {...settings}>
                {
                    map(data, item => (
                        <RenderItem key={item.id} item={item} folderimage={folderimage} url={url} />
                    ))
                }
            </Slider>
        </div>
    );
}


function RenderItem({ item, key, folderimage, url }) {

    const [artistBanner, setArtistBanner] = useState(null);

    useEffect(() => {
        firebase.storage().ref(`${folderimage}/${item.banner}`).getDownloadURL().then(url => {
            setArtistBanner(url)
        })
    }, [item, folderimage])

    return (
        <Link to={`/${url}/${item.id}`}>
            <div className="basic-slider-items__list-item">
                <div
                    className="avatar"
                    style={{ backgroundImage: `url('${artistBanner}')` }}
                />
                <h3>{item.name}</h3>
            </div>
        </Link>
    )
}


export default BasicSlider;