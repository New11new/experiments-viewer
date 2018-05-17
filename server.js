const http = require('http');


const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(301, {Location: 'https://firefox-test-tube.herokuapp.com/'});
    res.end();
});

server.listen(port, () => console.log(`Listening on port ${port}...`));
