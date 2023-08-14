
# bitTorrent-Client

bitTorrent-Client is a terminal based BitTorrent client that can access and download content from peers, handle concurrent node management and connection establishment.

## Features

- Supports the BitTorrent protocol specification
- Parses torrent files and magnet links
- Connects to multiple peers and trackers
- Downloads pieces in parallel and verifies their integrity
- Saves downloaded files to disk
- Displays download progress and statistics

## Installation

To install bitTorrent-Client, you need to have Node.js and npm installed on your system. Then, clone this repository and run the following command in the project directory:

```bash
npm install
```

This will install all the dependencies required by the project.

## Usage

To use bitTorrent-Client, you need to provide a torrent file or a magnet link as an argument. For example:

```bash
node index.js puppy.torrent
```

or

```bash
node index.js magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80
```

The program will start downloading the content from the peers and display the progress and statistics on the terminal. The downloaded files will be saved in the same directory as the torrent file or in a folder named after the magnet link.

## License

bitTorrent-Client is licensed under the MIT License. See [LICENSE] file for more details.

## Contributors

bitTorrent-Client is developed by Rajas Bhagatkar ([RajasBhagatkar]). If you have any questions, suggestions, or feedback, feel free to contact me or open an issue on GitHub.