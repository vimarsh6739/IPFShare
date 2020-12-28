const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: process.env.NGINX_SERVER_KEY, port: '80', protocol: 'http'})
export default ipfs;