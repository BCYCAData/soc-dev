<script lang="ts">
	import AuthErrorMessage from '$components/error/AuthErrorMessage.svelte';

	import type { AddressPointData } from '$lib/types';

	export let addressPointData: AddressPointData;

	let email = '';
	let strength = 0;
	let validations: boolean[] = [];
	let showPassword = false;

	$: inputType = showPassword ? 'text' : 'password';
	$: searchaddress = `${addressPointData.searchstreet} ${addressPointData.searchsuburb}`;
	$: password = '';
	$: confirmPassword = '';
	$: canGo = validEmail && strength === 5;
	$: validEmail = validateEmail(email);
	$: addresspoint = JSON.stringify(addressPointData.addresspoint);
	$: addressmetadata = `${addressPointData.searchstreet};
		${addressPointData.searchsuburb};
		${addressPointData.postcode}`;

	function validateEmail(email: string) {
		let emailRegEx =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegEx.test(String(email).toLowerCase());
	}

	function validatePassword(e: Event) {
		password = (e.target as HTMLButtonElement).value;
		validations = [
			password.length > 8,
			password.search(/[A-Z]/) > -1,
			password.search(/[0-9]/) > -1,
			password.search(/[$&+,:;=?#^!]/) > -1,
			password === confirmPassword
		];
		strength = validations.reduce((acc, cur) => acc + +cur, 0);
	}

	function validateConfirmPassword(e: Event) {
		confirmPassword = (e.target as HTMLButtonElement).value;
		validations = [
			confirmPassword.length > 8,
			confirmPassword.search(/[A-Z]/) > -1,
			confirmPassword.search(/[0-9]/) > -1,
			confirmPassword.search(/[?~!@#%^&$&*()_+-=,:;|]/) > -1,
			confirmPassword === password
		];
		strength = validations.reduce((acc, cur) => acc + +cur, 0);
	}
	let errorMessage = '';
</script>

<div class="bg-green-100 rounded-lg">
	<p class="font-semibold text-center text-lg">
		{searchaddress}
	</p>
	{#if searchaddress.replace(',', '') !== addressPointData.validaddress}
		<p class="text-center">( {addressPointData.validaddress} )</p>
	{/if}
	<p class="text-center">
		is part of the
		<span class="font-semibold">{addressPointData.communityname}</span>
		community.
	</p>
</div>
<div class="px-3 flex-1 flex flex-col items-center justify-center">
	<div class="px-3 rounded shadow-md text-gray-900 w-full">
		<div class="text-center mx-4">
			Please enter your email address and a password to complete the registration process.
		</div>
		<form action="/api/auth/signup" method="POST">
			<!-- <form action="?/api/auth/signup" method="POST"> -->
			<input
				id="oid"
				type="hidden"
				name="principaladdresssiteoid"
				bind:value={addressPointData.principaladdresssiteoid}
			/>
			<input id="addresspoint" type="hidden" name="addresspoint" bind:value={addresspoint} />
			<input
				id="addressmetadata"
				type="hidden"
				name="addressmetadata"
				bind:value={addressmetadata}
			/>
			<label class="inline uppercase tracking-wide text-orange-900 text-xs font-bold" for="email">
				Email:
			</label>
			<input
				id="email"
				type="email"
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="email"
				required={true}
				placeholder="Email"
				autocomplete="email"
				bind:value={email}
			/>
			<div class="flex justify-between">
				<label class="uppercase text-orange-900 text-xs pt-2 font-bold" for="password">
					Password:
				</label>

				<span
					class="text-xl text-gray-900 font-normal mr-3"
					on:mouseenter={() => (showPassword = true)}
					on:mouseleave={() => (showPassword = false)}
				>
					{showPassword ? '👁️' : '👁️'}
				</span>
			</div>
			<input
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				id="password"
				type={inputType}
				name="password"
				required={true}
				placeholder="New Password"
				autocomplete="new-password"
				on:input={validatePassword}
				value={password}
			/>
			<div class="flex justify-between">
				<label
					class="inline uppercase tracking-wide text-orange-900 text-xs font-bold"
					for="confirmPassword"
				>
					Confirm Password:
				</label>
				<span
					class="text-xl text-gray-900 font-normal mr-3"
					on:mouseenter={() => (showPassword = true)}
					on:mouseleave={() => (showPassword = false)}
				>
					{showPassword ? '👁️' : '👁️'}
				</span>
			</div>
			<input
				id="confirmPassword"
				type={inputType}
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="confirmPassword"
				required={true}
				placeholder="Confirm New Password"
				autocomplete="new-password"
				on:input={validateConfirmPassword}
				value={confirmPassword}
			/>

			<div class="flex w-full h-5 bg-gray-50">
				<span class="bar bar-1" class:bar-show={strength > 0} />
				<span class="bar bar-2" class:bar-show={strength > 1} />
				<span class="bar bar-3" class:bar-show={strength > 2} />
				<span class="bar bar-4" class:bar-show={strength > 3} />
			</div>

			<ul class="list-none text-left pl-1 mt-2">
				Your password must have:
				<li class="pl-4">
					<span class="text-[10px]">{validations[0] ? '✔️' : '❌'}</span>
					<span>at least 8 characters</span>
				</li>
				<li class="pl-4">
					<span class="text-[10px]">{validations[1] ? '✔️' : '❌'}</span>
					<span>at least 1 capital letter</span>
				</li>
				<li class="pl-4">
					<span class="text-[10px]">{validations[2] ? '✔️' : '❌'}</span>
					<span>at least 1 number</span>
				</li>
				<li class="pl-4">
					<span class="text-[10px]">{validations[3] ? '✔️' : '❌'}</span>
					<span>at least 1 symbol (?~!@#%^&$&*()_+-=,:;|)</span>
				</li>
				<li class="pl-4">
					<span class="text-[10px]">{validations[4] ? '✔️' : '❌'}</span>
					<span>matching passwords</span>
				</li>
			</ul>
			{#if errorMessage !== ''}
				<AuthErrorMessage message={errorMessage} />
			{/if}
			<button
				type="submit"
				class="w-full text-center rounded-full p-2 mt-2 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Create Account
			</button>
		</form>
		<div class="text-center text-gray-900">
			By signing up, you agree to the
			<a class="no-underline text-orange-600" href="/policies/termsofservice">Terms of Service</a>
			and
			<a class="no-underline text-orange-600" href="/policies/privacy">Privacy Policy</a>
		</div>
	</div>

	<div class="text-lg text-gray-900">
		Already have an Account?
		<a class="no-underline text-blue" href="../auth/signin/">Sign in</a>
	</div>
</div>

<style>
	/* .strength {
		display: flex;
		height: 15px;
		width: 100%;
	} */
	.bar {
		margin-right: 2px;
		margin-top: 4px;
		margin-bottom: 4px;
		border-radius: 5px;
		height: 90%;
		width: 25%;
		transition: box-shadow 500ms;
		box-shadow: inset 0px 20px #e7e5e4;
	}
	.bar-show {
		box-shadow: none;
	}
	.bar-1 {
		background: linear-gradient(to right, red, orangered);
	}
	.bar-2 {
		background: linear-gradient(to right, orangered, yellow);
	}
	.bar-3 {
		background: linear-gradient(to right, yellow, yellowgreen);
	}
	.bar-4 {
		background: linear-gradient(to right, yellowgreen, green);
	}
	.bar:last-child {
		margin-right: 0;
	}
</style>
