function websocks(server) {
    server.on('upgrade', function() {
        socket.write(
            'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            "\r\n"
        );
    });
}

module.exports = websocks;