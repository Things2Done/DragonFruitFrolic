const socket = io();

socket.emit("message", { message: "ping" });

socket.on("message", (msg) => {
  console.log(msg);
});

function demoSaveData(data) {
  fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: data,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}
