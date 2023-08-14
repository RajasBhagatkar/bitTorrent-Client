'use strict'

const fs = require('fs')
const bencode = require('node-bencode');
const crypto = require('crypto')
const bignum = require('bignum')

module.exports.open = (filepath) => {
    return bencode.decode(fs.readFileSync(filepath))
};

module.exports.size = torrent => {
    //...
    const size = torrent.info.files ?
        torrent.info.files.map(file => file.length).reduce((a, b) => a + b) :
        torrent.info.length

    return bignum.toBuffer(size, { size: 8 });
}

/**
 * 
 * @param {*} torrent 
 * 
 * apply SHA1 hashing function, to the the info property of the  torrent file to get the info Hash. 
 * 
 * apply a SHA1 hash easily using the built-in crypto module.
 * 
 */
module.exports.infoHash = torrent => {
    //...
    const info = bencode.encode(torrent.info)
    return crypto.createHash('sha1').update(info).digest();
}