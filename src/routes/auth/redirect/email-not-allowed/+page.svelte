<script lang="ts">
	import { PUBLIC_PRODUCTION_URL } from '$env/static/public';
</script>

<div class="restricted-container">
	<div class="content-box">
		<div class="header-section">
			<h1 class="title">Restricted Access</h1>
			<div class="message-container">
				<p class="primary-message">This application is currently under development.</p>
				<p class="primary-message">
					Unfortunately access is currently available by invitation only.
				</p>
				<div class="info-box">
					<p class="info-text">
						This development version is restricted to authorised users. If you need access:
					</p>
					<ul class="info-list">
						<li>Contact the project administrator and request an invitation</li>
						<li>Ensure you're using your authorised email address</li>
					</ul>
				</div>

				<p class="secondary-message">
					If you are looking to sign up to the Strengthen Our Community Project, please visit our
					main website.
				</p>
			</div>
		</div>

		<div class="action-container">
			<a href={PUBLIC_PRODUCTION_URL} class="action-button"> Continue to Public Site </a>

			<p class="help-text">
				If you believe this is an error or need assistance, please call Helen on 0424515963.
			</p>
		</div>
	</div>
</div>

<style lang="postcss">
	.restricted-container {
		@apply flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8;
	}

	.content-box {
		@apply w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg;
	}

	.header-section {
		@apply space-y-4;
	}

	.title {
		@apply mb-2 text-center text-3xl font-extrabold text-gray-900;
	}

	.message-container {
		@apply space-y-4 text-gray-600;
	}

	.primary-message {
		@apply text-center font-medium;
	}

	.info-box {
		@apply my-4 border-l-4 border-blue-500 bg-blue-50 p-4;
	}

	.info-text {
		@apply text-sm;
	}

	.info-list {
		@apply ml-5 mt-2 list-disc text-sm;
	}

	.secondary-message {
		@apply text-sm;
	}

	.action-container {
		@apply mt-8 flex flex-col items-center;
	}

	.action-button {
		@apply inline-block w-full cursor-pointer rounded-xl bg-secondary-500 p-3 text-center font-medium text-secondary-50 hover:bg-secondary-700 hover:underline;
	}

	.help-text {
		@apply mt-4 text-center text-xs text-gray-500;
	}
</style>
