// Require all the dependencies used
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const minimist = require('minimist');
const app = express();
const args = require('minimist')(process.argv.slice(2));

// If --log=false then do not create a log file
if (args.log == 'false') {
    console.log("NOTICE: not creating file access.log")
} else {
    // Use morgan for logging to files
    // Create a write stream to append to an access.log file
    const accessLog = fs.createWriteStream('access.log', { flags: 'a' })
    // Set up the access logging middleware
    app.use(morgan('combined', { stream: accessLog }))
}

// Serve static HTML files
app.use(express.static('./public'));

// Make express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));

// Load the database
const db = require('./src/services/database');
const { env } = require('process');

// All the flip coin functions used
function coinFlip() {
    if (Math.random() < 0.5) {
        return "tails";
    } else {
        return "heads";
    }
}

function coinFlips(flips) {
    var result = [];
    for (let i = 0; i < flips; i++) {
        result[i] = coinFlip();
    }
    return result;
}


function countFlips(array) {
    let numHeads = 0, numTails = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "heads") {
            numHeads = numHeads + 1;
        } else {
            numTails = numTails + 1;
        }
    }
    var result = { tails: numTails, heads: numHeads };
    return result;
}

function flipACoin(call) {
    var expected = coinFlip();
    var outcome = "lose";
    if (call === expected) {
        outcome = "win";
    }
    var result = { call: call, flip: expected, result: outcome };
    return result;
}

const help = `
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`;

// If client requests help
if (args.help || args.h) {
    console.log(help);
    process.exit(0);
}

const port = args.port || process.env.PORT || 5000;

// Run server
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});

app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referrer: req.headers['referer'],
        useragent: req.headers['user-agent']
    };
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referrer, logdata.useragent)
    next();
})

