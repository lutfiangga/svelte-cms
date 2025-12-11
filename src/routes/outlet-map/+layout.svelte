<script lang="ts">
	import DashboardLayout from '../dashboard/dashboard-layout.svelte';

	let { data, children } = $props();
</script>

<DashboardLayout {data}>
	{#if children}
		{@render children()}
	{/if}
</DashboardLayout>
