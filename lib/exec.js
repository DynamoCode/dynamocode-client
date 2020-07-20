const https = require('https')
const fs = require('fs');
const path = require('path')
const process = require('process');
const readline = require('readline');
const os = require("os");

async function updateFileContent(filepath, mark, text) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath),
        crlfDelay: Infinity
    });

    let updatedContent = [];

    for await (const line of rl) {
        if (line.indexOf(mark) > -1) {
            updatedContent.push(text);
            updatedContent.push('');
        }
        updatedContent.push(line);
    }
    let newContent = updatedContent.join(os.EOL);

    fs.writeFileSync(filepath, newContent);
}

exports.executeCommand = function (cfg, token, template, entity) {

    let templateIds = template.toString().split(',');
    let templateList = [];
    templateIds.forEach(idItem => {
        let idParts = idItem.split(':');
        templateList.push({
            TemplateId: idParts[0],
            FilePath: idParts[1] || ''
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
    let warnings = [];

    const req = https.request(options, res => {

        if (res.statusCode == 200) {
            //console.log('exec request successful');
        } else {
            console.log('Something went wrong while connecting with our servers. Please try again.');
        }

        res.on('data', d => {

            const result = JSON.parse(d.toString());

            //console.log("--- output ---");
            // console.log(result);

            result.forEach(element => {
                //console.log(element.fileName);
                //console.log(element.textCode);
                //console.log(element.folderList.join(path.sep));
                let directory,fileName;
                
                try {
                    let joinedFolders = element.folderList.join(path.sep);
                    directory = path.join(process.cwd(), joinedFolders);

                    if (!fs.existsSync(directory)) {
                        fs.mkdirSync(directory, { recursive: true });
                    }
                } catch (error) {
                    console.log("Error: Could not create directory", directory);
                    console.log(error);
                    return;
                }

                try {
                    fileName = path.join(directory, element.fileName);

                    // TODO: pending revision if we need to check also for 0
                    if (element.action == 0 || element.action == 1) {
                        fs.writeFileSync(fileName, element.textCode);
                        console.log('Info: Created file:', fileName);
                    }

                    if (element.action == 2) {
                        if (!fs.existsSync(fileName)){
                            warnings.push('Warning: file not found: ' + fileName)
                            return
                        }
                        
                        let mark = element.templateName + ' DynamoCode Template';
                        updateFileContent(fileName, mark, element.textCode);
                        console.log('Info: Updated file:', fileName);
                    }

                    if (element.action == 3) {
                        if (!fs.existsSync(fileName)){
                            warnings.push('Warning: file not found: ' + fileName)
                            return
                        }

                        fs.appendFileSync(fileName, element.textCode);
                        console.log('Info: Appended file:', fileName);
                    }

                } catch (error) {
                    console.log("Error: Could not execute the action on", fileName);
                    console.log(error);
                    return
                }

            });
            
            if (warnings.length > 0){
                console.log("Executed with Warnings.");
                warnings.forEach(element => {
                    console.log(element);
                });
            }
            //console.log("--- output ---");
        })
    })

    req.on('error', error => {
        console.error(error);
    })

    req.write(data)
    req.end()
}