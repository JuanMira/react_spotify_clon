import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Settings from '../pages/settings'
//Pages
import Home from '../pages/home'
import Artist from '../pages/artist';
import Artists from '../pages/Artists';
import Albums from '../pages/albums';

const Routes = ({ user, setReloadApp }) => {
    return (
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/artists" exact>
                <Artists />
            </Route>
            <Route path="/settings" exact>
                <Settings user={user} setReloadApp={setReloadApp} />
            </Route>
            <Route path="/artist/:id" exact>
                <Artist />
            </Route>
            <Route path="/albums" exact>
                <Albums />
            </Route>
        </Switch>
    );
}

export default Routes;