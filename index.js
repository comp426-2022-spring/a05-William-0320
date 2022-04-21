// Require all the dependencies used
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const minimist = require('minimist');
const app = express();
const args = require('minimist')(process.argv.slice(2));

