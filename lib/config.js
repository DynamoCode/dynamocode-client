exports.getConfig = function (argv) {

    const url = argv.url || '';
    let urlParts = url.split(':')
    const protocol = urlParts[0] || 'https';
    const phost = urlParts[1] || '';

    return {
        protocol: protocol,
        hostname: phost.slice(2) || 'www.dynamocode.com',
        port: urlParts[2] || (protocol == 'https' ? 443: 80)
    }
}
