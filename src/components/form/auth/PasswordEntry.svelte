<script lang="ts">
	export let redirectType: string;

	let heading = '';
	let submitText = '';

	let strength = 0;
	let validations: boolean[] = [];
	let showPassword = false;

	$: inputType = showPassword ? 'text' : 'password';
	$: password = '';
	$: confirmPassword = '';
	$: canGo = strength === 5;

	if (redirectType == 'invite') {
		heading = 'Thank you for accepting our invitation.';
		submitText = 'Create my password now!';
	} else if (redirectType == 'recovery') {
		heading = 'Please enter your new password.';
		submitText = 'Set New Password';
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
</script>

<div class="flex flex-col items-center  max-w-container mx-auto justify-center">
	<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="text-2xl text-center">{redirectType}</h1>
		<label class="inline uppercase text-orange-900 text-xs font-bold" for="password">
			Password:
			<span
				class="toggle-password text-2xl text-gray-900 font-normal ml-3  align-middle "
				on:mouseenter={() => (showPassword = true)}
				on:mouseleave={() => (showPassword = false)}
			>
				{showPassword ? '👁️' : '👁️'}
			</span>
		</label>
		<input
			id="password"
			type={inputType}
			class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
			name="password"
			required={true}
			placeholder="New Password"
			autocomplete="new-password"
			on:input={validatePassword}
			value={password}
		/>
		<label class="inline uppercase text-orange-900 text-xs font-bold" for="confirmPassword">
			Confirm Password:
			<span
				class="toggle-password text-3xl text-gray-900 font-normal ml-3  align-middle "
				on:mouseenter={() => (showPassword = true)}
				on:mouseleave={() => (showPassword = false)}
			>
				{showPassword ? '👁️' : '👁️'}
			</span>
		</label>
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
		<div class="strength">
			<span class="bar bar-1" class:bar-show={strength > 0} />
			<span class="bar bar-2" class:bar-show={strength > 1} />
			<span class="bar bar-3" class:bar-show={strength > 2} />
			<span class="bar bar-4" class:bar-show={strength > 3} />
		</div>
		<ul class="list-none text-left pl-1">
			Must have:
			<li class="pl-4">
				<span class="text-[10px]">{validations[0] ? '✔️' : '❌'}</span>
				<span class="text-sm">at least 8 characters</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[1] ? '✔️' : '❌'}</span>
				<span class="text-sm">at least 1 capital letter</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[2] ? '✔️' : '❌'}</span>
				<span class="text-sm">at least 1 number</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[3] ? '✔️' : '❌'}</span>
				<span class="text-sm">at least 1 symbol (?~!@#%^&$&*()_+-=,:;|)</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[4] ? '✔️' : '❌'}</span>
				<span class="text-sm">matching passwords</span>
			</li>
		</ul>
	</div>
</div>

<style>
	.strength {
		display: flex;
		height: 15px;
		width: 100%;
	}
	.bar {
		margin-right: 2px;
		border-radius: 5px;
		height: 100%;
		width: 25%;
		transition: box-shadow 500ms;
		box-shadow: inset 0px 20px #f2f1f1;
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
