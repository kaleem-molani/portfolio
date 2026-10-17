export function renderHome(): string {
  return `
    <div class="page-content">
      <!-- Hero Section -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center mt-stack-md">
        <div class="md:col-span-7 flex flex-col gap-stack-sm">
          <h1 class="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-on-surface">Learning in public, one system at a time.</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">Right now I'm studying distributed systems architecture—diving deep into consensus protocols, replication models, and partition tolerance. Very much still in the figuring-it-out phase — which is the whole point.</p>
        </div>
        <div class="md:col-span-5 hidden md:flex items-center justify-center">
          <div class="w-full aspect-square border border-outline-variant bg-surface-container-low flex items-center justify-center relative">
            <div class="absolute inset-4 border border-outline-variant opacity-40"></div>
            <span class="material-symbols-outlined text-primary" style="font-size: 80px;">architecture</span>
          </div>
        </div>
      </section>
      <hr class="full-bleed">
      
      <!-- Recently Learned Section -->
      <section class="flex flex-col gap-stack-md">
        <div class="flex flex-col gap-2 border-b border-outline-variant pb-4">
          <div class="flex justify-between items-end">
            <h2 class="font-headline-md text-headline-md text-on-surface">Recently Learned</h2>
            <a class="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1" href="/learnings">All learnings →</a>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant">The notes I wish someone had handed me before I started.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <!-- Entry 1 -->
          <a class="flex flex-col gap-4 group cursor-pointer border-b md:border-b-0 md:border-r border-outline-variant pb-8 md:pb-0 md:pr-8 last:border-0 last:pr-0 text-inherit no-underline" href="/learnings/agentic-ai/from-autocomplete-to-agent">
            <div class="flex justify-between items-center font-label-caps text-label-caps text-on-surface-variant">
              <span class="">Jun 22, 2026</span>
              <span class="bg-surface-container-high px-2 py-1 text-primary">Agentic AI</span>
            </div>
            <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-[24px]">From autocomplete to agent: how AI actually got useful</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">"AI" went from a box that predicts the next word, to a system that can plan, use tools, remember, and check its own work.</p>
          </a>
          <!-- Entry 2 -->
          <a class="flex flex-col gap-4 group cursor-pointer border-b md:border-b-0 md:border-r border-outline-variant pb-8 md:pb-0 md:pr-8 last:border-0 last:pr-0 text-inherit no-underline" href="/learnings/migration/it-is-not-a-copy-paste">
            <div class="flex justify-between items-center font-label-caps text-label-caps text-on-surface-variant">
              <span class="">Jun 22, 2026</span>
              <span class="bg-surface-container-high px-2 py-1 text-primary">Migration</span>
            </div>
            <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-[24px]">Migration 101: it's not a copy-paste</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">A data migration isn't moving files from one box to another — it's rebuilding your data inside a new system that disagrees with the old one about almost everything.</p>
          </a>
          <!-- Entry 3 -->
          <a class="flex flex-col gap-4 group cursor-pointer border-b md:border-b-0 md:border-r border-outline-variant pb-8 md:pb-0 md:pr-8 last:border-0 last:pr-0 text-inherit no-underline" href="/learnings/integration/the-hidden-cost-of-brittle-webhooks">
            <div class="flex justify-between items-center font-label-caps text-label-caps text-on-surface-variant">
              <span class="">Jun 23, 2026</span>
              <span class="bg-surface-container-high px-2 py-1 text-primary">Integration</span>
            </div>
            <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-[24px]">The hidden cost of brittle webhooks</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">We treat webhooks as the nervous system of modern applications, but underneath lies a fragility that routinely causes quiet data corruption.</p>
          </a>
        </div>
      </section>
      
      <!-- Current Focus & From the Lab (Bento Layout) -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-stack-md">
        <!-- Current Focus (Now) -->
        <div id="now" class="md:col-span-7 bg-surface-container-lowest border border-outline-variant p-8 flex flex-col gap-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div class="flex items-center gap-2 text-primary font-label-caps text-label-caps">
            <span class="w-2 h-2 bg-primary rounded-none" style="animation: pulse 1.5s infinite; border-radius: 50%;"></span>
            Current Focus (Now)
          </div>
          <h3 class="font-headline-lg text-headline-lg text-on-surface">Learning Rust</h3>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Right now I'm learning Rust — working through the ownership model, borrowing, and lifetimes. Coming from TypeScript, it's a different way of thinking about memory and safety. Building small CLI tools to make things stick.</p>
          <div class="mt-4 flex gap-4">
            <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Rust</span>
            <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Ownership</span>
            <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Systems Programming</span>
          </div>
        </div>
        <!-- From the Lab -->
        <a id="lab" class="md:col-span-5 bg-surface border border-outline-variant p-8 flex flex-col gap-6 group cursor-pointer hover:bg-surface-container transition-colors duration-300 text-inherit no-underline" href="/lab">
          <div class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2">From the Lab</div>
          <div class="flex-grow flex flex-col justify-center">
            <div class="w-12 h-12 border border-outline-variant flex items-center justify-center mb-4 bg-surface-container-highest group-hover:bg-primary group-hover:border-primary transition-colors">
              <span class="material-symbols-outlined text-on-surface group-hover:text-on-primary transition-colors">schema</span>
            </div>
            <h3 class="font-headline-md text-headline-md text-on-surface mb-2">Project — Diagram Notebook</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">A client-side markdown editor and layout engine built from scratch. It parses a custom diagram DSL to dynamically render interactive, zoomable, and resizable architecture flowcharts.</p>
          </div>
          <div class="flex items-center gap-2 text-primary font-label-caps text-label-caps mt-auto">Try the interactive lab &rarr;</div>
        </a>
      </section>
    </div>
    
    <style>
      @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0.7; }
      }
    </style>
  `;
}
