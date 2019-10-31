exports.getConfig = function (argv) {

    const url = argv.url || '';
    let urlParts = url.split(':')
    urlParts.shift();
    const phost = urlParts[0] || '';
 
    return {
        hostname: phost.slice(2) || 'localhost',
        port: urlParts[1] || 60000
    }
}
