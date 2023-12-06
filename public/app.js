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

// if you want to keep the data even if the server stops:
// saveDataToMongodb({ foo: 'bar' });

// or you don't care 

