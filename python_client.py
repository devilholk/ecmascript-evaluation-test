import json, asyncio

test1 = dict(
	code = '''
		console.log("This mah console!"); 
		new_stuff = old_stuff + 123;''',
	preset = dict(
		old_stuff = 444,
	),
	returns = [
		'new_stuff',
	]
)

test2 = dict(	
	returns = [
		'old_stuff',
	]
)
 

async def js_eval(writer, reader, msg):

	writer.write(bytes(json.dumps(msg), 'utf-8') + b'\n')
	await writer.drain()
	line = await reader.readline()
		
	return json.loads(str(line, 'utf-8').rstrip('\n'))


async def run_test():
    reader, writer = await asyncio.open_connection('localhost', 9876)

    print(await js_eval(writer, reader, test1))
    print(await js_eval(writer, reader, test2))


asyncio.run(run_test())