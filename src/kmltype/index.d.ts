export interface Kml {
    kml: {
        $: {
            xmlns: string;
            "xmlns:gx": string;
        };
        Document: {
            $: {
                id: string;
            };
            Folder: {
                $: {
                    id: string;
                };
                ExtendedData: {
                    Data: {
                        $: {
                            name: string;
                        };
                        value: string[];
                    }[];
                }[];
                Placemark: {
                    $: {
                        id: string;
                    };
                    Camera: {
                        altitude: string[];
                        altitudeMode: string[];
                        "gx:ViewerOptions": {
                            "gx:option": {
                                $: {
                                    enabled: string;
                                    name: string;
                                };
                            }[];
                            "gx:streetViewPanoId": string[];
                        }[];
                        heading: string[];
                        latitude: string[];
                        longitude: string[];
                        roll: string[];
                        tilt: string[];
                    }[];
                    ExtendedData: {
                        Data: {
                            $: {
                                name: string;
                            };
                            value: string[];
                        }[];
                    }[];
                    Point: {
                        altitudeMode: string[];
                        coordinates: string[];
                    }[];
                    description: string[];
                    name: string[];
                    snippet: string[];
                    styleUrl: string[];
                    visibility: string[];
                }[];
                description: string[];
                name: string[];
                open: string[];
                snippet: string[];
                styleUrl: string[];
                visibility: string[];
            }[];
            Style: {
                $: {
                    id: string;
                };
                BalloonStyle: {
                    bgColor: string[];
                    "gx:displayMode": string[];
                    text: string[];
                }[];
                IconStyle: {
                    Icon: {
                        href: string[];
                    }[];
                    "gx:scalingMode": string[];
                    hotSpot: {
                        $: {
                            x: string;
                            xunits: string;
                            y: string;
                            yunits: string;
                        };
                    }[];
                    scale: string[];
                }[];
                LabelStyle: {
                    scale: string[];
                }[];
            }[];
            StyleMap: {
                $: {
                    id: string;
                };
                Pair: {
                    key: string[];
                    styleUrl: string[];
                }[];
            }[];
            name: string[];
            snippet: string[];
        }[];
    };
}



