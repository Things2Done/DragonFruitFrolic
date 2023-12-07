
async function saveDataTo(url, data) {
  let dataStr = data;
  if (typeof dataStr !== 'string') {
    dataStr = JSON.stringify(data);
  }
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

// ----- [mongodb]
// if you want to keep the data even if the server stops:
// saveDataToMongodb({ foo: 'foo' });

// ----- [server side tmp data]
// or you don't care it, just keep it this round (and you do not need to setup mongodb):
// saveDataToServer({ bar: 'bar' });


const dataPreview = document.querySelector('#data-preview');
const dataInput = document.querySelector('#data-input');
const dataSubmit = document.querySelector('#data-submit');

async function showData() {
  const res = await fetch('/api/data');
  const jsonData = await res.json();
  
  // console.log(jsonData);
  
  // dataPreview.innerHTML = '';
  // if (jsonData) {
  //   dataPreview.innerHTML = jsonData.map(item => {
  //     return `<p>${item.text}</p>`
  //   }).join('');
  // }
  
  if (jsonData) {
    const data = jsonData.map(item => {
      return {
        name: item.text,
        value: 1,
      }
    });
    setData(data);
    refreshChart();
  }
}

initChart(dataPreview);
showData();


dataSubmit.addEventListener('click', async () => {
  const text = dataInput.value;
  if (!text) {
    alert('empty!');
    return;
  }
  
  await saveDataToMongodb({ text: text });
  // alert('saved!');
  dataInput.value = '';
  showData();
});




// ----- [socket.io] live data example
const socket = io();

// send
socket.emit("message", { message: "ping" });
// receive
socket.on("message", (msg) => {
  console.log(msg);
});



// ----- [leaflet] 
const map = L.map('map').setView([31.150789, 121.47701], 17);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var greenIcon = L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function addPointToMap(latlng) {
  const marker = L.marker(latlng, {icon: greenIcon}).addTo(map)
		.bindPopup('<b>Hello world!</b><br />I am a popup.');
}


function onMapClick(e) {
  const latlng = e.latlng;
  addPointToMap(latlng);
  socket.emit('point', { name: 'foooo', latlng: latlng });
}

map.on('click', onMapClick);

async function syncPoints() {
  // get points so far
  const res = await fetch('/api/points');
  const points = await res.json();
  points.forEach(p => {
    addPointToMap(p.latlng);
  });
  
  // keep sync
  socket.on('point', (point) => {
    addPointToMap(point.latlng);
  });
}

syncPoints();

