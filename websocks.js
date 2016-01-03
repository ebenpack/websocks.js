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
            var maskKey;
            var index;
            var bitcursor = 0;
            var fin = chunk[0] >> 7;
            var RSV1 = chunk[0] >> 6;
            var RSV2 = chunk[0] >> 5;
            var RSV3 = chunk[0] >> 4;
            var Opcode = chunk[0] & 15;
            bitcursor += 8;
            var mask = chunk[1] >> 7;
            var payloadLen = chunk[1] & 127;
            bitcursor += 8;
            if (payloadLen === 126) {
                payloadLen = (chunk[2] << 8) | chunk[3];
                bitcursor += 16;
            } else if (payloadLen === 127) {
                payloadLen = (
                    (chunk[2] << 56) |
                    (chunk[3] << 48) |
                    (chunk[4] << 40) |
                    (chunk[5] << 32) |
                    (chunk[6] << 24) |
                    (chunk[7] << 16) |
                    (chunk[8] << 8) |
                    (chunk[9] << 0)
                );
                bitcursor += 64;
            }
            if (mask) {
                index = Math.floor(bitcursor / 8);
                maskKey = chunk.slice(index, index + 4);
                bitcursor += 4 * 8;
            }
        }
    });
}

module.exports = websocks;