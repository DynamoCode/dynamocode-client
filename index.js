const yargs = require('yargs');
const reader = require("readline-sync");
const fs = require('fs');
const os = require('os');
const path = require('path')
const https = require('http')
//const https = require('https')

const argv = yargs
	.command('login', 'Ask for credentials to authenticate')
	.command('exec', 'Execute command')
	.help()
	.argv;

const filename = path.join(os.tmpdir(), 'token');
//console.log(filename);

if (argv._.includes('login')) {


	const username = reader.question("Username: ");
	const password = reader.question("Password: ", { hideEchoBack: true });

	const data = JSON.stringify({
		Email: username,
		Password: password
	});

	const options = {
		hostname: 'localhost',
		port: 60000,
		path: '/api/token/',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	};

	const req = https.request(options, res => {

		if (res.statusCode == 200) {
			console.log('Authentication successful');
		} else {
			console.log('Authentication failed');
		}

		res.on('data', d => {
			fs.writeFileSync(filename, d);
			console.log('Token saved');
		})
	})

	req.on('error', error => {
		console.error(error)
	})

	req.write(data)
	req.end()

}
else
	if (argv._.includes('exec')) {
		console.log('exec command');

		if (!fs.existsSync(filename)){
			console.log('No authentication token found, please use login command');
			process.exit(0);
		}

		const token = fs.readFileSync(filename);

		console.log('Token found');

		const data = JSON.stringify({
			EntityId: 1,
			Templates: [{
					TemplateId: 1,
					SubFolders: ''
				}
			]
		});
	
		const options = {
			hostname: 'localhost',
			port: 60000,
			path: '/api/dynamocode',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length,
				'Authorization': 'Bearer ' + token.toString()
			}
		};

		const req = https.request(options, res => {

			if (res.statusCode == 200) {
				console.log('exec request successful');
			} else {
				console.log('exec request failed');
			}
	
			res.on('data', d => {
				
				const result = JSON.parse(d.toString())
				console.log(result);
			})
		})
	
		req.on('error', error => {
			console.error(error)
		})
	
		req.write(data)
		req.end()

	}
	else {
		console.log('Unknown command: ', argv._);
	}
