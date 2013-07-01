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

	var events = 'up,down,authed,activation,invalidToken,reconnecting,updating';

	events.split(',').forEach(function(event) {
		app.on('client::' + event, function() {
			self.log.info('Got new state event', event);
		});
	});

}

util.inherits(platform, stream);

module.exports = platform;
