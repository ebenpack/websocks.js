var crypto = require('crypto');

function calculateSockKey(key) {
    return (
        crypto.createHash('sha1').update(
            key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
        ).digest('base64')
    );
}

function websocks(server) {
    server.on('upgrade', function(req, socket, head) {
        socket.write(
            'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            "Sec-WebSocket-Accept: " + calculateSockKey(req.headers['sec-websocket-key'] + "\r\n") +
            "\r\n"
        );

        socket.on('data', parse);

        function parse(chunk) {
        }
    });
}

module.exports = websocks;