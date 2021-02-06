import json, asyncio

class connection:
	def __init__(self, host, port):
		self.host = host
		self.port = port
		self.event_loop = asyncio.get_event_loop()

	async def open(self):
		self.reader, self.writer = await asyncio.open_connection(self.host, self.port)

	def __enter__(self):		
		self.event_loop.run_until_complete(self.open())
		return self

	def __exit__(self, ev, et, tb):
		self.writer.close()

	async def process(self, code, returns=None, preset=None):
		msg = dict(
			code = code,
			preset = preset,
			returns = returns,
		)

		self.writer.write(bytes(json.dumps(msg), 'utf-8') + b'\n')
		await self.writer.drain()
		line = await self.reader.readline()		
		return json.loads(str(line, 'utf-8').rstrip('\n'))

	def __call__(self, code, returns=None, preset=None):
		return self.event_loop.run_until_complete(self.process(code, returns=returns, preset=preset))

