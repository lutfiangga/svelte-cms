<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormSchema, FormSchemaItem } from '$lib/types/form-builder';
	import { Button } from '$lib/components/ui/button';

	// Import Fields
	import FieldText from './fields/FieldText.svelte';
	import FieldTextarea from './fields/FieldTextarea.svelte';
	import FieldSelect from './fields/FieldSelect.svelte';
	import FieldCombobox from './fields/FieldCombobox.svelte';
	import FieldCheckbox from './fields/FieldCheckbox.svelte';
	import FieldFile from './fields/FieldFile.svelte';

	// Import Custom Components
	import LocationSearch from '$lib/components/location-search.svelte';

	// Import Layouts
	import Section from './layouts/Section.svelte';
	import Grid from './layouts/Grid.svelte';
	import Group from './layouts/Group.svelte';

	let {
		schema,
		data = $bindable({}),
		action = '',
		method = 'POST',
		submitLabel = 'Save',
		loading = false,
		onsuccess,
		onerror
	}: {
		schema: FormSchema;
		data?: Record<string, any>;
		action?: string;
		method?: string;
		submitLabel?: string;
		loading?: boolean;
		onsuccess?: () => void;
		onerror?: (message: string) => void;
	} = $props();

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	const hasFile = $derived(schema.some(checkFileRecursive));

	function checkFileRecursive(item: FormSchemaItem): boolean {
		if ('type' in item) {
			if (item.type === 'file') return true;
			if (item.type === 'section' || item.type === 'grid' || item.type === 'group') {
				return item.children.some(checkFileRecursive);
			}
		}
		return false;
	}

	const enctype = $derived(hasFile ? 'multipart/form-data' : undefined);
</script>

{#snippet renderItem(item: FormSchemaItem)}
	{#if item.type === 'section'}
		<Section config={item} {renderItem} />
	{:else if item.type === 'grid'}
		<Grid config={item} {renderItem} />
	{:else if item.type === 'group'}
		<Group config={item} {renderItem} />
	{:else if item.type === 'text' || item.type === 'email' || item.type === 'password' || item.type === 'number'}
		<FieldText config={item} bind:value={data[item.name]} />
	{:else if item.type === 'textarea'}
		<FieldTextarea config={item} bind:value={data[item.name]} />
	{:else if item.type === 'select'}
		<FieldSelect config={item} bind:value={data[item.name]} />
	{:else if item.type === 'combobox'}
		<FieldCombobox config={item} bind:value={data[item.name]} />
	{:else if item.type === 'checkbox' || item.type === 'switch'}
		<FieldCheckbox config={item} bind:value={data[item.name]} />
	{:else if item.type === 'file'}
		<FieldFile config={item} bind:value={data[item.name]} />
	{:else if item.type === 'custom'}
		{#if item.component === 'LocationSearch'}
			<LocationSearch bind:latitude={data.latitude} bind:longitude={data.longitude} />
		{/if}
	{/if}
{/snippet}

{#if errorMessage}
	<div class="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
		{errorMessage}
	</div>
{/if}

<form
	{method}
	{action}
	{enctype}
	class="space-y-4"
	use:enhance={() => {
		isSubmitting = true;
		errorMessage = '';
		return async ({ result, update }) => {
			isSubmitting = false;
			if (result.type === 'success') {
				if (onsuccess) onsuccess();
				await update({ reset: false });
			} else if (result.type === 'failure') {
				errorMessage =
					typeof result.data?.message === 'string' ? result.data.message : 'An error occurred';
				if (onerror) onerror(errorMessage);
			} else if (result.type === 'error') {
				errorMessage = 'An unexpected error occurred';
				if (onerror) onerror(errorMessage);
			}
		};
	}}
>
	{#if data.id}
		<input type="hidden" name="id" value={data.id} />
	{/if}

	{#each schema as item}
		{@render renderItem(item)}
	{/each}

	<div class="flex justify-end pt-4">
		<Button type="submit" disabled={isSubmitting || loading}>
			{isSubmitting ? 'Saving...' : submitLabel}
		</Button>
	</div>
</form>
