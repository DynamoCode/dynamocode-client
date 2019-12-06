const https = require('https')
const fs = require('fs');
const path = require('path')
const process = require('process');

exports.executeCommand = function (cfg, token, template, entity) {

    let templateIds = template.toString().split(',');
    let templateList = [];
    templateIds.forEach(id => {
        templateList.push({
            TemplateId: id,
            SubFolders: ''
        })
    });
    const data = JSON.stringify({
        EntityId: entity,
        Templates: templateList
    });

    const options = {
        hostname: cfg.hostname,
        port: cfg.port,
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
            //console.log('exec request successful');
        } else {
            console.log('Something went wrong while connecting with our servers. Please try again.');
        }

        res.on('data', d => {

            const result = JSON.parse(d.toString());

            //console.log("--- output ---");
            //console.log(result);
            result.forEach(element => {
                //console.log(element.fileName);
                //console.log(element.textCode);
                //console.log(element.folderList.join(path.sep));

                let joinedFolders = element.folderList.join(path.sep);
                let directory = path.join(process.cwd(), joinedFolders);
                let fileName = path.join(directory, element.fileName);

                fs.mkdirSync(directory, { recursive: true });
                fs.writeFileSync(fileName, element.textCode);
                console.log('Created file: ', fileName);
            });

            //console.log("--- output ---");
        })
    })

    req.on('error', error => {
        console.error(error);
    })

    req.write(data)
    req.end()
}