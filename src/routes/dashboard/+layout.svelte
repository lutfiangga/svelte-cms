<script lang="ts">
	import DashboardLayout from './dashboard-layout.svelte';

	let { data, children } = $props();
</script>

<DashboardLayout {data}>
	{@render children()}
</DashboardLayout>
