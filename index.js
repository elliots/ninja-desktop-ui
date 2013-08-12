/**
 * Ninja Blocks desktop UI connectivity driver
 */

var util = require('util');
var path = require('path');
var net = require('net');
var stream = require('stream');

function platform(opts, app, version) {
   var self = this;

    this.log = app.log;

    var lastState = 'down';

    var events = 'up,down,authed,activation,invalidToken,reconnecting,updating';

    function connect() {
        console.log('Attempting connection to watchdog');
        self.socket = net.connect({
            port:'21295',
            keepAlive: true
        });
        self.socket.on('error', function() {
            console.log('Failed to connect to desktop process, waiting.');
            setTimeout(connect, 1000);
        });
        self.socket.on('connect', function() {
            self.log.info('Connected to desktop UI');
            sendState();
        });

    }

    connect();

    function sendState() {
        self.log.debug('Sending state ' + lastState + ' to desktop UI.');
        self.socket.write(lastState);
        self.log.debug('State sent.');
    }

    events.split(',').forEach(function(event) {
        app.on('client::' + event, function() {
            self.log.info('State event', event);
            lastState = event+'';
            sendState();
        });
    });

}

util.inherits(platform, stream);

module.exports = platform;
