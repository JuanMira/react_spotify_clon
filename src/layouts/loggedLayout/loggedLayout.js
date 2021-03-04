import React from 'react';
import { Grid, GridColumn } from "semantic-ui-react";
import MenuLeft from '../../components/menuLeft'
import TopBar from '../../components/topBar'
import Routes from "../../routes"
import { BrowserRouter as Router } from 'react-router-dom';
import "./loggedLayout.scss";

const LoggedLayout = ({ user, setReloadApp }) => {
    return (
        <Router>
            <Grid className="logged-layout">
                <Grid.Row>
                    <Grid.Column width={3}>
                        <MenuLeft user={user} />
                    </Grid.Column>
                    <Grid.Column className="content" width={13}>
                        <TopBar user={user} />
                        <Routes user={user} setReloadApp={setReloadApp} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <h2>Player</h2>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Router>
    );
}

export default LoggedLayout;