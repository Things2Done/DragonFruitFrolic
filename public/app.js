
const { OpenStreetMapProvider } = GeoSearch;

async function callTest(locationQuery){
    // setup
    const provider = new OpenStreetMapProvider();
    // search
    const results = await provider.search({ query: locationQuery });
    console.log(results)
    return results;
}

let Lat = 52.53092357796963;
let Lon = 13.40350205203423;

let map = L.map('map').setView([Lat, Lon], 13);
let marker = L.marker([52.53820520020355, 13.412629767779348]).addTo(map);


let places = [];

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// L.Control.geocoder().addTo(map);

// // Initialize Mapbox Geocoder
// const geocoder = new MapboxGeocoder({
//     accessToken: 'pk.eyJ1IjoiYnJvb2tseW5odW1hbmlzdCIsImEiOiJjbHBwbXdzY2gweWZwMmpvdjJxOW9ieXBsIn0.7DGJB1rn9hKS8QpLR_XI4Q', 
//     types: 'place',
//     placeholder: 'Search for your city',
// });
// geocoder.addTo('#location');
// geocoder.on('result', (data) => {
//     console.log(data);
//     if (data.result) {
//         const { text, center } = data.result;
//         setLocation(text, center); // Function to handle geocoder results
//     }
// });

// // Function to handle geocoder results
// function setLocation(text, center) {
//     document.getElementById("location").value = text;
//     places.push({ lat: center[1], lon: center[0] });
// }


window.addEventListener('load', () => {
    document.getElementById('button-enter')?.addEventListener('click', async () => {
        let user = document.getElementById("user").value;
        let location = document.getElementById("location").value;
        let description = document.getElementById("description").value;
        let category = document.getElementById("category").value;
        let multimedia = document.getElementById("multimedia");
        if (multimediaInput.files.length > 0) {
            let file = multimediaInput.files[0];}
        console.log(user);
        console.log(location);
        console.log(description);
        console.log(category);
        console.log(multimedia);
        // Handle the form submission with geocoded data
        let lastEnteredLocation = places.length > 0 ? places[places.length - 1] : null;
        let obj = {
            "user": user,
            "location": location,
            "description": description,
            "category": category,
            "multimedia": multimedia,
            "lat": lastEnteredLocation ? lastEnteredLocation.lat : undefined,
            "lon": lastEnteredLocation ? lastEnteredLocation.lon : undefined
        };
        let jsonData = JSON.stringify(obj);

        const geocodeResults = await callTest(location);
        if (geocodeResults.length > 0) {
            const { x: lon, y: lat } = geocodeResults[0];
            // You can use lat and lon as needed, for example:
            // Add a marker to the map at the geocoded location
            L.marker([lat, lon]).addTo(map).bindPopup(location);
            // console.log(location);
            // console.log(lat);
            // console.log(lon);

            obj.lat = lat;
            obj.lon = lon;
            jsonData = JSON.stringify(obj);            
        console.log("Data to be sent to server:",jsonData)
        }

        fetch('/entered', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
            .then(res => {
                return res.json
            })
            .then(data => (console.log("Response from /entered:",data)))
            .catch(error => console.error("Error in fetch /entered:", error));
    })

    document.getElementById('get-read-out').addEventListener('click', () => {
        fetch('getEntries')
            .then(resp => resp.json())
            .then(data => {
                console.log("Data received from /getEntries:",data);

                data.forEach(entry => {
                    if (typeof entry.lat === 'number' && typeof entry.lon === 'number') {
                        L.marker([entry.lat, entry.lon]).addTo(map)
                            .bindPopup(`User: ${entry.user}, Description: ${entry.description}`);
                    } else {
                        console.error('Invalid entry:', entry);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching entries:', error);
            });
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     } else if (!response.headers.get('content-type')?.includes('application/json')) {
            //         throw new Error("Not a JSON response");
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     console.log("Data from /getEntries:", data);
            // })
            // .catch(error => {
            //     console.error("Fetch error:", error);
            // });
    }) 
})


