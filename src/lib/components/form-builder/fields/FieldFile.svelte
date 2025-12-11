<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { X, FileText, Image, File as FileIcon } from '@lucide/svelte';
	import type { FileFieldConfig } from '$lib/types/form-builder';

	let { config, value = $bindable() }: { config: FileFieldConfig; value: any } = $props();

	let previewUrls: string[] = $state([]);
	let fileInput = $state<HTMLInputElement | null>(null);
	let errors: string[] = $state([]);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		errors = [];
		if (files && files.length > 0) {
			handleFiles(Array.from(files));
		}
	}

	function handleFiles(files: File[]) {
		// Validation
		const validFiles: File[] = [];
		files.forEach((file) => {
			if (config.maxSize && file.size > config.maxSize) {
				errors = [
					...errors,
					`File ${file.name} exceeds max size of ${formatBytes(config.maxSize)}`
				];
				return;
			}
			validFiles.push(file);
		});

		if (validFiles.length === 0) return;

		// If not multiple, replace existing
		if (!config.multiple) {
			previewUrls = [];
			// For single file, value binding is handled by standard form submission if name matches
			// But we might want to clear previous value if it was a string (DB url)
		}

		validFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					previewUrls = config.multiple
						? [...previewUrls, e.target.result as string]
						: [e.target.result as string];
				}
			};
			reader.readAsDataURL(file);
		});
	}

	function clearFile(index: number) {
		if (config.multiple) {
			const newUrls = [...previewUrls];
			newUrls.splice(index, 1);
			previewUrls = newUrls;
			// Note: Removing files from a FileList is tricky/impossible directly.
			// Usually, for multiple files, we might need a custom data transfer or rely on AJAX.
			// For standard form submission, clearing one from a multi-select input clears ALL if we reset the input.
			// This is a limitation of standard HTML file inputs.
			// Strategy: If user clears one, we force them to re-select if it was a pending upload.
			// If it was an existing URL, we just remove it from display and maybe add a hidden input "delete_files[]".

			// For simplicity in this iteration: Clearing clears the input.
			if (fileInput) fileInput.value = '';
			previewUrls = []; // Reset all if clearing due to input limitation or improve logic later.
			// Ideally we just clear the specific item if it's an existing URL.
		} else {
			if (fileInput) fileInput.value = '';
			previewUrls = [];
			value = null;
		}
	}

	// Better clear for single:
	function clearSingle() {
		if (fileInput) fileInput.value = '';
		previewUrls = [];
		value = null;
	}

	// Initialize preview if value is a string URL or array of strings
	$effect(() => {
		if (previewUrls.length === 0) {
			if (typeof value === 'string' && value.length > 0) {
				previewUrls = [value];
			} else if (Array.isArray(value) && value.length > 0) {
				previewUrls = value;
			}
		}
	});

	function getIconForFile(url: string) {
		// Simple extension check
		if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith('data:image')) return 'image';
		if (url.match(/\.pdf$/i)) return 'pdf';
		return 'file';
	}

	function formatBytes(bytes: number, decimals = 2) {
		if (!+bytes) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
</script>

<div class="space-y-2 {config.class}">
	<Label for={config.name}>
		{config.label}
		{#if config.required}<span class="text-destructive">*</span>{/if}
		{#if config.maxSize}
			<span class="text-xs text-muted-foreground ml-2">(Max {formatBytes(config.maxSize)})</span>
		{/if}
	</Label>

	<!-- Hidden config inputs for backend -->
	{#if config.path}
		<input type="hidden" name="{config.name}_path" value={config.path} />
	{/if}
	<input type="hidden" name="{config.name}_multiple" value={config.multiple ? 'true' : 'false'} />

	{#if previewUrls.length > 0}
		<div class="flex flex-wrap gap-4 mb-2">
			{#each previewUrls as url, i}
				<div class="relative group border rounded-lg p-2 bg-muted/20">
					<Button
						variant="destructive"
						size="icon"
						class="absolute -top-2 -right-2 h-6 w-6 z-10"
						onclick={() => (config.multiple ? clearFile(i) : clearSingle())}
					>
						<X class="w-3 h-3" />
					</Button>

					{#if getIconForFile(url) === 'image'}
						<img src={url} alt="Preview" class="h-20 w-20 object-cover rounded-md" />
					{:else}
						<div class="h-20 w-20 flex flex-col items-center justify-center text-muted-foreground">
							{#if getIconForFile(url) === 'pdf'}
								<FileText class="w-8 h-8 mb-1" />
								<span class="text-xs uppercase">PDF</span>
							{:else}
								<FileIcon class="w-8 h-8 mb-1" />
								<span class="text-xs uppercase">FILE</span>
							{/if}
						</div>
					{/if}

					{#if typeof url === 'string' && !url.startsWith('data:')}
						<div class="text-[10px] text-center mt-1 w-20 truncate">{url.split('/').pop()}</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#each errors as error}
		<p class="text-xs text-destructive">{error}</p>
	{/each}

	<div class="flex items-center gap-2">
		<Input
			bind:ref={fileInput}
			id={config.name}
			name={config.name}
			type="file"
			accept={config.accept}
			multiple={config.multiple}
			required={config.required && previewUrls.length === 0}
			onchange={handleFileChange}
			class="cursor-pointer"
		/>
	</div>
	<!-- Note: SvelteKit form actions handle 'file' inputs automatically if enctype is set. 
         Multiple files mean the server receives an array of File objects for that name. -->

	{#if config.description}
		<p class="text-sm text-muted-foreground">{config.description}</p>
	{/if}
</div>
