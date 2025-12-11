<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ArrowRight, LayoutDashboard, Shield, Zap, Globe } from '@lucide/svelte';

	let showCountrySelect = $state(true);

	function handleCountrySelect(country: 'ID' | 'SG') {
		if (country === 'SG') {
			window.location.href = 'https://google.com';
		} else {
			showCountrySelect = false;
		}
	}
</script>

<div class="flex min-h-screen w-full max-w-7xl mx-auto flex-col">
	<!-- Navbar -->
	<header class="container mx-auto flex h-16 items-center justify-between px-4">
		<div class="flex items-center gap-2 font-bold text-xl tracking-tight">
			<div
				class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
			>
				<Zap class="h-5 w-5 fill-current" />
			</div>
			VELARIS
		</div>
		<nav class="flex items-center gap-4">
			<Button variant="ghost" href="/docs">Documentation</Button>
			<Button href="/login">Login</Button>
		</nav>
	</header>

	<!-- Hero Section -->
	<main class="flex-1">
		<section
			class="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center lg:py-32"
		>
			<Badge variant="outline" class="mb-4 animate-in fade-in zoom-in duration-500">
				v1.0 Now Available
			</Badge>
			<h1
				class="max-w-4xl text-5xl font-extrabold tracking-tight lg:text-7xl mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-700 fade-in"
			>
				Build faster with <br /> modern tools.
			</h1>
			<p
				class="max-w-2xl text-xl text-muted-foreground mb-8 animate-in slide-in-from-bottom-6 duration-700 fade-in delay-100"
			>
				A comprehensive boilerplate for SvelteKit applications. Features authentication, dashboard
				layout, and modular architecture out of the box.
			</p>
			<div
				class="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-200"
			>
				<Button size="lg" href="/login" class="gap-2">
					Get Started <ArrowRight class="h-4 w-4" />
				</Button>
				<Button size="lg" variant="outline" href="/docs">View Documentation</Button>
			</div>
		</section>

		<!-- Features Grid -->
		<section class="container mx-auto px-4 py-16">
			<div class="grid gap-8 md:grid-cols-3">
				<div class="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
					<div
						class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
					>
						<LayoutDashboard class="h-6 w-6" />
					</div>
					<h3 class="mb-2 text-xl font-bold">Admin Dashboard</h3>
					<p class="text-muted-foreground">
						Pre-built dashboard layout with sidebar navigation, breadcrumbs, and user dropdown.
					</p>
				</div>
				<div class="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
					<div
						class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
					>
						<Shield class="h-6 w-6" />
					</div>
					<h3 class="mb-2 text-xl font-bold">Authentication</h3>
					<p class="text-muted-foreground">
						Secure user authentication with Argon2 hashing and session management.
					</p>
				</div>
				<div class="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
					<div
						class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
					>
						<Zap class="h-6 w-6" />
					</div>
					<h3 class="mb-2 text-xl font-bold">Modular Design</h3>
					<p class="text-muted-foreground">
						Clean architecture separating modules, services, and core logic for scalability.
					</p>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t py-6 md:py-0">
		<div class="container mx-auto flex h-14 items-center justify-between px-4">
			<p class="text-sm text-muted-foreground">&copy; 2025 Neuversity. All rights reserved.</p>
			<div class="flex items-center gap-4">
				<a href="https://github.com" class="text-sm text-muted-foreground hover:underline">GitHub</a
				>
				<a href="#" class="text-sm text-muted-foreground hover:underline">Terms</a>
			</div>
		</div>
	</footer>

	<Dialog.Root bind:open={showCountrySelect}>
		<Dialog.Content
			class="w-4/5 sm:w-full max-w-[425px]"
			showCloseButton={false}
			onInteractOutside={(e) => e.preventDefault()}
			onEscapeKeydown={(e) => e.preventDefault()}
		>
			<Dialog.Header>
				<Dialog.Title class="flex items-center gap-2">
					<Globe class="h-5 w-5" />
					Select Your Region
				</Dialog.Title>
				<Dialog.Description>
					Please select your country to continue to the appropriate site.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Button
					size="lg"
					variant="outline"
					class="justify-between"
					onclick={() => handleCountrySelect('ID')}
				>
					Indonesia
					<span class="text-xs text-muted-foreground">Continue here</span>
				</Button>
				<Button
					size="lg"
					variant="outline"
					class="justify-between"
					onclick={() => handleCountrySelect('SG')}
				>
					Singapore
					<span class="text-xs text-muted-foreground">Redirect to Google</span>
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>
