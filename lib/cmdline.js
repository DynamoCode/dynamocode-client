const yargs = require('yargs');

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
    .option('url', {
        type: 'string'
    })
    .demandCommand(1, 'At least one command is required, see usage for options.')
    .help()
    .argv;

exports.argv = argv;