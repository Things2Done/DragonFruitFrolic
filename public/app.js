const socket = io();


// ----- live data example
// send
socket.emit("message", { message: "ping" });
// receive
socket.on("message", (msg) => {
  console.log(msg);
});

// ----- data save example
async function saveData(data) {
  const dataStr = JSON.stringify(data);
  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: dataStr,
  });
  const json = await response.json();
  console.log(json);
}


