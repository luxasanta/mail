const http = require('http');
const fs = require('fs');

let emails = [];

// Create the server
http.createServer(function (req, res) {
    // Allow browser to call /inbox.json
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Receive message from contact form
    if (req.method === 'POST' && req.url === '/send') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            emails.push({
                from: data.name + ' <' + data.email + '>',
                subject: 'Message from website',
                text: data.message,
                date: new Date().toLocaleString()
            });
            res.end('OK');
        });
        return;
    }

    // Return inbox as JSON
    if (req.url === '/inbox.json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(emails.reverse()));
        return;
    }

    // Serve the HTML page
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');

}).listen(80, '0.0.0.0', () => {
    console.log('Server running!');
    console.log('Open → http://luxa.gt.tc');
});
