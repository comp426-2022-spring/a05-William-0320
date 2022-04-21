// Require all the dependencies used
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const minimist = require('minimist');
const app = express();
const args = require('minimist')(process.argv.slice(2));


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
if(args.help || args.h){
    console.log(help);
    process.exit(0);
}