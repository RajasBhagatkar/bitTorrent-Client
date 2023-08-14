'use strict';

const Buffer = require('buffer').Buffer;
const { gneId } = require('../util');
const torrentParser = require('./torrent-parser');

/**
 * 
 * @param {*} torrent 
 * 
 *? handshake: <pstrlen><pstr><reserved><info_hash><peer_id>
 * 
 * pstrlen: string length of <pstr>, as a single raw byte
 * pstr: string identifier of the protocol
 * reserved: eight (8) reserved bytes. All current implementations use all zeroes.
 * peer_id: 20-byte string used as a unique ID for the client.
 * 
 ** In version 1.0 of the BitTorrent protocol, pstrlen = 19, and pstr = "BitTorrent protocol".
 * 
 */
module.exports.buildHandshake = torrent => {
    const buf = Buffer.alloc(68);

    // pstrlen
    buf.writeUInt8(19, 0);

    // pstr
    buf.write('BitTorrent protocol', 1)

    //reserved
    buf.writeUInt32BE(0, 20);
    buf.writeUInt32BE(0, 40);

    // info hash
    torrentParser.infoHash(torrent).copy(buf, 20)

    //pper id
    buf.write(util.gneId())


}