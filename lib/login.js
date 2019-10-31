const https = require('http')
//const https = require('https')
const fs = require('fs');

const os = require('os');
const path = require('path')

const filename = path.join(os.tmpdir(), 'token');
//console.log(filename);


exports.Login = function (cfg, username, password) {
    const data = JSON.stringify({
        Email: username,
        Password: password
    });

    const options = {
        hostname: cfg.hostname,
        port: cfg.port,
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

exports.getToken = function(){
    const token = fs.readFileSync(filename);
    return token;
}

exports.isAuthenticated = function(){
    if (!fs.existsSync(filename)) {
        return false;
    }
    return true;
}