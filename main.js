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
// GET
app.get('/list', function(req, res) {
	names = new Array();
	
	console.log('hypervisor.getActiveDomains(): ' + hypervisor.getActiveDomains());
	for (ad in hypervisor.getActiveDomains()) {
		domain = hypervisor.lookupDomainById(hypervisor.getActiveDomains()[ad]);
		names[names.length] = { 
			uuid : domain.getUUID(), 
			name : domain.getName(), 
			online: true };
	}

	console.log('hypervisor.getDefinedDomains(): ' + hypervisor.getDefinedDomains());
	for (dd in hypervisor.getDefinedDomains()) {
		domain = hypervisor.lookupDomainByName(hypervisor.getDefinedDomains()[dd]);
		names[names.length] = { 
			uuid : domain.getUUID(),
			name : domain.getName(),
			online: false };
	}
	res.send(names);
});
app.get('/list/:uuid', function(req, res) {
	domain = hypervisor.lookupDomainByUUID(parseInt(req.params.uuid));
	domainInfo = domain.getInfo();
	domainInfo.name = domain.getName();
	
	if (domainInfo != null)
		res.send(domainInfo);
});
app.get('*', function(req, res){
	res.send('what???', 404);
});

// PUT
app.put('/domain/:uuid/reboot', function(req, res) {
	console.log('req.params.uuid: ' + req.params.uuid);

	domain = hypervisor.lookupDomainByUUID(req.params.uuid);
	res.send(domain.reboot());
});

app.listen(conf.port);
