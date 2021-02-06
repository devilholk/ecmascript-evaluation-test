const net = require('net');
const vm = require('vm');
const server = net.createServer((c) => {

/*
	The context is created with the connection so a connection can be seen as a session.
	Successive evaluations will operate in the same context.
	Each json request is separated by newline.
*/

	console.log('client connected');
	var local_context = vm.createContext({console: console});
	var buf = '';

	c.on('end', () => {
		console.log('client disconnected');

	});	
	c.on('data', (data) => {
		var nl = data.indexOf('\n');
		if (nl == -1) {
			buf += data;
		} else {
			var line = buf + data.slice(0, nl);
			buf = data.slice(nl+1)
			
			var request = JSON.parse(line);

			if (request.preset) {
				for (const key in request.preset) {
					local_context[key] = request.preset[key];
				}
			}

			if (request.code) {

				try {
					var script = new vm.Script(request.code);
					script.runInContext(local_context);
				} catch (e) {
					console.error(e);
					c.write(JSON.stringify({error: e.message}) + '\n');
					return;
				}
			}

			var returns = {};
			if (request.returns) {
				for (const key of request.returns) {
					returns[key] = local_context[key];
				}
			}

			c.write(JSON.stringify({result: returns}) + '\n');
		}	
	});
});

server.listen(9876, () => {
	console.log('server bound');
});