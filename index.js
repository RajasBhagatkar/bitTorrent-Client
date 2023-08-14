'use strict'
const fs = require('fs')
const bencode = require('node-bencode');
const tracker = require('./src/tracker')
const torrentParser = require('./src/torrent-parser')
const download = require('./src/download')



const dgram = require('dgram')
const Buffer = require('buffer').Buffer
const urlParser = require('url').parse
/**
 * Bencode
 * bencode is data serialization format
 * bencode is essentially based similiary idea as JSON or XML 
 * bencode is essentially the same idea, it just uses a slightly different format.
 * 
 * 
 */

// const torrent = fs.readFileSync('puppy.torrent') //returns buffer not string
// buffer is sequence of raw bytes
// In node.js a buffer is a container for raw bytes.


// const torrent = bencode.decode(fs.readFileSync('puppy.torrent'))
// console.log(urlParser(torrent.announce.toString('utf8')));
const torrent = torrentParser.open(process.argv[2]);


// tracker.getPeers(torrent, peers => {
//     console.log("list of peers: ", peers);
// })

// torrent(torrent)
download(torrent)









