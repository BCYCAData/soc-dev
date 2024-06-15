<script lang="ts">
	import { io } from 'socket.io-client';
	const socket = io();

	let username: string;
	let message = '';
	let messages: any[] = [];

	socket.on('name', (name) => {
		username = name;
	});

	socket.on('message', (msg) => {
		messages = [...messages, msg];
	});

	function sendMessage() {
		socket.emit('message', message);
		message = '';
	}
</script>

<main>
	<h1>Chat App</h1>
	<p>Your username is: {username}</p>

	<div class="messages">
		{#each messages as msg}
			<div class="message">
				<strong>{msg.from}:</strong>
				{msg.message}
				<span class="time">{msg.time}</span>
			</div>
		{/each}
	</div>

	<form on:submit|preventDefault={sendMessage}>
		<input type="text" bind:value={message} placeholder="Type your message..." />
		<button type="submit">Send</button>
	</form>
</main>

<style>
	/* Add your CSS styles here */
</style>
