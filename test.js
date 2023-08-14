const bencode = require('node-bencode')
const urlParser = require('url').parse
const fs = require('fs')

const decode = bencode.decode(fs.readFileSync('./puppy.torrent'))
console.log(decode.announce.toString(decode.encoding));

console.log(urlParser(decode.announce.toString(decode.encoding)));


// "test": "mocha src/__test__",