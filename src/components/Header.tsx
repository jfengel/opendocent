import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import React from "react";
import {useAuth0} from "./Auth0Provider";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));


export function Header({setMobileOpen} : {
    setMobileOpen: any
}) {
    const classes = useStyles();
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const right = {marginLeft: "auto"};
    return <AppBar style={{position: 'unset'}}>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                className={classes.menuButton}
                onClick={setMobileOpen}
            >
                <MenuIcon/>
            </IconButton>
            <img src={'/OpenDocent.svg'} height={40} title='OpenDocent' alt='OpenDocent logo'/>
            OpenDocent
            {!isAuthenticated
                ? <Button color={"inherit"} style={right} onClick={() => loginWithRedirect({})}>Log in</Button>
                : <span style={right} >
                    {user && user.name}
                    &nbsp;
                    {user && user.picture && <img src={user.picture} height={20} alt=""/>}
                    &nbsp;
                    <Button color={"inherit"} onClick={() => logout()}>Log out</Button>
                </span>}
        </Toolbar>
    </AppBar>;
}
