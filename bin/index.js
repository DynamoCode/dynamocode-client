#! /usr/bin/env node

const reader = require("readline-sync");
const cmdline = require('../lib/cmdline')
const login = require('../lib/login')
const exec = require('../lib/exec')
const config = require('../lib/config')

const argv = cmdline.argv;
const cfg = config.getConfig(argv);

if (argv._.includes('login')) {

    const username = reader.question("Username: ");
    const password = reader.question("Password: ", { hideEchoBack: true });

    login.Login(cfg, username, password);
}
else
    if (argv._.includes('exec')) {
        console.log('exec command');

        if (!login.isAuthenticated()) {
            console.log('No authentication token found, please use login command');
            process.exit(0);
        }

        const token = login.getToken();
        exec.executeCommand(cfg, token, argv.template, argv.entity);
    }
    else {
        console.log('Unknown command: ', argv._);
    }

