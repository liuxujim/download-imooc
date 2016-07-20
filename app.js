const util = require('./util')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Which course do you want to download? type 418 for example', (answer) => {
  // TODO: Log the answer in a database
 util.getCoursePageContent(answer)

  rl.close();
});


