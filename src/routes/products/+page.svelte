<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { productColumns, type Product } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import type { FormSchema } from '$lib/types/form-builder';

	let { data } = $props();

	// Form Configuration
	// Form Configuration
	import { getProductSchema } from '$lib/app/modules/product/forms/product.form';

	const productSchema = $derived(
		getProductSchema(data.categories.map((cat) => ({ value: cat.id, label: cat.name })))
	);

	// State management
	let visibleColumns = $state(
		productColumns.reduce(
			(acc, col) => {
				const key = col.accessorKey || col.id;
				if (key && col.type !== 'select' && col.type !== 'actions') {
					acc[key] = !col.hidden;
				}
				return acc;
			},
			{} as Record<string, boolean>
		)
	);

	let searchValue = $state('');
	let activeSearchTerm = $state('');
	let selectedRows = $state<Record<string, boolean>>({});
	let sortColumn = $state('name');
	let sortOrder = $state<'asc' | 'desc'>('asc');

	let showCreate = $state(false);
	let editItem = $state<Product | null>(null);
	let deleteItem = $state<Product | null>(null);
	let showEdit = $state(false);
	let showDelete = $state(false);

	// Handlers
	function openEdit(item: Product) {
		editItem = item;
		showEdit = true;
	}

	function openDelete(item: Product) {
		deleteItem = item;
		showDelete = true;
	}

	function applySearch() {
		activeSearchTerm = searchValue;
	}

	function clearSearch() {
		searchValue = '';
		activeSearchTerm = '';
	}

	function toggleColumn(col: string) {
		visibleColumns = { ...visibleColumns, [col]: !visibleColumns[col] };
	}

	function exportCSV() {
		const headers = productColumns
			.filter((col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions')
			.map((col) => col.label || col.accessorKey);

		const rows = (data.products ?? []).map((product) =>
			productColumns
				.filter((col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions')
				.map((col) => {
					const value = product[col.accessorKey!];
					return value != null ? String(value) : '';
				})
		);

		const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">Product Management</h1>
		<Button onclick={() => (showCreate = true)}>
			<Plus class="mr-2 h-4 w-4" /> Add Product
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={showCreate}
		mode="create"
		schema={productSchema}
		action="?/create"
		title="Create Product"
	/>

	{#if showEdit}
		<DataTableFormDialog
			bind:open={showEdit}
			mode="edit"
			data={editItem}
			schema={productSchema}
			action="?/update"
			title="Edit Product"
		/>
	{/if}

	{#if showDelete && deleteItem}
		<DeleteDialog
			bind:open={showDelete}
			id={deleteItem.id}
			resourceName={deleteItem.name}
			title="Delete Product"
			description="Are you sure you want to delete this product?"
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Products"
		searchPlaceholder="Search products..."
		bind:searchValue
		onSearch={applySearch}
		onClear={clearSearch}
		bind:columns={visibleColumns}
		onToggleColumn={toggleColumn}
		onExportCSV={exportCSV}
	/>

	<DataTable
		data={data.products ?? []}
		columns={productColumns}
		{visibleColumns}
		searchTerm={activeSearchTerm}
		bind:sortColumn
		bind:sortOrder
		bind:selectedRows
		bulkDeleteAction="?/bulkDelete"
	>
		{#snippet actions(item)}
			<div class="flex gap-2">
				<Button size="icon" variant="ghost" onclick={() => openEdit(item)} title="Edit">
					<SquarePen class="w-4 h-4" />
				</Button>
				<Button size="icon" variant="destructive" onclick={() => openDelete(item)} title="Delete">
					<Trash2 class="w-4 h-4" />
				</Button>
			</div>
		{/snippet}
	</DataTable>
</div>
