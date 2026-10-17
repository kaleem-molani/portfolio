export function renderTopicArchive(): string {
  return `
    <div class="page-content-narrow">
      
      <!-- Breadcrumb & Header Area -->
      <section class="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center;">
          <a class="hover:text-primary transition-colors" href="/learnings">Learnings</a>
          <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
          <span class="text-primary">Integration</span>
        </nav>
        
        <div class="flex flex-col gap-6 mt-4">
          <h1 class="font-headline-xl text-on-surface">Integration</h1>
          <div class="quote-block">
            <p class="font-quote text-on-surface-variant leading-relaxed">
              Exploring the unglamorous, critical work of connecting systems that weren't meant to talk to each other.
            </p>
          </div>
          <div class="font-label-caps text-on-surface-variant" style="font-size: 11px; margin-top: 8px;">
            3 Articles
          </div>
        </div>
      </section>

      <!-- Articles List -->
      <section class="flex flex-col border-t border-outline-variant">
        
        <!-- Featured Article -->
        <a class="py-stack-md border-b border-outline-variant group cursor-pointer block text-inherit no-underline" href="/learnings/integration/the-hidden-cost-of-brittle-webhooks">
          <div class="font-label-caps text-primary uppercase mb-2" style="font-size: 11px;">Featured · Latest</div>
          <h2 class="font-headline-lg text-on-surface group-hover:text-primary transition-colors mb-4">
            The Hidden Cost of Brittle Webhooks
          </h2>
          <p class="font-body-lg text-on-surface-variant mb-6">
            We treat webhooks as the nervous system of modern application architecture, but underneath lies a fragility that routinely causes quiet data corruption. How to build defensive ingestion layers that survive upstream changes.
          </p>
          <div class="text-primary font-label-caps flex items-center gap-2 group-hover:text-on-background transition-colors" style="font-size: 11px;">
            READ MORE 
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
          </div>
        </a>

        <!-- Standard List Item 1 -->
        <a class="py-stack-md border-b border-outline-variant group cursor-pointer flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 hover:bg-surface-container-lowest transition-colors px-4 -mx-4 rounded text-inherit no-underline" href="/learnings/integration/retries-and-idempotency">
          <time class="font-label-caps text-on-surface-variant md:w-32 shrink-0" style="font-size: 11px;">JUN 22, 2026</time>
          <div class="flex-grow flex flex-col gap-2">
            <h3 class="font-headline-md text-on-surface group-hover:text-primary transition-colors text-[24px]">
              Retries and idempotency: how trying again quietly doubles everything
            </h3>
            <p class="font-body-md text-on-surface-variant">
              When a sync fails, the obvious fix is to try again. But a retry that isn't safe to repeat is how the same contact lands in your target system twice.
            </p>
          </div>
        </a>

        <!-- Standard List Item 2 -->
        <a class="py-stack-md border-b border-outline-variant group cursor-pointer flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 hover:bg-surface-container-lowest transition-colors px-4 -mx-4 rounded text-inherit no-underline" href="/learnings/integration/bridge-is-the-whole-job">
          <time class="font-label-caps text-on-surface-variant md:w-32 shrink-0" style="font-size: 11px;">JUN 21, 2026</time>
          <div class="flex-grow flex flex-col gap-2">
            <h3 class="font-headline-md text-on-surface group-hover:text-primary transition-colors text-[24px]">
              Integration 101: the bridge is the whole job
            </h3>
            <p class="font-body-md text-on-surface-variant">
              Every integration is three parts — a source, a destination, and the bridge between them. The bridge is where the real thinking lives.
            </p>
          </div>
        </a>

      </section>

    </div>
  `;
}
