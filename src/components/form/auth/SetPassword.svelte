<script lang="ts">
	export let validPassword: boolean;

	let strength = 0;
	let validations: boolean[] = [];
	let showPassword = false;

	$: inputType = showPassword ? 'text' : 'password';
	$: password = '';
	$: confirmPassword = '';
	$: validPassword = strength === 5;

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
</script>

<div class="px-3 flex-1 flex flex-col items-center justify-center">
	<div class="px-3 rounded shadow-md text-gray-900 w-full">
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
			<label class="inline uppercase text-orange-900 text-xs font-bold" for="confirmPassword">
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
	</div>
</div>

<style>
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
