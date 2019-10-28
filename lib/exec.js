const https = require('http')
//const https = require('https')

exports.executeCommand = function (token, template, entity) {

    const data = JSON.stringify({
        EntityId: entity,
        Templates: [{
            TemplateId: template,
            SubFolders: ''
        }]
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

            const result = JSON.parse(d.toString());

            console.log("--- output ---");
            console.log(result);
            console.log("--- output ---");
        })
    })

    req.on('error', error => {
        console.error(error);
    })

    req.write(data)
    req.end()
}