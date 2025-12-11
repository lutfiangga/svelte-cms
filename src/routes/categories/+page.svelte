<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { categoryColumns, type Category } from './columns';
	import type { FormSchema } from '$lib/types/form-builder';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	import { categorySchema } from '$lib/app/modules/category/forms/category.form';

	// State management
	let visibleColumns = $state(
		categoryColumns.reduce(
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
	let editItem: Category | null = $state(null);
	let deleteItem: Category | null = $state(null);

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
		const headers = categoryColumns
			.filter((col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions')
			.map((col) => col.label || col.accessorKey);

		const rows = data.categories.map((category) =>
			categoryColumns
				.filter((col) => col.accessorKey && col.type !== 'select' && col.type !== 'actions')
				.map((col) => {
					const value = category[col.accessorKey!];
					return value != null ? String(value) : '';
				})
		);

		const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `categories_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function handleEdit(item: Category) {
		editItem = item;
		showEdit = true;
	}

	function handleDelete(item: Category) {
		deleteItem = item;
		showDelete = true;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Categories</h1>
			<p class="text-muted-foreground">Manage product categories</p>
		</div>
		<button
			class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			onclick={() => (showCreate = true)}
		>
			<Plus class="h-4 w-4" />
			Add Category
		</button>
	</div>

	<DataTableToolbar
		title="Filter Categories"
		searchPlaceholder="Search categories..."
		bind:searchValue
		onSearch={applySearch}
		onClear={clearSearch}
		bind:columns={visibleColumns}
		onToggleColumn={toggleColumn}
		onExportCSV={exportCSV}
	/>

	<DataTable
		data={data.categories}
		columns={categoryColumns}
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
		schema={categorySchema}
		action="?/create"
		title="Create Category"
	/>

	{#if showEdit && editItem}
		<DataTableFormDialog
			bind:open={showEdit}
			mode="edit"
			data={editItem}
			schema={categorySchema}
			action="?/update"
			title="Edit Category"
		/>
	{/if}

	{#if showDelete && deleteItem}
		<DeleteDialog
			bind:open={showDelete}
			id={deleteItem.id}
			resourceName={deleteItem.name}
			title="Delete Category"
			description="Are you sure you want to delete this category?"
			action="?/delete"
		/>
	{/if}
</div>
