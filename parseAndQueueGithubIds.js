//by calling queueRequests this way instead of through the CLI, the options object isn't created. I solve that by creating it at the beginning of the function, BUT if I ever have a weird bug, check that first!!!
const queueRequests = require('./bin/cc');

let arrayOfIdObjects = []; //LDAP plus GitHub Id
let usersReadyToQueue = [];
let contributorsProbablyUsingNotGH = []; //list of LDAPs - follow up with those people offline, then add the info to their idObject
//TODO: let indexForAJAXCall = get this number from an outside datastore

//for now, get info for infoArray by running the google script and then copy/pasting the array
  //TODO: later, do an AJAX-ish call to get it using indexForAJAXCall and then use that script that's pasted into sheets (for my test spreadsheet)
  // this needs an API key/ enabling/ whatever
  // let url = 'https://sheets.googleapis.com/v4/spreadsheets/197aGIn3XQ1p64hbcrP8AboJxF3jN7d4pS_dTlk8IBSg'
  // fetch(url)
  // .then(response => {
  //   response.json().then(json => {console.log("JSON-y goodness", json);})
  // })
  // .catch(err => {console.log(err);})
//["Timestamp","My GitHub ID is:","Do you participate in open source communities that are not on GitHub? If so, please tell us more!","","Email Address"]
const infoArray = [
  ["Wed Sep 05 16:46:47 GMT-07:00 2018","DuaneOBrien","","","duaneo@indeed.com"],["Wed Sep 05 17:26:28 GMT-07:00 2018","alisonjudy","ASF ID: alisonyu","","alisonyu@indeed.com"],
  ["Thu Sep 06 09:53:17 GMT-07:00 2018","danisyellis","No","","dgellis@indeed.com"],["Thu Sep 06 14:15:45 GMT-07:00 2018","youknowjack","","","jack@indeed.com"],["Thu Sep 06 14:15:48 GMT-07:00 2018","mkw","","","mwerle@indeed.com"],["Thu Sep 06 14:16:05 GMT-07:00 2018","kendallm","","","kmorgan@indeed.com"],["Thu Sep 06 14:16:14 GMT-07:00 2018","kmorgan","","","kmorgan@indeed.com"],
  ["Thu Sep 06 14:16:16 GMT-07:00 2018","shoenig","","","hoenig@indeed.com"],["Thu Sep 06 14:16:24 GMT-07:00 2018","kendallm","","","kmorgan@indeed.com"],["Thu Sep 06 14:16:39 GMT-07:00 2018","sonnym","Not at the moment, though I have submitted to projects on BitBucket before.","","smichaud@indeed.com"],["Thu Sep 06 14:18:12 GMT-07:00 2018","doug-wade","No","","dwade@indeed.com"],["Fri Sep 07 08:56:24 GMT-07:00 2018","corespace","","","kprete@indeed.com"],["Fri Sep 07 11:09:33 GMT-07:00 2018","jjshanks","","","jshanks@indeed.com"], ["Wed Sep 05 16:46:47 GMT-07:00 2018","","Yes","","noGithub@indeed.com"]
]

//   queueRequests(usersReadyToQueue); TODO: This is for the future, when I save the usersReadyToQueue array into a datastore of some sort. By doing this first, I"m not confusing it with the ones that need to queue and then add LDAP
const parseRows = function() {
  for(let i=0; i<infoArray.length; i++) {
    let currentRow = infoArray[i];
    let LDAP = parseLDAPfromEmail(currentRow);
    createIdObjects(currentRow, LDAP);
    addGithubIdsToArray(currentRow)   //TODO: might want to pass in the LDAP here so that we can use it after crawling (and then maybe stop using createIdObjects??)- OR, use the object I made with createIdObjects
    createListOfContributorsUsingNotGH(currentRow, LDAP);
  }
  //TODO: indexForAJAXCall += infoArray.length; and then update the local datastore with indexForAJAXCall
}

parseRows();


//loop through the github Ids and queue them up using the crawler-cli code. Then, add LDAPs to user records in the db
const willQueueUsers = new Promise(
  function (resolve, reject) {
    queueRequests(usersReadyToQueue)
    resolve()
    reject()
})

const addUserInfoToDB = function() {
  willQueueUsers
  .then(function(something) {
    //addLDAPs()
    console.log("The something!", something);
  })
  .catch(function( error) {
    console.log("Ummmmmmm", error)
  })
}

addUserInfoToDB();



function parseLDAPfromEmail(row) {
  return row[4].slice(0, row[4].indexOf("@"))
}

function createIdObjects(row, LDAP) {
  let idObject = {
    LDAP: LDAP,
    github: row[1]
  }
  arrayOfIdObjects.push(idObject)  //TODO: later, add this to db instead
}

function addGithubIdsToArray(row) {
  if(row[1] !== '') {
    usersReadyToQueue.push("users/"+row[1]); //TODO: later, add this to db instead
  }
}

function createListOfContributorsUsingNotGH(row, LDAP) {
  if(row[2] !== "") {
    contributorsProbablyUsingNotGH.push(LDAP) //TODO: later, add this to db instead
  }
}

function addLDAPs() {
  //for now, get user, check if has LDAP, if not, add LDAP
  //later: only run func on the new ones (maybe still make sure doesn't have an LDAP- overcautious but might save an error)
  //how do I talk to the docker mongo db?????

}









/*potential improvements-
have the AJAX call only get the most recent rows ??
subscribe to updates to the spreadsheet and only grab the last one ??
only grab the relevant info (not the timestamp)???
tests
code that handles errors and edge cases gracefully
*/


/*
Future Features:
-at some point, write the code that will allow us to add people's other contribution info to their idObject, after we talk to them
-write code that will allow us to stop caring about a person's new contribs (because they stopped working for us)
*/








/* The logs from logging out options when queueRequests is called- first one without a queue, second one with
Command {
  commands: [],
  options:
   [ Option {
       flags: '-q, --queue <name>',
       required: true,
       optional: false,
       bool: true,
       short: '-q',
       long: '--queue',
       description: 'The queue onto which the requests are pushed' } ],
  _execs: {},
  _allowUnknownOption: false,
  _args: [ { required: true, name: 'requests', variadic: true } ],
  _name: 'queue',
  _noHelp: false,
  parent:
   Command {
     commands:
      [ [Command],
        [Command],
        [Circular],
        [Command],
        [Command],
        [Command],
        [Command],
        [Command],
        [Command],
        [Command],
        [Command] ],
     options: [ [Option], [Option], [Option], [Option] ],
     _execs: {},
     _allowUnknownOption: false,
     _args: [],
     _name: 'cc',
     _version: '0.0.1',
     _versionOptionName: 'version',
     _events:
      { 'option:version': [Function],
        'option:interactive': [Function],
        'option:service': [Function],
        'option:token': [Function],
        'command:help': [Function: listener],
        'command:stop': [Function: listener],
        'command:queue': [Function: listener],
        'command:start': [Function: listener],
        'command:orgs': [Function: listener],
        'command:config': [Function: listener],
        'command:tokens': [Function: listener],
        'command:listtokens': [Function: listener],
        'command:deadletters': [Function: listener],
        'command:events': [Function: listener],
        'command:exit': [Function: listener] },
     _eventsCount: 15,
     rawArgs:
      [ '/Users/dgellis/.nvm/versions/node/v10.9.0/bin/node',
        '/Users/dgellis/Tools/danisyellis/ghcrawler-cli/bin/cc',
        'queue',
        'users/danisyellis' ],
     args: [ [Array], [Circular] ] },
  _events: { 'option:queue': [Function] },
  _eventsCount: 1,
  _description:
   'Queue the given list of orgs and/or repos and/or users to be processed.',
  _argsDescription: undefined }


  Command {
    commands: [],
    options:
     [ Option {
         flags: '-q, --queue <name>',
         required: true,
         optional: false,
         bool: true,
         short: '-q',
         long: '--queue',
         description: 'The queue onto which the requests are pushed' } ],
    _execs: {},
    _allowUnknownOption: false,
    _args: [ { required: true, name: 'requests', variadic: true } ],
    _name: 'queue',
    _noHelp: false,
    parent:
     Command {
       commands:
        [ [Command],
          [Command],
          [Circular],
          [Command],
          [Command],
          [Command],
          [Command],
          [Command],
          [Command],
          [Command],
          [Command] ],
       options: [ [Option], [Option], [Option], [Option] ],
       _execs: {},
       _allowUnknownOption: false,
       _args: [],
       _name: 'cc',
       _version: '0.0.1',
       _versionOptionName: 'version',
       _events:
        { 'option:version': [Function],
          'option:interactive': [Function],
          'option:service': [Function],
          'option:token': [Function],
          'command:help': [Function: listener],
          'command:stop': [Function: listener],
          'command:queue': [Function: listener],
          'command:start': [Function: listener],
          'command:orgs': [Function: listener],
          'command:config': [Function: listener],
          'command:tokens': [Function: listener],
          'command:listtokens': [Function: listener],
          'command:deadletters': [Function: listener],
          'command:events': [Function: listener],
          'command:exit': [Function: listener] },
       _eventsCount: 15,
       rawArgs:
        [ '/Users/dgellis/.nvm/versions/node/v10.9.0/bin/node',
          '/Users/dgellis/Tools/danisyellis/ghcrawler-cli/bin/cc',
          'queue',
          'users/danisyellis',
          '--queue',
          'DaniQueue' ],
       args: [ [Array], [Circular] ] },
    _events: { 'option:queue': [Function] },
    _eventsCount: 1,
    _description:
     'Queue the given list of orgs and/or repos and/or users to be processed.',
    _argsDescription: undefined,
    queue: 'DaniQueue' }
*/