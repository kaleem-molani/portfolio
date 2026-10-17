export function renderLearningsHub(): string {
  return `
    <div class="page-content">
      
      <!-- Hero / Intro Section -->
      <section class="max-w-3xl mb-stack-lg">
        <h1 class="font-headline-xl text-on-surface mb-stack-md">
          Learnings
        </h1>
        <div class="quote-block">
          <p class="font-quote text-on-surface-variant leading-relaxed">
            The notes I wish someone had handed me before I started — organized by what they're about.
          </p>
        </div>
      </section>

      <!-- Topic Cards Stack -->
      <section class="flex flex-col gap-stack-md">
        <!-- Topic Card 1: Integration -->
        <article class="card-editorial flex flex-col md:flex-row gap-gutter">
          <!-- Topic Identity -->
          <div class="md:w-1/3 flex flex-col justify-between gap-4">
            <div>
              <h2 class="font-headline-lg text-on-surface mb-2">
                <a class="text-inherit hover:text-primary transition-colors no-underline" href="/learnings/integration">Integration</a>
              </h2>
              <span class="inline-block bg-tonal-layer text-on-surface-variant px-3 py-1 font-label-caps uppercase" style="padding: 4px 12px; font-size: 11px;">
                3 Articles
              </span>
            </div>
          </div>
          
          <!-- Latest Content Teaser -->
          <div class="md:w-2/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-outline-variant pt-stack-sm md:pt-0 md:pl-gutter">
            <span class="font-label-caps text-on-surface-variant mb-2 uppercase" style="font-size: 11px;">Latest Note</span>
            <h3 class="font-body-lg text-on-surface leading-relaxed mb-6">
              <a class="text-inherit hover:text-primary transition-colors no-underline" href="/learnings/integration/the-hidden-cost-of-brittle-webhooks">
                The Hidden Cost of Brittle Webhooks — Why integrations break when vendors improve their API, and how to build defensive ingestion layers that survive upstream change.
              </a>
            </h3>
            
            <a class="btn-secondary" href="/learnings/integration" style="padding: 8px 16px; font-size: 11px; align-self: flex-start;">
              Browse
              <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
            </a>
          </div>
        </article>

        <!-- Topic Card 2: Migration -->
        <article class="card-editorial flex flex-col md:flex-row gap-gutter">
          <div class="md:w-1/3 flex flex-col justify-between gap-4">
            <div>
              <h2 class="font-headline-lg text-on-surface mb-2">
                <a class="text-inherit hover:text-primary transition-colors no-underline" href="/learnings/migration">Migration</a>
              </h2>
              <span class="inline-block bg-tonal-layer text-on-surface-variant px-3 py-1 font-label-caps uppercase" style="padding: 4px 12px; font-size: 11px;">
                1 Article
              </span>
            </div>
          </div>
          
          <div class="md:w-2/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-outline-variant pt-stack-sm md:pt-0 md:pl-gutter">
            <span class="font-label-caps text-on-surface-variant mb-2 uppercase" style="font-size: 11px;">Latest Note</span>
            <h3 class="font-body-lg text-on-surface leading-relaxed mb-6">
              <a class="text-inherit hover:text-primary transition-colors no-underline" href="/learnings/migration/it-is-not-a-copy-paste">
                Migration 101: it's not a copy-paste — A data migration isn't moving files from one box to another: it's rebuilding your data inside a new system that disagrees with the old one.
              </a>
            </h3>
            
            <a class="btn-secondary" href="/learnings/migration" style="padding: 8px 16px; font-size: 11px; align-self: flex-start;">
              Browse
              <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
            </a>
          </div>
        </article>

        <!-- Topic Card 3: Agentic AI -->
        <article class="card-editorial flex flex-col md:flex-row gap-gutter">
          <div class="md:w-1/3 flex flex-col justify-between gap-4">
            <div>
              <h2 class="font-headline-lg text-on-surface mb-2">
                <a class="text-inherit hover:text-primary transition-colors no-underline" href="/learnings/agentic-ai">Agentic AI</a>
              </h2>
              <span class="inline-block bg-tonal-layer text-on-surface-variant px-3 py-1 font-label-caps uppercase" style="padding: 4px 12px; font-size: 11px;">
                1 Article
              </span>
            </div>
          </div>
          
          <div class="md:w-2/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-outline-variant pt-stack-sm md:pt-0 md:pl-gutter">
            <span class="font-label-caps text-on-surface-variant mb-2 uppercase" style="font-size: 11px;">Latest Note</span>
            <h3 class="font-body-lg text-on-surface leading-relaxed mb-6">
              <a class="text-inherit hover:text-primary transition-colors no-underline" href="/learnings/agentic-ai/from-autocomplete-to-agent">
                From autocomplete to agent: how AI actually got useful — "AI" went from a box that predicts the next word, to a system that can plan, use tools, remember, and check its own work.
              </a>
            </h3>
            
            <a class="btn-secondary" href="/learnings/agentic-ai" style="padding: 8px 16px; font-size: 11px; align-self: flex-start;">
              Browse
              <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
            </a>
          </div>
        </article>
      </section>

    </div>
  `;
}
