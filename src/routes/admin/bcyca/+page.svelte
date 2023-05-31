<script lang="ts">
	// export let data;

	// $: ({ bcycaAdminData } = data);
	async function sendMailchimpEmail() {
		try {
			const response = await fetch('/api/emails/mailchimp', {
				method: 'GET'
			});
			// Handle response from server here
		} catch (err) {
			console.error('Error', err);
		}
	}
</script>

<svelte:head>
	<title>BCYCA Administration</title>
</svelte:head>
<div>
	<h1>This will probably contain information about how to use the contained pages</h1>

	<form on:submit|preventDefault={sendMailchimpEmail}>
		<button
			type="submit"
			class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none"
		>
			Send Email to Selected
		</button>
	</form>
</div>
