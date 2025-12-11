<script lang="ts">
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import DataTableToolbar from '$lib/components/custom-table/data-table-toolbar.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { userColumns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import { Plus, SquarePen, Trash2 } from '@lucide/svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import type { FormField } from '$lib/types/data-table';

	// Form Configuration
	// Form Configuration
	import { createUserSchema, editUserSchema } from '$lib/app/modules/user/forms/user.form';

	let { data } = $props();

	// State management
	let visibleColumns = $state(
		userColumns.reduce(
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
	let sortColumn = $state('username');
	let sortOrder = $state<'asc' | 'desc'>('asc');

	let showCreate = $state(false);

	// Action state
	let editItem = $state<any>(null);
	let deleteItem = $state<any>(null);
	let showEdit = $state(false);
	let showDelete = $state(false);

	// Handlers
	function openEdit(item: any) {
		editItem = item;
		showEdit = true;
	}

	function openDelete(item: any) {
		deleteItem = item;
		showDelete = true;
	}

	// Export handlers
	function exportCSV() {
		const users = data.users ?? [];
		const headers = ['id', 'username', 'age'];
		const csvContent = [
			headers.join(','),
			...users.map((u) => `${u.id},${u.username},${u.age ?? ''}`)
		].join('\n');

		downloadFile(csvContent, 'users.csv', 'text/csv');
	}

	function exportXLSX() {
		const users = data.users ?? [];
		const xlsContent = [
			'id\tusername\tage',
			...users.map((u) => `${u.id}\t${u.username}\t${u.age ?? ''}`)
		].join('\n');

		downloadFile(xlsContent, 'users.xls', 'application/vnd.ms-excel');
	}

	function downloadFile(content: string, filename: string, type: string) {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	// Search handlers
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
</script>

<div class="mx-auto space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">User Management</h1>
		<Button onclick={() => (showCreate = true)}>
			<Plus class="mr-2 h-4 w-4" /> Create User
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={showCreate}
		mode="create"
		schema={createUserSchema}
		action="?/create"
		title="Create User"
	/>

	{#if showEdit}
		<DataTableFormDialog
			bind:open={showEdit}
			mode="edit"
			data={editItem}
			schema={editUserSchema}
			action="?/update"
			title="Edit User"
		/>
	{/if}

	{#if showDelete && deleteItem}
		<DeleteDialog
			bind:open={showDelete}
			id={deleteItem.id}
			resourceName={deleteItem.username}
			action="?/delete"
		/>
	{/if}

	<DataTableToolbar
		title="Filter Data"
		searchPlaceholder="Search username or ID..."
		bind:searchValue
		onSearch={applySearch}
		onClear={clearSearch}
		onExportCSV={exportCSV}
		onExportXLSX={exportXLSX}
		bind:columns={visibleColumns}
		onToggleColumn={toggleColumn}
	/>

	<DataTable
		data={data.users ?? []}
		columns={userColumns}
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
