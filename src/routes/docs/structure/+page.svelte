<script lang="ts">
	import {
		FileCode,
		Database,
		KeyRound,
		LayoutTemplate,
		Box,
		Server,
		Globe,
		Lock,
		Wrench,
		Type,
		Table
	} from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-8">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Folder Structure</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			A deep dive into how `shake2` is organized.
		</p>
	</div>

	<div class="space-y-6">
		<h2 class="text-3xl font-semibold tracking-tight border-b pb-2">src/lib</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- src/lib/app (Core Logic) -->
			<Card.Card class="h-full">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<Box class="h-6 w-6 text-blue-500" />
						<Card.CardTitle>app/</Card.CardTitle>
					</div>
					<Card.CardDescription>The business logic core.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="space-y-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Database class="h-4 w-4 mt-1 text-green-500" />
							<div>
								<span class="font-bold">database/</span>
								<p class="text-xs text-muted-foreground">
									Drizzle connection & unified schema exports.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<LayoutTemplate class="h-4 w-4 mt-1 text-orange-500" />
							<div>
								<span class="font-bold">modules/</span>
								<p class="text-xs text-muted-foreground">
									Feature-based modules (User, Product, Outlet). Each contains its own `models/`
									(schema) and `services/`.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<KeyRound class="h-4 w-4 mt-1 text-purple-500" />
							<div>
								<span class="font-bold">server/auth.ts</span>
								<p class="text-xs text-muted-foreground">
									Custom authentication logic (Oslo + Argon2). Handles session cookies & hashing.
								</p>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>

			<!-- src/lib/components (UI) -->
			<Card.Card class="h-full">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<LayoutTemplate class="h-6 w-6 text-orange-500" />
						<Card.CardTitle>components/</Card.CardTitle>
					</div>
					<Card.CardDescription>Reusable UI elements.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="space-y-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<LayoutTemplate class="h-4 w-4 mt-1 text-slate-500" />
							<div>
								<span class="font-bold">ui/</span>
								<p class="text-xs text-muted-foreground">
									Shadcn Svelte primitives (Button, Card, Input).
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<FileCode class="h-4 w-4 mt-1 text-pink-500" />
							<div>
								<span class="font-bold">form-builder/</span>
								<p class="text-xs text-muted-foreground">Schema-driven form generator.</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Table class="h-4 w-4 mt-1 text-yellow-500" />
							<div>
								<span class="font-bold">custom-table/</span>
								<p class="text-xs text-muted-foreground">
									DataTable implementation with sorting, pagination & filtering.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Globe class="h-4 w-4 mt-1 text-emerald-500" />
							<div>
								<span class="font-bold">location-selector.svelte</span>
								<p class="text-xs text-muted-foreground">
									Indonesia region picker (Prov/City/District) using `emsifa.com` API.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Globe class="h-4 w-4 mt-1 text-blue-400" />
							<div>
								<span class="font-bold">location-search.svelte</span>
								<p class="text-xs text-muted-foreground">Google Maps based location picker.</p>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>

			<!-- src/lib/utils & types -->
			<Card.Card class="h-full md:col-span-2">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<Wrench class="h-6 w-6 text-slate-500" />
						<Card.CardTitle>Utilities & Types</Card.CardTitle>
					</div>
					<Card.CardDescription>Global helpers and definitions.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="grid md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Wrench class="h-4 w-4 mt-1 text-indigo-500" />
							<div>
								<span class="font-bold">utils.ts</span>
								<p class="text-xs text-muted-foreground">
									Contains `cn()` helper for merging Tailwind classes safely.
								</p>
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Type class="h-4 w-4 mt-1 text-red-500" />
							<div>
								<span class="font-bold">types/</span>
								<p class="text-xs text-muted-foreground">Global TypeScript definitions.</p>
								<ul class="list-disc list-inside text-[10px] text-muted-foreground ml-1 mt-1">
									<li><code>form-builder.ts</code>: Form schema types</li>
									<li><code>data-table.ts</code>: Table structure types</li>
								</ul>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>
		</div>
	</div>

	<div class="space-y-6">
		<h2 class="text-3xl font-semibold tracking-tight border-b pb-2">src/routes</h2>

		<div class="grid gap-6">
			<!-- src/routes (Pages) -->
			<Card.Card class="h-full">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<Globe class="h-6 w-6 text-green-500" />
						<Card.CardTitle>routes/</Card.CardTitle>
					</div>
					<Card.CardDescription>SvelteKit file-based routing.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="grid md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Lock class="h-4 w-4 mt-1 text-red-500" />
							<div>
								<span class="font-bold">(auth)/</span>
								<p class="text-xs text-muted-foreground">
									Login/Register pages (Grouped layout to exclude Dashboard sidebar).
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<LayoutTemplate class="h-4 w-4 mt-1 text-blue-500" />
							<div>
								<span class="font-bold">dashboard/</span>
								<p class="text-xs text-muted-foreground">
									Main app area. `+layout.svelte` here handles the sidebar & topbar.
								</p>
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Server class="h-4 w-4 mt-1 text-yellow-500" />
							<div>
								<span class="font-bold">api/</span>
								<p class="text-xs text-muted-foreground">Internal API endpoints returning JSON.</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<FileCode class="h-4 w-4 mt-1 text-cyan-500" />
							<div>
								<span class="font-bold">docs/</span>
								<p class="text-xs text-muted-foreground">This documentation site!</p>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>
		</div>
	</div>
</div>
