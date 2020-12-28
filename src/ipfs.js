const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: '34.93.89.211', port: '80', protocol: 'http'})
export default ipfs;
