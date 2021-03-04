import React, { useState, useEffect } from 'react';
import firebase from '../../utils/Firebase';
import "firebase/firestore";
import "./Albums.scss"

const db = firebase.firestore(firebase);

const Albums = () => {
    return (
        <div>
            <h1>Albums</h1>
        </div>
    );
}

export default Albums;