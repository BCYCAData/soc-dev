<script lang="ts">
	import { PUBLIC_PRODUCTION_URL } from '$env/static/public';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
		<div class="space-y-4">
			<h1 class="mb-2 text-center text-3xl font-extrabold text-gray-900">Restricted Access</h1>
			<div class="space-y-4 text-gray-600">
				<p class="text-center font-medium">This application is currently under development.</p>
				<p class="text-center font-medium">
					Unfortunately access is currently available by invitation only.
				</p>
				<div class="my-4 border-l-4 border-blue-500 bg-blue-50 p-4">
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
			<a href={PUBLIC_PRODUCTION_URL} class="mt-4 text-center text-xs text-gray-500">
				Continue to Public Site
			</a>

			<p class="mt-4 text-center text-xs text-gray-500">
				If you believe this is an error or need assistance, please call Helen on 0424515963.
			</p>
		</div>
	</div>
</div>
