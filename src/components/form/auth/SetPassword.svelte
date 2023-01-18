<script lang="ts">
	import AuthErrorMessage from '$components/error/AuthErrorMessage.svelte';

	export let oid: number;
	export let gid: number;

	let email = '';
	let strength = 0;
	let validations: boolean[] = [];
	let showPassword = false;

	$: password = '';
	$: confirmPassword = '';
	$: canGo = validEmail && strength === 5;
	$: validEmail = validateEmail(email);

	function validateEmail(email: string) {
		let emailRegEx =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegEx.test(String(email).toLowerCase());
	}

	function validatePassword(e: Event) {
		const passwordValue = (e.target as HTMLButtonElement).value;
		validations = [
			passwordValue.length > 8,
			passwordValue.search(/[A-Z]/) > -1,
			passwordValue.search(/[0-9]/) > -1,
			passwordValue.search(/[$&+,:;=?#^!]/) > -1,
			passwordValue === confirmPassword
		];
		strength = validations.reduce((acc, cur) => acc + +cur, 0);
	}

	function validateConfirmPassword(e: Event) {
		const passwordValue = (e.target as HTMLButtonElement).value;
		validations = [
			passwordValue.length > 8,
			passwordValue.search(/[A-Z]/) > -1,
			passwordValue.search(/[0-9]/) > -1,
			passwordValue.search(/[?~!@#%^&$&*()_+-=,:;|]/) > -1,
			passwordValue === password
		];
		strength = validations.reduce((acc, cur) => acc + +cur, 0);
	}

	function togglePassword(node: HTMLInputElement) {
		return {
			update(showPassword: boolean) {
				if (showPassword) {
					node.type = 'text';
				} else {
					node.type = 'password';
				}
			}
		};
	}
	let errorMessage = '';
</script>

<div class="mx-auto flex-1 flex flex-col items-center justify-center">
	<div class="rounded shadow-md text-gray-900 w-full">
		<div class="">
			Please enter your email address and a password to complete the registration process.
		</div>
		<form action="/api/auth/signup" method="POST">
			<input id="oid" type="hidden" name="oid" bind:value={oid} />
			<input id="gid" type="hidden" name="gid" bind:value={gid} />
			<label class="inline uppercase tracking-wide text-orange-600 text-xs font-bold" for="email">
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
			<label
				class="flex items-center justify-between uppercase tracking-wide text-orange-600 text-xs font-bold"
				for="password"
			>
				Password:
				<span
					class="text-xl text-gray-900 font-normal ml-3  align-middle "
					on:mouseenter={() => (showPassword = true)}
					on:mouseleave={() => (showPassword = false)}
				>
					{showPassword ? '👁️' : '👁️'}
				</span>
			</label>
			<input
				id="password"
				use:togglePassword
				type="password"
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="password"
				required={true}
				placeholder="New Password"
				autocomplete="new-password"
				on:input={(e) => validatePassword(e)}
				bind:value={password}
			/>
			<label
				class="flex items-center justify-between uppercase tracking-wide text-orange-600 text-xs font-bold"
				for="confirmPassword"
			>
				Confirm Password:
				<span
					class="text-xl text-gray-900 font-normal align-middle"
					on:mouseenter={() => (showPassword = true)}
					on:mouseleave={() => (showPassword = false)}
				>
					{showPassword ? '👁️' : '👁️'}
				</span>
			</label>

			<input
				id="confirmPassword"
				use:togglePassword
				type="password"
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="confirmPassword"
				required={true}
				placeholder="Confirm New Password"
				autocomplete="new-password"
				on:input={validateConfirmPassword}
				bind:value={confirmPassword}
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
