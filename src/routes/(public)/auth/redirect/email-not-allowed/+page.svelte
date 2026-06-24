<script lang="ts">
	import { PUBLIC_PRODUCTION_URL } from '$env/static/public';
</script>

<div
	class="bg-surface-100-900 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="bg-surface-50-950 w-full max-w-md space-y-8 rounded-xl p-8 shadow-lg">
		<div class="space-y-4">
			<h1 class="text-surface-900-100 mb-2 text-center text-3xl font-extrabold">Restricted Access</h1>
			<div class="text-surface-600-300 space-y-4">
				<p class="text-center font-medium">This application is currently under development.</p>
				<p class="text-center font-medium">
					Unfortunately access is currently available by invitation only.
				</p>
				<div class="border-tertiary-500 bg-tertiary-50-950 my-4 border-l-4 p-4">
					<p class="text-sm">
						This development version is restricted to authorised users. If you need access:
					</p>
					<ul class="mt-2 ml-5 list-disc text-sm">
						<li>Contact the project administrator and request an invitation</li>
						<li>Ensure you're using your authorised email address</li>
					</ul>
				</div>

				<p class="text-sm">
					If you are looking to sign up to the Strengthen Our Community Project, please visit our
					main website.
				</p>
			</div>
		</div>

		<div class="mt-8 flex flex-col items-center">
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a href={PUBLIC_PRODUCTION_URL} class="text-surface-600-400 mt-4 text-center text-xs">
				Continue to Public Site
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->

			<p class="text-surface-600-400 mt-4 text-center text-xs">
				If you believe this is an error or need assistance, please call Helen on 0424515963.
			</p>
		</div>
	</div>
</div>
