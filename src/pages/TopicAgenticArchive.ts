export function renderTopicAgenticArchive(): string {
  return `
    <div class="page-content-narrow">
      
      <!-- Breadcrumb & Header Area -->
      <section class="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center;">
          <a class="hover:text-primary transition-colors" href="/learnings">Learnings</a>
          <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
          <span class="text-primary">Agentic AI</span>
        </nav>
        
        <div class="flex flex-col gap-6 mt-4">
          <h1 class="font-headline-xl text-on-surface">Agentic AI</h1>
          <div class="quote-block">
            <p class="font-quote text-on-surface-variant leading-relaxed">
              Building autonomous feedback loops that plan, act, observe, and validate their own work.
            </p>
          </div>
          <div class="font-label-caps text-on-surface-variant" style="font-size: 11px; margin-top: 8px;">
            1 Article
          </div>
        </div>
      </section>

      <!-- Articles List -->
      <section class="flex flex-col border-t border-outline-variant">
        
        <!-- Featured Article -->
        <a class="py-stack-md border-b border-outline-variant group cursor-pointer block text-inherit no-underline" href="/learnings/agentic-ai/from-autocomplete-to-agent">
          <div class="font-label-caps text-primary uppercase mb-2" style="font-size: 11px;">Featured</div>
          <h2 class="font-headline-lg text-on-surface group-hover:text-primary transition-colors mb-4">
            From autocomplete to agent: how AI actually got useful
          </h2>
          <p class="font-body-lg text-on-surface-variant mb-6">
            "AI" went from a box that predicts the next word, to a system that can plan, use tools, remember, and check its own work — in a few short years. Most people skipped watching it happen. This is how I watched it.
          </p>
          <div class="text-primary font-label-caps flex items-center gap-2 group-hover:text-on-background transition-colors" style="font-size: 11px;">
            READ MORE 
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
          </div>
        </a>

      </section>

    </div>
  `;
}
