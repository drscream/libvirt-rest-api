/*
 * the main file which starts the webserver and setup the connection
 * to libVirt.
 */

// variables
var
	conf = require(__dirname + '/config.js'),
	libvirt = require('libvirt'),
	app = require('express').createServer(),
	Hypervisor = libvirt.Hypervisor,
	Domain = libvirt.Domain
	;

// default values
conf.port = conf.port || 8080;
conf.uri = conf.uri || 'qemu:///system';

// server
app.get('/', function(req, res){
	res.send('hello world');
});

app.listen(conf.port);
