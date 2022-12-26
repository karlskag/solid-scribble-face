import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const sockets = {}
let glob_index = 1

wss.on('connection', function connection(ws) {
  const ID = `uid_${glob_index}`
  sockets[ID] = ws

  // Dispatch connection event
  ws.send(JSON.stringify({ type: 'CONNECTED', data: ID }))
  glob_index += 1

  // Receive message and dispatch to other listeners
  ws.on('message', function message(data) {
    const parsedData = JSON.parse(data)

    Object.keys(sockets).forEach((wsKey) => {
      if (parsedData.ID === wsKey) return

      const _ws = sockets[wsKey]
      _ws.send(JSON.stringify({ type: 'DRAW_UPDATE', data: parsedData }))
    })
  });
});