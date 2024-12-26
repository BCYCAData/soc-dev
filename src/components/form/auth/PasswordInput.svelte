<script lang="ts">
    export let id: string;
    export let label: string;
    export let showPassword: boolean;
    export let password: string;
</script>

<div class="flex justify-between">
    <label class="pt-2 text-xs font-bold uppercase text-orange-900" for={id}>
        {label}
    </label>
    <button
        type="button"
        class="text-scale-6 mr-3 font-normal text-surface-950"
        on:mouseenter={() => showPassword = true}
        on:mouseleave={() => showPassword = false}
    >
        {showPassword ? '👁️' : '👁️'}
    </button>
</div>

<input
    {id}
    class="form-input mb-4 w-full rounded !border !border-secondary-700 py-3"
    type={showPassword ? 'text' : 'password'}
    name={id}
    required
    placeholder={label}
    autocomplete="new-password"
    value={password}
    on:input
/>
