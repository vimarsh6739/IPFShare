const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'www.ipfshare.tk', port: '443', protocol: 'https'})
export default ipfs;
