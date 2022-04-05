var axios = require('axios');
var qs = require('qs');
var gmail = require("./GmailApi")


gmail.readInboxContent("from:satyendrasingh@forcebolt.com");