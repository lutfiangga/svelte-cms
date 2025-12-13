<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import {
		ArrowRight,
		LayoutDashboard,
		Shield,
		Zap,
		Database,
		FileCode,
		Table,
		Download,
		Globe,
		Terminal,
		Copy,
		Check,
		Box,
		Blocks,
		Layers,
		Github
	} from '@lucide/svelte';

	let copied = $state(false);

	async function copyCommand() {
		await navigator.clipboard.writeText('npx degit lutfiangga/zvelkit my-app');
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const features = [
		{
			icon: LayoutDashboard,
			title: 'Admin Dashboard',
			description: 'Pre-built responsive dashboard with sidebar, breadcrumbs, and user menu.'
		},
		{
			icon: Shield,
			title: 'Authentication',
			description: 'Secure auth with Argon2 hashing, session management, and middleware guards.'
		},
		{
			icon: Database,
			title: 'Database Ready',
			description: 'Drizzle ORM with PostgreSQL. Type-safe schemas and easy migrations.'
		},
		{
			icon: FileCode,
			title: 'Form Builder',
			description: 'Schema-driven dynamic forms with validation and file upload support.'
		},
		{
			icon: Table,
			title: 'Data Tables',
			description: 'Feature-rich tables with sorting, filtering, bulk actions, and pagination.'
		},
		{
			icon: Download,
			title: 'Export Helper',
			description: 'Export data to CSV, Excel, or PDF with a single function call.'
		}
	];

	const techStack = [
		{ name: 'SvelteKit', desc: 'Web Framework' },
		{ name: 'Svelte 5', desc: 'Runes Mode' },
		{ name: 'TypeScript', desc: 'Type Safety' },
		{ name: 'TailwindCSS', desc: 'Styling' },
		{ name: 'Drizzle ORM', desc: 'Database' },
		{ name: 'Shadcn Svelte', desc: 'UI Components' }
	];
</script>

<svelte:head>
	<title>Velaris - Modern SvelteKit Boilerplate</title>
	<meta
		name="description"
		content="A comprehensive boilerplate for building modern web applications with SvelteKit, featuring authentication, dashboard layout, and modular architecture."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
	<!-- Navbar -->
	<header
		class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
			<div class="flex items-center gap-2 font-bold text-xl tracking-tight">
				<div
					class="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground"
				>
					<Zap class="h-5 w-5 fill-current" />
				</div>
				VELARIS
			</div>
			<nav class="flex items-center gap-2">
				<Button variant="ghost" size="sm" href="/docs">Docs</Button>
				<Button
					variant="ghost"
					size="sm"
					href="https://github.com/lutfiangga"
					target="_blank"
					class="gap-2"
				>
					<Github class="h-4 w-4" />
					<span class="hidden sm:inline">GitHub</span>
				</Button>
				<Button size="sm" href="/panel/dashboard">Dashboard</Button>
			</nav>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-20 lg:py-32 max-w-7xl">
		<div class="flex flex-col items-center text-center">
			<Badge variant="secondary" class="mb-6 px-4 py-1.5 text-sm font-medium">
				<Zap class="h-3.5 w-3.5 mr-1.5" />
				Version 1.0 • Built with Svelte 5
			</Badge>

			<h1
				class="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text"
			>
				The SvelteKit Boilerplate<br />
				<span class="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
					for Production Apps
				</span>
			</h1>

			<p class="max-w-2xl text-lg text-muted-foreground mb-8 leading-relaxed">
				A comprehensive starter kit featuring authentication, admin dashboard, database integration,
				and modular architecture. Ship faster with battle-tested patterns.
			</p>

			<!-- Install Command -->
			<div class="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-xl">
				<div
					class="flex items-center gap-2 bg-muted/80 border rounded-lg px-4 py-2.5 font-mono text-sm flex-1 w-full"
				>
					<Terminal class="h-4 w-4 text-muted-foreground shrink-0" />
					<code class="flex-1 text-left truncate text-xs sm:text-sm"
						>npx degit lutfiangga/zvelkit my-app</code
					>
					<button
						onclick={copyCommand}
						class="p-1 hover:bg-background rounded transition-colors shrink-0"
					>
						{#if copied}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4 text-muted-foreground" />
						{/if}
					</button>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row gap-3">
				<Button size="lg" href="/docs" class="gap-2 px-6">
					Get Started <ArrowRight class="h-4 w-4" />
				</Button>
				<Button size="lg" variant="outline" href="/demo" class="gap-2 px-6">
					<LayoutDashboard class="h-4 w-4" />
					View Demo
				</Button>
			</div>
		</div>
	</section>

	<!-- Tech Stack -->
	<section class="container mx-auto px-4 pb-16 max-w-7xl">
		<div class="flex flex-wrap justify-center gap-3">
			{#each techStack as tech}
				<div class="flex items-center gap-2 bg-background border rounded-full px-4 py-2 text-sm">
					<div class="w-2 h-2 rounded-full bg-green-500"></div>
					<span class="font-medium">{tech.name}</span>
					<span class="text-muted-foreground text-xs">{tech.desc}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Features Grid -->
	<section class="container mx-auto px-4 py-20 max-w-7xl">
		<div class="text-center mb-12">
			<Badge variant="outline" class="mb-4">Features</Badge>
			<h2 class="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
				Everything you need to build
			</h2>
			<p class="text-muted-foreground max-w-2xl mx-auto">
				Stop reinventing the wheel. Get all the essential features pre-configured and ready to use.
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				<Card.Card
					class="group hover:shadow-lg hover:border-primary/50 transition-all duration-300"
				>
					<Card.CardHeader>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
						>
							<feature.icon class="h-6 w-6" />
						</div>
						<Card.CardTitle class="text-xl">{feature.title}</Card.CardTitle>
					</Card.CardHeader>
					<Card.CardContent>
						<p class="text-muted-foreground">{feature.description}</p>
					</Card.CardContent>
				</Card.Card>
			{/each}
		</div>
	</section>

	<!-- Architecture Section -->
	<section class="container mx-auto px-4 py-20 max-w-7xl">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<Badge variant="outline" class="mb-4">Architecture</Badge>
				<h2 class="text-3xl lg:text-4xl font-bold tracking-tight mb-6">Modular by Design</h2>
				<p class="text-muted-foreground mb-6 leading-relaxed">
					Clean, scalable architecture that separates concerns. Each feature lives in its own module
					with dedicated models, services, and forms.
				</p>

				<div class="space-y-4">
					<div class="flex items-start gap-3">
						<div
							class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
						>
							<Box class="h-5 w-5" />
						</div>
						<div>
							<h4 class="font-semibold">Feature Modules</h4>
							<p class="text-sm text-muted-foreground">
								Self-contained modules with models, services, requests, and forms.
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div
							class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
						>
							<Blocks class="h-5 w-5" />
						</div>
						<div>
							<h4 class="font-semibold">Reusable Components</h4>
							<p class="text-sm text-muted-foreground">
								Form builder, data tables, and UI primitives ready to use.
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div
							class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
						>
							<Layers class="h-5 w-5" />
						</div>
						<div>
							<h4 class="font-semibold">Clean Separation</h4>
							<p class="text-sm text-muted-foreground">
								Routes, business logic, and data layer are clearly separated.
							</p>
						</div>
					</div>
				</div>
			</div>

			<Card.Card class="border-2">
				<Card.CardContent class="pt-6">
					<pre class="text-xs sm:text-sm font-mono text-muted-foreground overflow-x-auto">
<code class="text-primary">src/</code>
├── <code class="text-blue-500">lib/app/</code>
│   ├── <code class="text-green-500">database/</code>     <span class="text-muted-foreground/60"
							># Drizzle ORM</span
						>
│   ├── <code class="text-green-500">middleware/</code>   <span class="text-muted-foreground/60"
							># Auth guards</span
						>
│   ├── <code class="text-green-500">helpers/</code>      <span class="text-muted-foreground/60"
							># Utilities</span
						>
│   └── <code class="text-green-500">modules/</code>      <span class="text-muted-foreground/60"
							># Feature modules</span
						>
│       ├── <code class="text-yellow-500">user/</code>
│       ├── <code class="text-yellow-500">product/</code>
│       ├── <code class="text-yellow-500">category/</code>
│       └── <code class="text-yellow-500">outlet/</code>
├── <code class="text-blue-500">lib/components/</code>
│   ├── <code class="text-orange-500">ui/</code>           <span class="text-muted-foreground/60"
							># Shadcn</span
						>
│   ├── <code class="text-orange-500">form-builder/</code> <span class="text-muted-foreground/60"
							># Dynamic forms</span
						>
│   └── <code class="text-orange-500">custom-table/</code> <span class="text-muted-foreground/60"
							># DataTable</span
						>
└── <code class="text-blue-500">routes/</code>
    └── <code class="text-cyan-500">panel/</code>        <span class="text-muted-foreground/60"
							># Protected routes</span
						>
					</pre>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="container mx-auto px-4 py-20 max-w-7xl">
		<Card.Card class="bg-gradient-to-br from-primary/10 via-transparent to-blue-600/10 border-2">
			<Card.CardContent class="py-12 text-center">
				<h2 class="text-3xl font-bold tracking-tight mb-4">Ready to build something amazing?</h2>
				<p class="text-muted-foreground mb-8 max-w-xl mx-auto">
					Get started in minutes with a single command. Everything is pre-configured and ready for
					production.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button size="lg" href="/docs" class="gap-2">
						Read the Docs <ArrowRight class="h-4 w-4" />
					</Button>
					<Button
						size="lg"
						variant="outline"
						href="https://github.com/lutfiangga"
						target="_blank"
						class="gap-2"
					>
						<Github class="h-4 w-4" />
						View on GitHub
					</Button>
				</div>
			</Card.CardContent>
		</Card.Card>
	</section>

	<!-- Footer -->
	<footer class="border-t bg-muted/30">
		<div
			class="container mx-auto flex flex-col sm:flex-row h-auto sm:h-16 items-center justify-between px-4 py-4 sm:py-0 gap-4 max-w-7xl"
		>
			<div class="flex items-center gap-2">
				<div
					class="h-6 w-6 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground"
				>
					<Zap class="h-3.5 w-3.5 fill-current" />
				</div>
				<span class="text-sm text-muted-foreground">&copy; 2025 Velaris. Built with SvelteKit.</span
				>
			</div>
			<div class="flex items-center gap-6">
				<a
					href="/docs"
					class="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>Documentation</a
				>
				<a
					href="https://github.com/lutfiangga"
					target="_blank"
					class="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a
				>
			</div>
		</div>
	</footer>
</div>
