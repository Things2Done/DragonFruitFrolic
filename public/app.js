const socket = io();

socket.emit("message", { message: "ping" });

socket.on("message", (msg) => {
  console.log(msg);
});

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


