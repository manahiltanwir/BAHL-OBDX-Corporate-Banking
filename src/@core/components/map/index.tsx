
import * as React from 'react';

// ** Location libs
import { GoogleMap, Marker } from "@react-google-maps/api";
import Geocode from "react-geocode";

// ** MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from 'mdi-material-ui/Pin';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// ** utils libs
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDmX84UMPNehVVCwaQIUsYvChDt2hboLzA';

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
Geocode.enableDebug();

function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
}
interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
    description: string;
    structured_formatting: StructuredFormatting;
}

interface IGoogleMaps {
    onSelectLocation: () => Promise<{ lat: number; lng: number; meta?: PlaceType }>
}

export default function GoogleMaps({ onSelectLocation }: any) {
    const [value, setValue] = React.useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
    const [latLng, setLatLng] = React.useState<{ lat: number; lng: number; }>({ lat: 43.45, lng: -80.49 })
    const loaded = React.useRef(false);

    React.useEffect(() => {
        return () => {
            setLatLng({ lat: 43.45, lng: -80.49 })
        }
    }, [])

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
                document.querySelector('head'),
                'google-maps',
            );
        }

        loaded.current = true;
    }

    const fetch = React.useMemo(
        () =>
            throttle(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void,
                ) => {
                    (autocompleteService.current as any).getPlacePredictions(
                        request,
                        callback,
                    );
                },
                200,
            ),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && (window as any)?.google) {
            autocompleteService.current = new (
                window as any
            ).google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
            if (active) {
                let newOptions: readonly PlaceType[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <>
            <Autocomplete
                id="google-map-smart-Chain"
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.description
                }
                filterOptions={(x) => x}
                options={options}
                autoComplete
                fullWidth
                includeInputInList
                filterSelectedOptions
                value={value}
                onChange={(event: any, newValue: PlaceType | null) => {

                    newValue && Geocode.fromAddress(newValue.description).then(
                        (response) => {
                            const { lat, lng } = response.results[0].geometry.location;
                            setLatLng({ lat, lng });
                            onSelectLocation({ lat, lng, meta: newValue })
                        },
                        (error) => {
                            console.error(error);
                        }
                    );

                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Add a location" fullWidth />
                )}
                renderOption={(props, option) => {
                    const matches = option.structured_formatting.main_text_matched_substrings || [];
                    const parts = parse(
                        option.structured_formatting.main_text,
                        matches.map((match: any) => [match.offset, match.offset + match.length]),
                    );

                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item>
                                    <Box
                                        component={LocationOnIcon}
                                        sx={{ color: 'text.secondary', mr: 2 }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    {parts.map((part, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                fontWeight: part.highlight ? 700 : 400,
                                            }}
                                        >
                                            {part.text}
                                        </span>
                                    ))}
                                    <Typography variant="body2" color="text.secondary">
                                        {option.structured_formatting.secondary_text}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
            {/* {
                (latLng.lat && latLng.lng) && (
                    <GoogleMap
                        zoom={10}
                        mapContainerStyle={{ width: '100%', height: 500, marginTop: 15 }}
                        // center={(latLng.lat && latLng.lng) ? latLng : { lat: 43.45, lng: -80.49 }}
                        // center={{ lat: 43.45, lng: -80.49 }}
                        center={{ lat: latLng.lat || 43.45, lng: latLng.lng || -80.49 }}
                        mapContainerClassName="map-container"
                    >
                    </GoogleMap>
                )
            } */}

            {/* {selected && <Marker position={selected} />} */}
        </>
    );
}
