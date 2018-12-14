//by calling queueRequests this way instead of through the CLI, the options object isn't created. I solve that by creating it at the beginning of the function, BUT if I ever have a weird bug, check that first!!!
const queueRequests = require('./bin/cc');

let usersReadyToQueue = [];


  //TODO: Get the github ids straight from the google sheet with an AJAX call
  // using indexForAJAXCall and then use that script that's pasted into sheets (for my test spreadsheet)
  // this needs an API key/ enabling/ whatever
  // let url = 'https://sheets.googleapis.com/v4/spreadsheets/197aGIn3XQ1p64hbcrP8AboJxF3jN7d4pS_dTlk8IBSg'
  // fetch(url)
  // .then(response => {
  //   response.json().then(json => {console.log("JSON-y goodness", json);})
  // })
  // .catch(err => {console.log(err);})
const infoArray = require('../infoFromSelfIdSheet')

const parseRows = function() {
  for(let i=0; i<infoArray.length; i++) {
    let currentRow = infoArray[i];
    addGithubIdsToArray(currentRow)
  }
}

parseRows();


//loop through the github Ids and queue them up using the crawler-cli code.
queueRequests(usersReadyToQueue)


function addGithubIdsToArray(row) {
  if(row[1] !== '') {
    usersReadyToQueue.push("users/"+row[1]);
  }
}

/*potential improvements-
can look into using a If-Modified-Since header to only queue users with new events https://developer.github.com/v3/#rate-limiting
have the AJAX call only get the most recent rows ??
subscribe to updates to the spreadsheet and only grab the last one ??
only grab the relevant info (not the timestamp)???
tests
code that handles errors and edge cases gracefully
*/