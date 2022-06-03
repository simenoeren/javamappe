const mapBoxKey = 'pk.eyJ1Ijoic2ltZW5vZXJlbiIsImEiOiJjbDBreW1zZDkwbGtjM2VuZXZxYWtkNDJnIn0.n5IJ_z66CpvK9iNrOE598w'


const stations = await getStations();
const status =  await getStatus();

function getAvailability(id) {

    const statusResult = status.filter(station => {
        return station.station_id === id;
    });
    return statusResult[0].num_bikes_available;
}

const featureStations = stations.map(station => {
    return {
        type: 'Feature',
        properties: {
            station: station.name,
            address: station.address,
            availability: getAvailability(station.station_id)
            },
        geometry: {
            coordinates: [station.lon, station.lat]
            }
    }
});

const geoStations = {
        type: 'FeatureCollection',
        features: featureStations
    };


export function getMap() {
    mapboxgl.accessToken = mapBoxKey;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [10.75, 59.905], // starting position [lng, lat]
    zoom: 14 // starting zoom
    });


    const popUpElement = document.querySelector('.bike-overlay');
    const closePopUp = document.querySelector('.close-overlay');

    for (const marker of geoStations.features) {
        // Create a DOM element for each marker.
        const bikeStation = document.createElement('div');
        

        bikeStation.classList.add('marker');
  
        bikeStation.addEventListener('click', () => {
            popUpElement.classList.remove('hidden')
            popUpMessage(marker.properties.station, marker.properties.address, marker.properties.availability);
            
            map.flyTo({
                center: marker.geometry.coordinates,
                zoom: 20,
                essential: true
            });
        
        });
         
        closePopUp.addEventListener('click', () => {
            popUpElement.classList.add('hidden');
        });

        // Adds markers to the map.
        new mapboxgl.Marker(bikeStation)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
        const yourPos = document.createElement('div');
        yourPos.classList.add('your-pos')
        new mapboxgl.Marker(yourPos)
        .setLngLat([position.coords.longitude, position.coords.latitude])
        .addTo(map);

        map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 16,
            essential: true
        });
    })
}

async function getStations() {
    const response = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json')
    const result = await response.json()
    
    return result.data.stations;
};

async function getStatus() {
    const response = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json')
    const result = await response.json()
    
    return result.data.stations
};


function popUpMessage(station, address, availability) {
    console.log(availability)
    const StationTitle = document.querySelector('.StationTitle')
    const StationAddress = document.querySelector('.StationAddress')
    const availableBikes = document.querySelector('.availability');
    availableBikes.textContent = `${availability} LEDIGE SYKLER `;
    StationTitle.textContent=station
    StationAddress.textContent=address
}



