"use strict";


const dgram = require('dgram')
const Buffer = require('buffer').Buffer  //returns buffer not string
// buffer is sequence of raw bytes
// In node.js a buffer is a container for raw bytes.

const urlParser = require('url').parse
const crypto = require('crypto')  // create a random number

const torrentParser = require('./torrent-parser');
const util = require('../util');

/**
 *  url:  This lets me easily extract different parts of the url like its protocol, hostname, port, etc.
 * 
 *  dgram: to create new socket instance, A socket is an object through which network communication can happen.
 *  udp4 mean normal 4-byte IPv4 address format (e.g. 127.0.0.1)
 *  we can also use udp6 mean 6-byte IPv6 address format (e.g. FE80:CD00:0000:0CDE:1257:0000:211E:729C)
 * 
 * In order to send a message through a socket, it must be in the form of a buffer, not a string or number
 * Buffer.from is an easy way to create a buffer from a string
 * 
 * The socket’s "send" method is used for sending messages. 
 * The first argument is the message as a buffer
 * The next two arguments let you send just part of the buffer as the message by specifying an offset and length of the buffer,
 * but if you’re just sending the whole buffer you can just set the offset to 0 and the length to the whole length of the buffer
 * Next is the port and host of the receiver’s url
 * the last argument is a callback for when the message has finished sending.
 * 
 * 
 * "on" method will tell the socket how to handle incoming messages
 */


/**
 * 1) Send a connect request
 * 2) Get the connect response and extract the connection id
 * 3) Use the connection id to send an announce request - this is where we tell the tracker which files we’re interested in
 * 4) Get the announce response and extract the peers list
 * 
 */
/**
 * 
 * 1) to send the request it should be in correct format
 * Each message is a buffer with a specific format described in the BEP.
 * 
 */

module.exports.getPeers = (torrent, callback) => {
    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf8')
    /**
     * announce url is trackers url
     * it is the lcoation of the torrent's tracker
     * format (e.g  udp://tracker.coppersurfer.tk:6969/announce )
     */


    // 1 send connect request to tracker
    udpSend(socket, buildConnReq(), url);

    // recive
    socket.on('message', response => {
        if (resType(response) === 'connect') {
            // 2 recive and parse the connect response
            const connResp = parseConnResp(response)
            // 3 send announce request
            const announceReq = buildAnnounceReq(connResp.connectionId)
            udpSend(socket, announceReq, url);
        } else if (resType(response) === 'announce') {
            // 4 parse announce response
            const announceResp = parseAnnounceResp(response)
            // 5 pass peers to callback
            callback(announceResp.peers)
        }
    })
}
function udpSend(socket, message, rawUrl, callback = () => { }) {
    const url = urlParser(rawUrl)
    // send
    socket.send(message, 0, message.length, url.port, url.host, callback);
}



/**
 * respType will check if the response was for the connect or the announce request.
 * Since both responses come through the same socket, we want a way to distinguish them.
*/
function resType(resp) {
    const action = resp.readUInt32BE(0);
    if (action === 0) return 'connect';
    if (action === 1) return 'announce';
}
function buildConnReq() {
    // all numbers are in bytes
    const buf = Buffer.alloc(16)
    /**
     * new empty buffer with a size of 16 bytes since the entire message should be 16 bytes long.
     * 
     */


    /**
     * connection id
     * 0x41727101980 when writing connection request
     * 64-bit hence 8 byte hence 8 index of next byte
     * 
     * method "writeUInt32BE" which writes an unsigned 32-bit integer
     * writeUInt32BE(number, offset)
     * We pass the number 0x417 and an offset value of 0.
     * 
     * what’s with the 0x? 
     * The 0x indicates that the number is a hexadecimal number, 
     * which can be a more conventient representation when working with bytes.
     *  Otherwise they’re basically the same as base 10 numbers.
     * 
     * 
     * and why do we have to split the number into two writes?
     * The reason we have to write in 4 byte chunks, is that there is no method to write a 64 bit integer. 
     * Actually node.js doesn’t support precise 64-bit integers. 
     * But as you can see it’s easy to write a 64-bit hexadecimal number as a combination of two 32-bit hexadecimal numbers.
     * 
     */
    buf.writeUInt32BE(0x417, 0); // 4 bytes
    buf.writeUInt32BE(0x27101980, 4); // 4 bytes

    /**
     * action
     * 
     * This values should always be 0 for the connection request.
     * */
    buf.writeUInt32BE(0, 8); // 4 bytes

    /**
     * transaction
     * 
     * crypto.randomBytes(4) generate a random 4-byte buffer
     * To copy that buffer into our original buffer we use the copy method
     * 
     * */
    crypto.randomBytes(4).copy(buf, 12); // 4 bytes

    // total message length in bytes 8+4+4=16

    return buf;



}
function parseConnResp(resp) {
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8)
    }

}

//Announce messaging
function buildAnnounceReq(connId, torrent, port = 6881) {
    const buf = Buffer.allocUnsafe(98)

    // conectionn id
    connId.copy(buff, 0); // 64 bit length +8-byte

    /**
     * action  
     * 
     * 1  =  announce
     * 0 =   connect
     *  */
    buf.writeUInt32BE(1, 8);// 32 bit length +4

    // transactionId random
    crypto.randomBytes(4).copy(buf, 12)

    //info hash
    torrentParser.infoHash(torrent).copy(buf, 16);

    // peerId
    util.genId().copy(buf, 36)

    //downloaded
    Buffer.alloc(8).copy(buf, 56)

    // left
    torrentParser.size(torrent).copy(buf, 64)

    // upload
    Buffer.alloc(8).copy(buf, 72)

    // event
    buf.writeUInt32BE(0, 80);

    // ip address
    buf.writeUint32BE(0, 80);

    // key
    crypto.randomBytes(4).copy(buf, 88)

    // num want
    buf.writeInt32BE(-1, 92);

    // port 
    // ports for bittorrent should be between 6881 and 6889, 
    // so I’ve decided to use a default of 6681.
    buf.writeUInt16BE(port, 96);

    return buf;

}

/**
 * 
 * @param {*} resp 
 * 
 * The addresses come in groups of 6 bytes, 
 * The first 4 represent the IP address and the next 2 represent the port. 
 * So our code will need to correctly break up the addresses part of the response.
 * 
 */
function parseAnnounceResp(resp) {
    function group(iterable, groupsize) {
        let groups = []
        for (let i = 0; i < iterable.length; i += groupsize) {
            groups.push(iterable.slice(i, i + groupsize))
        }
        return groups;
    }

    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        leechers: resp.readUInt32BE(8),
        seeders: resp.readUInt32BE(12),
        peers: group(resp.slice(20), 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUInt32BE(4)
            }
        })
    }
}