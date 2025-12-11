<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Settings2, Download, X } from '@lucide/svelte';

	let {
		title = 'Data Management',
		searchPlaceholder = 'Search...',
		searchValue = $bindable(''),
		columns = $bindable({}),
		onSearch,
		onClear,
		onExportCSV,
		onExportXLSX,
		onToggleColumn
	}: {
		title?: string;
		searchPlaceholder?: string;
		searchValue: string;
		columns: Record<string, boolean>;
		onSearch?: () => void;
		onClear?: () => void;
		onExportCSV?: () => void;
		onExportXLSX?: () => void;
		onToggleColumn?: (col: string) => void;
	} = $props();

	const columnKeys = $derived(Object.keys(columns));
</script>

<div class="flex items-center justify-between mb-4">
	<div class="flex items-center gap-2 flex-1">
		<div class="relative w-full max-w-sm">
			<Input
				type="text"
				placeholder={searchPlaceholder}
				bind:value={searchValue}
				class="pr-10"
				onkeydown={(e) => e.key === 'Enter' && onSearch?.()}
			/>
		</div>
		<Button variant="secondary" onclick={onSearch}>Search</Button>
		{#if searchValue}
			<Button
				variant="ghost"
				onclick={() => {
					searchValue = '';
					onClear?.();
				}}
			>
				Clear
				<X class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		{#if onExportCSV || onExportXLSX}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" size="sm" class="h-8 border-dashed">
						<Download class="mr-2 h-4 w-4" />
						Export
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#if onExportCSV}
						<DropdownMenu.Item onclick={onExportCSV}>Export CSV</DropdownMenu.Item>
					{/if}
					{#if onExportXLSX}
						<DropdownMenu.Item onclick={onExportXLSX}>Export Excel</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outline" size="sm" class="h-8 border-dashed">
					<Settings2 class="mr-2 h-4 w-4" />
					View
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-[150px]">
				<DropdownMenu.Label>Show columns</DropdownMenu.Label>
				<DropdownMenu.Separator />
				{#each columnKeys as key}
					<DropdownMenu.CheckboxItem
						checked={columns[key]}
						onCheckedChange={() => onToggleColumn?.(key)}
					>
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
