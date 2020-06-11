import React, {useEffect, useState} from 'react';
import {fetchVestibule, fetchVestibuleTour} from "../services/tourServer";
import {useAuth0} from "../components/Auth0Provider";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import {Link} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";

export default () => {
    const auth0 = useAuth0();

    const [vestibule, setVestibule] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [tours, setTours] = useState<any[]>([]);
    useEffect(() => {
        if (!auth0 || !auth0.isAuthenticated || vestibule || loading) return;
        setLoading(true);
        fetchVestibule(auth0)
            .then(setVestibule);
    }, [auth0, loading, vestibule])
    if(!vestibule) {
        return <div>Fetching...</div>
    }
    return <div style={{width: "100%"}}>
        <h1>Admin</h1>
        {vestibule.length === 0
            ? <div>Vestibule is empty. Good job!</div>
            : <div>
                {vestibule!.map((tour: any, i) =>
                    <div key={i}>
                        <Link
                            to="."
                            onClick={(e:React.MouseEvent) => {
                                e.preventDefault();
                                fetchVestibuleTour(auth0, tour.ref)
                                    .then(tour => {
                                         const t2 : any[] = [...tours];
                                         t2[i] = tour;
                                         setTours(t2);
                                    })
                            }}
                            component={RouterLink}>
                            {tour.name.trim()}
                        </Link>
                        &nbsp;
                        {tour.description}
                        {tours[i] && <pre>{JSON.stringify(tours[i], null, 4)}</pre>}

                    </div>
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
