import node_evaluator_client, asyncio

#Examples and tests for node_evaluator_client

def test1():
	print('Synchronous test using context manager')
	with node_evaluator_client.connection('localhost', 9876) as test:
		print(test('''
			console.log("This mah console!"); 
			new_stuff = old_stuff + 123;
		''', 
		['new_stuff', 'old_stuff'],
		preset=dict(
			old_stuff = 1000,
		)))

def test2():
	print('Asynchronous test')
	async def run_test():
		connection = node_evaluator_client.connection('localhost', 9876)
		await connection.open()

		print(await connection.process('''
			console.log("This mah console!"); 
			new_stuff = old_stuff + 123;
		''', 
		['new_stuff', 'old_stuff'],
		preset=dict(
			old_stuff = 1000,
		)))

	asyncio.run(run_test())


test1()

print()
test2()
		
