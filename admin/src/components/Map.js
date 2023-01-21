import { MapContainer, useMap, useMapEvent, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRef, useState, useEffect, useMemo } from 'react';
// import LocationIcon from '../icons/LocationIcon'
import {BsGeo} from "@react-icons/all-files/bs/BsGeo"


  export function MapComponent({setLocation, toCenter, location }) {
    const map = useMap();
    const mountedRef = useRef(true);
    map.on('click', function(e) {
        if (!mountedRef.current) return null
        
        if(location?.lat !== e.latlng?.lat && location?.lng !== e.latlng?.lng){
            map.setView(e.latlng, map.getZoom(), {
                animate: toCenter.current || false,
            });
            setLocation(e.latlng);
        }
    });
    map.on('moveend', function(e) {
        if (!mountedRef.current) return null
        if(location?.lat !== e.target.getCenter()?.lat && location?.lng !== e.target.getCenter()?.lng){
            setLocation(e.target.getCenter());
        }
    });


    useEffect(() =>{
        return () => { 
            mountedRef.current = false
        }
    },[])
    return null
  }

function Map({setLocation, position}) {
    
    const toCenter = useRef(false);
    console.log(position)
    const mapRef = useRef(null)
    const [map, setMap] = useState(null)
    useEffect(()=>{
        console.log("ello")
        if(mapRef && position?.lat){
            console.log("hello if")
            mapRef.current?.flyTo([position.lat, position.lng],16)
            // map.flyTo([position.lat, position.lng])
        }
    }, [position?.lat, map])
    useEffect(()=>{
        console.log(map)
    }, [map])
    const displayMap = useMemo(
        () => (
            <MapContainer 
                whenCreated = {setMap}
                center={[37.96008, 58.32606]} 
                zoom={15} 
                ref = {mapRef}
                style={{ width:"99%", height:"550px",backgroundColor:"red",marginTop:"10px", marginBottom:'90px'}}
                >
                    {/* <ChangeView center = {[position?.lat, position?.lng]} zoom = {15}/> */}
                    
                    <BsGeo className="absolute text-gray-800 top-1/2 left-1/2 text-5xl -mt-11 -ml-6" style={{zIndex:100000}}
                    
                    />

                    <TileLayer

                        url="http://95.85.127.250:5000/tile/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                {/* <Marker 
                position={[37.92227, 58.37601]}
                >
                <Popup>
                    your home location
                    </Popup>
                </Marker> */}
                    {/* <SetViewOnClick toCenter={toCenter} setLocation={setLocation}/> */}
                    <MapComponent setLocation={setLocation} toCenter={toCenter} />
            </MapContainer>
        ), 
    [])
    return (
        <div className="relative h-full w-full">
            {displayMap}
        </div>
    );
}

export default Map;