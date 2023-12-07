const socket = io();


// ----- [socket.io] live data example
// send
socket.emit("message", { message: "ping" });
// receive
socket.on("message", (msg) => {
  console.log(msg);
});


async function saveDataTo(url, data) {
  const dataStr = JSON.stringify(data);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: dataStr,
  });
  const json = await response.json();
  console.log(json);
}

const saveDataToMongodb = (data) => saveDataTo('/api/data', data);
const saveDataToServer = (data) => saveDataTo('/api/tmpdata', data);

// [mongodb] if you want to keep the data even if the server stops:
// saveDataToMongodb({ foo: 'foo' });

// [server side tmp data] or you don't care it, just keep it this round (and you do not need to setup mongodb):
// saveDataToServer({ bar: 'bar' });




// data saving example
const dataPreview = document.querySelector('#data-preview');
const dataInput = document.querySelector('#data-input');
const dataSubmit = document.querySelector('#data-submit');

dataSubmit.addEventListener('click', () => {
  const value = dataInput.value;
  if (!value) {
    alert('empty!');
    return;
  }
  
  save
});







// [leaflet]
const map = L.map('map').setView([51.505, -0.09], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const popup = L.popup()
  .setLatLng([51.513, -0.09])
  .setContent('I am a standalone popup.')
  .openOn(map);

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent(`You clicked the map at ${e.latlng.toString()}`)
    .openOn(map);
}

map.on('click', onMapClick);

