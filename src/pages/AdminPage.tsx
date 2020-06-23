import React, {useEffect, useState} from 'react';
import {approveVestibule, rejectVestibule,
    fetchVestibule, fetchVestibuleTour} from "../services/tourServer";
import {useAuth0} from "../components/Auth0Provider";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);


export default () => {
    const classes = useStyles();

    const auth0 = useAuth0();

    const [vestibule, setVestibuleDirect] = useState<any[] | undefined>();
    const [loading, setLoading] = useState(false);
    const [tours, setTours] = useState<any[]>([]);
    const [messages, setMessages] = useState<string[]>([])

    const setVestibule = (vestibule? : string[]) => {
        setVestibuleDirect(vestibule);
        setTours([]);
        setMessages([]);
    }
    useEffect(() => {
        if (!auth0 || !auth0.isAuthenticated || vestibule || loading) return;
        setLoading(true);
        fetchVestibule(auth0)
            .then(setVestibule)
    }, [auth0, loading, vestibule])
    if(!vestibule) {
        return <div>Fetching...</div>
    }

    const approve = (id : string) => {
        approveVestibule(id, auth0)
            .then(() => fetchVestibule(auth0))
            .then(setVestibule);
    }
    const reject = (id : string, text? : string ) => {
        rejectVestibule(id, auth0, true, text)
            .then(() => fetchVestibule(auth0))
            .then(setVestibule);
    }

    return <div style={{width: "100%"}}>
        <h1>Admin</h1>
        {vestibule.length === 0
            ? <div>Vestibule is empty. Good job!</div>
            : <div>
                {vestibule!.map((tour: any, i) =>
                    <ExpansionPanel key={i}
                        onChange={() => {
                            tours[i] ||
                            fetchVestibuleTour(auth0, tour.ref)
                                .then(tour => {
                                    const t2 : any[] = [...tours];
                                    t2[i] = tour;
                                    setTours(t2);
                                })
                        }}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>{tour.name.trim()}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                {tour.description}
                                {tours[i] && <pre>{JSON.stringify(tours[i], null, 4)}</pre>}
                                <div className={classes.root}>
                                    <Button onClick={() => approve(tour.ref)} variant="contained" color="primary">
                                        <Typography>Approve</Typography>
                                    </Button>
                                    <Button
                                        onClick={() => reject(tour.ref, messages[i])}
                                        variant="contained">
                                        <Typography>reject</Typography>
                                    </Button>
                                </div>
                                <div>
                                    <TextareaAutosize
                                        cols={60} rowsMin={5}
                                        onChange={e => {
                                            const m = [...messages];
                                            m[i] = e.target.value;
                                            setMessages(m);
                                        }}
                                        />
                                </div>
                            </div>

                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}
            </div>}
        <ResponsiveDrawer
            mobileOpen={false}
            setMobileOpen={() => {
            }}>
            This is the administration page
        </ResponsiveDrawer>
    </div>
}
