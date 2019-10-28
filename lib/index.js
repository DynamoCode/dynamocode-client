const reader = require("readline-sync");
const cmdline = require('./cmdline')
const login = require('./login')
const exec = require('./exec')

const argv = cmdline.argv;

exports.main = function main() {

    if (argv._.includes('login')) {

        const username = reader.question("Username: ");
        const password = reader.question("Password: ", { hideEchoBack: true });

        login.Login(username, password);
    }
    else
        if (argv._.includes('exec')) {
            console.log('exec command');

            if (!login.isAuthenticated()) {
                console.log('No authentication token found, please use login command');
                process.exit(0);
            }

            const token = login.getToken();
            exec.executeCommand(token, argv.template, argv.entity);
        }
        else {
            console.log('Unknown command: ', argv._);
        }
}
