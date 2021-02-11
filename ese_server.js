const net = require('net');
const vm = require('vm');
const fs = require('fs');
const server = net.createServer((c) => {


/*
	The context is created with the connection so a connection can be seen as a session.
	Successive evaluations will operate in the same context.
	Each json request is separated by newline.
*/

	console.log('client connected');
	var local_context = vm.createContext({
		console: console,
	});

	local_context.run = code => {
		var script = new vm.Script(code);
		script.runInContext(local_context);
	};

	local_context.eval_file = filename => {			
		var js = fs.readFileSync(filename, 'utf8');
		local_context.run(js);
	};


	var buf = '';


	c.on('error', (e) => {
		console.log('Error happened', e);

	});	
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

			var to_return;
			try {
				to_return = JSON.stringify({result: returns}) + '\n';				
			} catch (e) {
				console.error(e);
				to_return = JSON.stringify({error: e.message}) + '\n';
			}

			c.write(to_return);
		}	
	});
});

server.listen(9876, () => {
	console.log('server bound');
});