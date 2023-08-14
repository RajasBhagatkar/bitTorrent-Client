/**
 * Using tcp to send messages is similar to udp which we used before. 
 * In this case we use the “net” module instead of the “dgram” module
 * 
 */

'use strict';

/**
 *? for connection using tcp use "net" package
 *? for connection using udp use "dgram" pakcage
 */

const net = require('net');
const Buffer = require('buffer').Buffer;
const trakcer = require('./tracker')

/**
 * 
 * @param {*} torrent <p>torrent file</p>
 * 
 * //                                           
 ** we get the torrent file make request to trakcer vai UDP
 ** in callback we get peer ip make TCP connection to each peer and start exchanging messages.
 * 
 */

module.exports = torrent => {
    trakcer.getPeers(torrent, peers => {
        peers.forEach(download);
    })
}

/**
 * 
 * @param {*} peer  <p>IP address of peers</p>
 * //                                 
 * 
 ** for each peer we create a tcp connection and start exchanging messages.
 */
function download(peer) {
    const soket = net.Soket();
    soket.on('error', console.log)
    soket.connect(peer.port, peer.ip, () => {
        // soket.write(...) write message here
    })

    soket.on('data', data => {
        // handle response here
    })

}

/**
 * 
 * //                        
 *? "handlshake"
 * //                                   
 * 
 * 
 * //                        
 *? "have" and "bitfield" messages
 * //                                   
 *? "have" message

 * Each “have” message contains a piece index as its payload
 * This means you will receive multiple have messages, one for each piece that your peer has.
 * //                                   
 * 
 * 
 * //                        
 *? "bitfield" message
 * //                             
 * (The bitfield message serves a similar purpose, but does it in a different way as "have" message.)
 *
 *  The bitfield message can tell you all the pieces that the peer has in just one message.
 * 
 * It does this by sending a string of bits, one for each piece in the file. 
 * The index of each bit is the same as the piece index,
 * //                             
 * 
 * //                                                                     
 *? "choke", "unchoke", "interested" , and "not interested" messages
 * //                                                               
 ** If you are 
 ** "choked" => that means the peer does not want to share with you
 ** "unchoked" =>  peer is willing to share
 ** "interested " => means you want what your peer has
 ** "not interested" => means you don’t want what they have.
 * 
 * You always start out choked and not interested. 
 * So the first message you send should be the interested message.? 
 * Then hopefully they will send you an unchoke message and you can move to the next step.
 * If you receive a choke message message instead you can just let the connection drop.
 * 
 * //                                          
 */

