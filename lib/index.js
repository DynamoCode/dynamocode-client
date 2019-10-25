const yargs = require('yargs');
const reader = require("readline-sync");
const fs = require('fs');
const os = require('os');
const path = require('path')
const https = require('http')
//const https = require('https')

const argv = yargs
	.command('login', 'Ask for credentials to authenticate')
	.command('exec', 'Execute command', {
		template: {
			description: 'Template(s) to use to generate code.',
			alias: 't',
			demand: true
		},
		entity: {
			description: 'Entity to generate the code for.',
			alias: 'e',
			type: 'number',
			demand: true
		}
	})
	.demandCommand(1, 'At least one command is required, see usage for options.')
	.help()
	.argv;

const filename = path.join(os.tmpdir(), 'token');
//console.log(filename);

exports.main = function main() {

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

				if (res.statusCode == 200) {
					fs.writeFileSync(filename, d);
					console.log('Token saved');
				}
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

			if (!fs.existsSync(filename)) {
				console.log('No authentication token found, please use login command');
				process.exit(0);
			}

			const token = fs.readFileSync(filename);

			console.log('Token found');

			const data = JSON.stringify({
				EntityId: argv.entity,
				Templates: [{
					TemplateId: argv.template,
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


}


