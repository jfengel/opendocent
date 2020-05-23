import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ButtonBase from "@material-ui/core/ButtonBase";
import React from "react";
import {useAuth0} from "./Auth0Provider";

export function Header() {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const right = {marginLeft: "auto"};
    return <AppBar style={{position: 'unset'}}>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
            >
                <MenuIcon/>
            </IconButton>
            <img src={'/OpenDocent.svg'} height={40} title='OpenDocent' alt='OpenDocent logo'/>
            OpenDocent
            {!isAuthenticated
                ? <ButtonBase style={right} onClick={() => loginWithRedirect({})}>Log in</ButtonBase>
                : <span style={right} >
                    {user && user.name}
                    &nbsp;
                    {user && user.picture && <img src={user.picture} height={20} alt=""/>}
                    &nbsp;
                    <ButtonBase onClick={() => logout()}>Log out</ButtonBase>
                </span>}
        </Toolbar>
    </AppBar>;
}
