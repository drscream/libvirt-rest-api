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

// libVirt connection
var hypervisor = new Hypervisor(conf.uri);
var domain;

// server
app.get('/list', function(req, res) {
	names = new Array();
	for (ad in hypervisor.getActiveDomains()) {
		name = hypervisor.lookupDomainById(hypervisor.getActiveDomains()[ad]).getName();
		names[names.length] = { id : hypervisor.getActiveDomains()[ad], name : name, online: true };
	}
	for (dd in hypervisor.getDefinedDomains()) {
		name = hypervisor.lookupDomainById(hypervisor.getDefinedDomains()[dd]).getName();
		names[names.length] = { id : hypervisor.getActiveDomains()[dd], name : name, online: false };
	}
	res.send(names);
});
app.get('/list/:id', function(req, res) {
	domain = hypervisor.lookupDomainById(parseInt(req.params.id));
	domainInfo = domain.getInfo();
	domainInfo.name = domain.getName();
	
	if (domainInfo != null)
		res.send(domainInfo);
});

app.listen(conf.port);
