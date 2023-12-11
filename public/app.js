

const { OpenStreetMapProvider } = GeoSearch;

//define geocode function
async function callTest(locationQuery) {
    // initialize OpenStreets
    const provider = new OpenStreetMapProvider();
    // search with locationquery
    const results = await provider.search({ query: locationQuery });
    //return results and log them
    console.log(results)
    return results;
}


// iconUrl: 'dragonfruitMarker.png',
// let entertainmentMarker = new dragonfruitMarker({iconUrl: 'DragonfruitEntertainment.png'}),
//     foodMarker = new dragonfruitMarker({iconUrl: 'DragonfruitFood.png'}),
//     historyMarker = new dragonfruitMarker({iconUrl: 'DragonfruitHistory.png'}),
//     schoolMarker = new dragonfruitMarker({iconUrl: 'DragonfruitSchool.png'}),
//     livingMarker = new dragonfruitMarker({iconUrl: 'DragonfruitLiving.png'});
// to use: L.marker([lat, lon], {icon: foodMarker}).addTo(map).bindPopup("I am a green leaf.");


let entertainmentMarker = L.icon({
    iconUrl: 'DragonfruitEntertainment.png',
    iconSize: [50, 75], // size of the icon
    iconAnchor: [22, 75], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
let foodMarker = L.icon({
    iconUrl: 'DragonfruitFood.png',
    iconSize: [50, 75], // size of the icon
    iconAnchor: [22, 75], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
let historyMarker = L.icon({
    iconUrl: 'DragonfruitHistory.png',
    iconSize: [50, 75], // size of the icon
    iconAnchor: [22, 75], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
let schoolMarker = L.icon({
    iconUrl: 'DragonfruitSchool.png',
    iconSize: [50, 75], // size of the icon
    iconAnchor: [22, 75], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
let livingMarker = L.icon({
    iconUrl: 'DragonfruitLiving.png',
    iconSize: [50, 75], // size of the icon
    iconAnchor: [22, 75], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

//NYU Berlin Location Hard Coded
let Lat = 52.53818908578969;
let Lon = 13.412658806197292;

//initalize leaflet map looking at NYU Berlin with Zoom of 13
let map = L.map('map').setView([Lat, Lon], 13);
//marker placed at NYU Berlin
let marker = L.marker([Lat, Lon], { icon: schoolMarker }).addTo(map);
// let marker = L.marker([Lat, Lon],).addTo(map);


//initialize an array of places
let places = [];

//add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//event listener for what to do when the page is loaded
window.addEventListener('load', () => {
    //call function to load map markers immediately with page
    fetchEntriesAndAddMarkers();
    //when enter button is pressed do the following
    document.getElementById('button-enter')?.addEventListener('click', async () => {
        //get the values from each entry field
        let user = document.getElementById("user").value;
        let location = document.getElementById("location").value;
        let description = document.getElementById("description").value;
        let category = document.getElementById("category").value;
        if (multimediaInput.files.length > 0) {
            let file = multimediaInput.files[0];
        }
        console.log(user);
        console.log(location);
        console.log(description);
        console.log(category);
        // Handle the form submission with geocoded data
        let lastEnteredLocation = places.length > 0 ? places[places.length - 1] : null;
        //make an object from the entry information
        let obj = {
            "user": user,
            "location": location,
            "description": description,
            "category": category,
            // "multimedia": file,
            "lat": lastEnteredLocation ? lastEnteredLocation.lat : undefined,
            "lon": lastEnteredLocation ? lastEnteredLocation.lon : undefined
        };
        // Convert the object to a JSON string.
        let jsonData = JSON.stringify(obj);

        // Use the geocoding function to get coordinates for the provided location.

        const geocodeResults = await callTest(location);
        // If geocoding results are returned, place a new marker on the map and update the object with the latitude and longitude.

        if (geocodeResults.length > 0) {
            const { x: lon, y: lat } = geocodeResults[0];
            let categoryIcon;

            switch (category) {
                case 'food':
                    categoryIcon = foodMarker;
                    break;
                case 'entertainment':
                    categoryIcon = entertainmentMarker;
                    break;
                case 'school-event':
                    categoryIcon = schoolMarker;
                    break;
                case 'historic-site':
                    categoryIcon = historyMarker;
                    break;
                case 'living':
                    categoryIcon = livingMarker;
                    break;
                default:
                    console.error('Invalid category:', category);
                    return; // Exit the function if the category is invalid
            }

            // Now use the categoryIcon when creating a marker
            L.marker([lat, lon], { icon: categoryIcon }).addTo(map).bindPopup(`User: ${user} <br>Location: ${location} <br>Description: ${description}<br>Category: ${category}`);



            // if (geocodeResults.length > 0) {
            //     const { x: lon, y: lat } = geocodeResults[0];

            // //if the entry is for living notate the area, if it is anything 
            // //else place a specific marker
            //     if (category === 'Living'){
            //         let polygonCoords =[
            //             [lat, lon],
            //         ]
            //     }
            //     // You can use lat and lon as needed, for example:
            //     // Add a marker to the map at the geocoded location
            //     L.marker([lat, lon]).addTo(map).bindPopup(location);
            // console.log(location);
            // console.log(lat);
            // console.log(lon);
            obj.lat = lat;
            obj.lon = lon;
            jsonData = JSON.stringify(obj);
        }
        console.log("Data to be sent to server:", jsonData);

        // Send a POST request to the '/entered' endpoint with the JSON data.
        fetch('/entered', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
            //parse response as json
            .then(res => {
                return res.json();
            })
            //log response and catch any errors
            .then(data => (console.log("Response from /entered:", data)))
            .catch(error => console.error("Error in fetch /entered:", error));
    })
    //function up click of get-read-out button - this is a place holder for map places
    document.getElementById('get-read-out').addEventListener('click', () => {
        fetchEntriesAndAddMarkers();
    });

    function fetchEntriesAndAddMarkers() {
        //Get request to the /getEntries
        fetch('getEntries')
            //parse json
            .then(resp => resp.json())
            //process the info from server    
            .then(data => {
                console.log("Data received from /getEntries:", data);
                //if data is an array make a market for each entry
                if (Array.isArray(data)) {


                    data.forEach(entry => {
                        if (typeof entry.lat === 'number' && typeof entry.lon === 'number') {
                            let categoryIcon;
                            // Determine the icon based on the category
                            switch (entry.category) {
                                case 'food':
                                    categoryIcon = foodMarker;
                                    break;
                                case 'entertainment':
                                    categoryIcon = entertainmentMarker;
                                    break;
                                case 'school-event':
                                    categoryIcon = schoolMarker;
                                    break;
                                case 'historic-site':
                                    categoryIcon = historyMarker;
                                    break;
                                case 'living':
                                    categoryIcon = livingMarker;
                                    break;
                            }

                            L.marker([entry.lat, entry.lon],{icon: categoryIcon}).addTo(map)
                                .bindPopup(`User: ${entry.user} <br>Location: ${entry.location} <br>Description: ${entry.description}<br>Category: ${entry.category}`);
                        } else {
                            console.error('Invalid entry:', entry);
                        }
                    });
                } else   // If data is not an array, log an error or handle it appropriately
                {
                    console.error('Expected an array of entries:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching entries:', error);
            });
    }


});