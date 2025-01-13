<script lang="ts">
	interface MatchCodes {
		streetNumber1: string;
		streetNumber2?: string | null;
		streetName: string;
		streetType: string;
		localityName: string;
		stateTerritory: string;
	}

	interface Props {
		matchType: string;
		matchQuality: string;
		matchScore: number;
		matchcodes: MatchCodes;
	}

	let { matchType, matchQuality, matchScore, matchcodes }: Props = $props();

	const baseOrderedKeys = [
		'streetNumber1',
		'streetName',
		'streetType',
		'localityName',
		'stateTerritory'
	] as const;

	type OrderedKey = (typeof baseOrderedKeys)[number] | 'streetNumber2';

	const orderedKeys = matchcodes.streetNumber2
		? ([
				...baseOrderedKeys.slice(0, 1),
				'streetNumber2',
				...baseOrderedKeys.slice(1)
			] as OrderedKey[])
		: baseOrderedKeys;

	function getBackgroundColor(value: string | null | undefined): string {
		if (!value) return 'bg-warning-100';

		switch (value) {
			case 'exact':
				return 'bg-success-100';
			case 'no':
				return 'bg-error-100';
			default:
				return 'bg-warning-100';
		}
	}

	function getMatchTypeBackground(value: string): string {
		return ['Primary Address', 'Secondary Address'].includes(value)
			? 'bg-success-100'
			: 'bg-error-100';
	}

	function getMatchQualityBackground(value: string): string {
		if (['Exact', 'Confident'].includes(value)) return 'bg-success-100';
		if (value === 'Good') return 'bg-warning-100';
		return 'bg-error-100';
	}

	function getMatchScoreBackground(value: number): string {
		return value > 89 ? 'bg-success-100' : 'bg-error-100';
	}

	const displayLabels: Record<OrderedKey, string> = {
		streetNumber1: 'Street Number',
		streetNumber2: 'To Street Number',
		streetName: 'Street Name',
		streetType: 'Street Type',
		localityName: 'Locality',
		stateTerritory: 'State'
	};
</script>

<div class="flex flex-col items-end">
	<div class="flex w-full flex-col items-end">
		<div class="flex flex-col" style="width: fit-content">
			<h3 class="mb-2 text-xs font-semibold">Match Quality</h3>
			<div class="inline-grid grid-cols-[min-content_min-content] gap-x-2">
				<div class="whitespace-nowrap border-b bg-slate-100 py-1 pl-3 text-xs font-medium">
					Type:
				</div>
				<div class="flex items-center whitespace-nowrap {getMatchTypeBackground(matchType)}">
					<span class="px-2 text-xs text-gray-600">{matchType}</span>
				</div>

				<div class="whitespace-nowrap border-b bg-slate-100 py-1 pl-3 text-xs font-medium">
					Quality:
				</div>
				<div class="flex items-center whitespace-nowrap {getMatchQualityBackground(matchQuality)}">
					<span class="px-2 text-xs text-gray-600">{matchQuality}</span>
				</div>

				<div class="whitespace-nowrap border-b bg-slate-100 py-1 pl-3 text-xs font-medium">
					Score:
				</div>
				<div class="flex items-center whitespace-nowrap {getMatchScoreBackground(matchScore)}">
					<span class="px-2 text-xs text-gray-600">{matchScore}</span>
				</div>
			</div>

			<div class="mt-1 text-xs font-medium">Match Codes</div>

			<div class="inline-grid grid-cols-[min-content_min-content] gap-x-2">
				{#each orderedKeys as key}
					<div class="whitespace-nowrap border-b bg-slate-100 py-1 pl-3 text-xs font-medium">
						{displayLabels[key]}
					</div>
					<div class="flex items-center whitespace-nowrap {getBackgroundColor(matchcodes[key])}">
						<span class="px-2 text-xs text-gray-600">{matchcodes[key]}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
