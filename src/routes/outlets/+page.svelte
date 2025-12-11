<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { outletColumns, type Outlet } from './columns';
	import type { FormSchema } from '$lib/types/form-builder';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let { data } = $props();

	// Location data for comboboxes
	let provinces: any[] = $state([]);
	let cities: any[] = $state([]);
	let districts: any[] = $state([]);

	// Load provinces on mount
	onMount(async () => {
		try {
			const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
			provinces = await res.json();
		} catch (e) {
			console.error('Failed to load provinces:', e);
		}
	});

	// Handlers for cascading selection
	async function handleProvinceSelect(selectedProvince: string) {
		const prov = provinces.find((p) => p.name === selectedProvince);
		if (prov) {
			try {
				const res = await fetch(
					`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`
				);
				cities = await res.json();
			} catch (e) {
				console.error('Failed to load cities:', e);
			}
		}
	}

	async function handleCitySelect(selectedCity: string) {
		const cty = cities.find((c) => c.name === selectedCity);
		if (cty) {
			try {
				const res = await fetch(
					`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cty.id}.json`
				);
				districts = await res.json();
			} catch (e) {
				console.error('Failed to load districts:', e);
			}
		}
	}

	// Computed options for comboboxes
	const provinceOptions = $derived(provinces.map((p) => ({ value: p.name, label: p.name })));
	const cityOptions = $derived(cities.map((c) => ({ value: c.name, label: c.name })));
	const districtOptions = $derived(districts.map((d) => ({ value: d.name, label: d.name })));

	import { getOutletSchema } from '$lib/app/modules/outlet/forms/outlet.form';

	const outletSchema = $derived(
		getOutletSchema(
			provinceOptions,
			cityOptions,
			districtOptions,
			handleProvinceSelect,
			handleCitySelect
		)
	);

	// State management
	let visibleColumns = $state(
		outletColumns.reduce(
			(acc, col) => {
				const key = col.accessorKey || col.id;
				if (key && col.type !== 'select' && col.type !== 'actions') {
					acc[key] = true;
				}
				return acc;
			},
			{} as Record<string, boolean>
		)
	);

	let searchValue = $state('');
	let activeSearchTerm = $state('');
	let selectedRows = $state<Record<string, boolean>>({});

	let showCreate = $state(false);
	let showEdit = $state(false);
	let showDelete = $state(false);
	let editItem: Outlet | null = $state(null);
	let deleteItem: Outlet | null = $state(null);

	// Handlers
	function applySearch() {
		activeSearchTerm = searchValue;
	}

	function clearSearch() {
		searchValue = '';
		activeSearchTerm = '';
	}

	function toggleColumn(columnId: string) {
		visibleColumns = { ...visibleColumns, [columnId]: !visibleColumns[columnId] };
	}

	function exportCSV() {
		const headers = outletColumns
			.filter((col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions')
			.map((col) => col.label || col.accessorKey);

		const rows = data.outlets.map((outlet) =>
			outletColumns
				.filter((col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions')
				.map((col) => {
					const value = outlet[col.accessorKey!];
					return value != null ? String(value) : '';
				})
		);

		const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `outlets_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function handleEdit(item: Outlet) {
		// Convert latitude and longitude to string for the form
		editItem = {
			...item,
			latitude: item.latitude?.toString() as any,
			longitude: item.longitude?.toString() as any
		};
		showEdit = true;
	}

	function handleDelete(item: Outlet) {
		deleteItem = item;
		showDelete = true;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Outlets</h1>
			<p class="text-muted-foreground">Manage store outlets and locations</p>
		</div>
		<button
			class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			onclick={() => (showCreate = true)}
		>
			<Plus class="h-4 w-4" />
			Add Outlet
		</button>
	</div>

	<DataTableToolbar
		title="Filter Outlets"
		searchPlaceholder="Search outlets..."
		bind:searchValue
		onSearch={applySearch}
		onClear={clearSearch}
		bind:columns={visibleColumns}
		onToggleColumn={toggleColumn}
		onExportCSV={exportCSV}
	/>

	<DataTable
		data={data.outlets}
		columns={outletColumns}
		{visibleColumns}
		searchTerm={activeSearchTerm}
		bind:selectedRows
		deleteAction="?/delete"
		bulkDeleteAction="?/bulkDelete"
	>
		{#snippet actions(item)}
			<div class="flex gap-2">
				<Button size="icon" variant="ghost" onclick={() => handleEdit(item)} title="Edit">
					<SquarePen class="w-4 h-4" />
				</Button>
				<Button size="icon" variant="destructive" onclick={() => handleDelete(item)} title="Delete">
					<Trash2 class="w-4 h-4" />
				</Button>
			</div>
		{/snippet}
	</DataTable>

	<DataTableFormDialog
		bind:open={showCreate}
		mode="create"
		schema={outletSchema}
		action="?/create"
		title="Create Outlet"
	/>

	{#if showEdit && editItem}
		<DataTableFormDialog
			bind:open={showEdit}
			mode="edit"
			data={editItem}
			schema={outletSchema}
			action="?/update"
			title="Edit Outlet"
		/>
	{/if}

	{#if showDelete && deleteItem}
		<DeleteDialog
			bind:open={showDelete}
			id={deleteItem.id}
			resourceName={deleteItem.name}
			title="Delete Outlet"
			description="Are you sure you want to delete this outlet?"
			action="?/delete"
		/>
	{/if}
</div>
