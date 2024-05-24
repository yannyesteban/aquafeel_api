const http = require('https');
const app = require('./app');

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port,'0.0.0.0',()=>console.log(`server started at port ${port}`))