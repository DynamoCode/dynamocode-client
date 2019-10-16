const yargs = require('yargs');
const reader = require("readline-sync");
const fs = require('fs');

const argv = yargs
    .command('login', 'Ask for credentials to authenticate')
	.command('exec', 'Execute command')
    .help()
    .argv;

if (argv._.includes('login')) {


	const username = reader.question("Username: ");
	const password = reader.question("Password: ", { hideEchoBack: true });
	console.log(`You entered: ${username} & ${password}`);


	console.log('writing it to a file');
	fs.writeFileSync('file.txt', `You entered: ${username} & ${password}`);
	console.log('done');

	
}
else 
if (argv._.includes('exec')) {
    console.log('exec command');
}
else {
	console.log('Unknown command: ', argv._);
}
