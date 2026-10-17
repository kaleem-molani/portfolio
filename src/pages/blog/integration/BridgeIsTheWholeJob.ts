export function renderBridgeIsTheWholeJob(): string {
  return `
    <div class="page-content-narrow">
      
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center; margin-bottom: var(--stack-sm);">
        <a class="hover:text-primary transition-colors" href="/learnings">Learnings</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <a class="hover:text-primary transition-colors" href="/learnings/integration">Integration</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <span class="text-on-surface">Integration 101</span>
      </nav>

      <!-- Article Header -->
      <article class="editorial-prose">
        <header class="mb-stack-lg flex flex-col gap-4">
          <div class="flex items-center gap-4 text-on-surface-variant font-label-caps" style="font-size: 11px; flex-wrap: wrap;">
            <span>Integration</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>Jun 21, 2026</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>6 min read</span>
          </div>
          
          <h1 class="font-headline-xl text-on-surface">
            Integration 101: the bridge is the whole job
          </h1>
          
          <p class="font-body-lg text-on-surface-variant italic quote-block" style="padding-left: 24px; border-left: 2px solid var(--color-primary);">
            Every integration is three parts — a <strong>source</strong>, a <strong>destination</strong>, and the <strong>bridge</strong> between them. The two ends are the generic part: each platform has its own login and its own docs, and they change from tool to tool. The bridge — filtering, mapping, transformation — is where the real thinking lives, and it's the part no platform's documentation teaches you. So that's what this post is about.
          </p>
        </header>

        <!-- Featured Image -->
        <div class="w-full mb-stack-lg border border-outline-variant relative bg-surface-container-high flex items-center justify-center overflow-hidden" style="height: 384px;">
          <img src="/images/integration_bridge.png" alt="Editorial illustration of a geometric bridge connecting source and destination data systems" class="w-full h-full object-cover opacity-80" style="mix-blend-mode: multiply;">
        </div>

        <!-- Body Content -->
        <div class="font-body-lg text-on-surface flex flex-col gap-6 leading-relaxed">
          <h2 class="font-headline-md text-on-surface mt-stack-sm">A small moment first</h2>
          <p>
            The first integration I built that mattered was supposed to be a one-afternoon job: when a deal closes in one system, create the customer in another. Two tools, one arrow between them. I had it "working" before lunch.
          </p>
          <p>
            It worked in the demo. It worked for a week. Then it started skipping records — not all of them, just enough to make me distrust everything. It felt unfair, honestly. I'd put my effort into the auth and the API calls, and that part was working fine — but those functions were choking on bad data from a bad mapping or a bad transformation. Something that silly shouldn't have dented my confidence the way it did.
          </p>
          <p>
            The two ends were never the problem. The problem was in the middle — the part I'd barely thought about. So let me start there, after one quick map of the whole thing.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The shape of every integration</h2>
          <p>
            Strip away the jargon and every integration is three parts:
          </p>
          <p>
            <strong>Source</strong> — the system where something happens, and where you read the data from. (A deal closes, a form is submitted, a payment lands.)
          </p>
          <p>
            <strong>Bridge</strong> — the middle, where you decide <em>which</em> records cross, what each field becomes on the other side, and how the data gets reshaped to fit.
          </p>
          <p>
            <strong>Destination</strong> — the system that needs to know, and where you write the data to.
          </p>
          <p>
            Picture it left to right: read from the source, cross the bridge, write to the destination.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The two ends: real, but generic</h2>
          <p>
            Connecting to the source and the destination is real work — but it's <em>generic</em> work, and it's a solved problem.
          </p>
          <p>
            Each end needs two things: <strong>authentication</strong> (proving you're allowed in — an API key, an OAuth login) and <strong>API calls</strong> (the actual read or write). Every serious platform gives you these, and every platform documents its own. HubSpot's auth is not Salesforce's auth is not your billing tool's auth — but they all have one, and the steps are written down for you.
          </p>
          <p>
            That's the key point: because the ends are platform-specific, they're <em>swappable and documented</em>. Change the platform and this part changes, but you follow that platform's docs and move on. There's little for me to teach here that the vendor hasn't already written better.
          </p>
          <p>
            The bridge is the opposite. It's the same set of problems on every project, and almost nobody writes them down. So that's where this post spends its time.
          </p>
          <p>
            The bridge has three jobs. The first two are mostly <em>decisions</em> — you make the call once and they hold. The third, transformation, is where the care goes, because it's the one that keeps surprising you. So I'll move quickly through the first two and slow down on the third.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The bridge, part 1 — Filter: you don't always sync everything</h2>
          <p>
            The first instinct is to sync every record. Usually that's wrong.
          </p>
          <p>
            Most of the time you only want <em>some</em> of what the source has: only deals that are actually Won, only contacts from this year, only paying customers, only the region this destination cares about. Filtering is deciding, on purpose, what is even allowed to cross the bridge.
          </p>
          <p>
            Skip it and you flood the destination with noise, and make every later step do work on records that should never have been there. The plain-English version: before you ask "how do I move this record," ask "should this record move at all?"
          </p>
          <p>
            Decide it once, and it holds.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The bridge, part 2 — Mapping: same meaning, different names</h2>
          <p>
            No two systems name their fields the same way. One calls it <span class="inline-code">phone</span>, the other <span class="inline-code">mobile_number</span>; one has <span class="inline-code">Company</span>, the other <span class="inline-code">Account Name</span>. Mapping is saying <em>this field over here becomes that field over there.</em> Mostly straightforward — with one catch people forget:
          </p>
          <p>
            <strong>Mapping isn't just fields — it's the options inside the fields too.</strong> A dropdown in the source might offer <span class="inline-code">"Won / Lost / In Progress"</span>. The destination's might say <span class="inline-code">"Closed-Won / Closed-Lost / Open"</span>. Same idea, different labels. Map the <em>field</em> but not each <em>option value</em> and it arrives technically connected and quietly broken — unrecognized values fall on the floor.
          </p>
          <p>
            (My "random skipping" lived one level deeper than this: one system identified a customer by email, the other by company name — two different ideas of what made one <em>unique</em>. Same word, different model. The drops weren't random; the systems just disagreed, and I'd never made them agree.)
          </p>
          <p>
            Still, mapping is a decision you write down once and it holds. Transformation is not.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The bridge, part 3 — Transformation: where the real care goes</h2>
          <p>
            Filtering and mapping are decisions. Transformation is <em>reshaping the data itself</em> — and it's where most of my time, and most of the bugs, actually went. The reason is simple: filter and mapping are settled the moment you make the call, but transformation has to be right for <strong>every record that ever flows through</strong>, including the ones you didn't picture when you set it up. One weird value six months from now and it breaks.
          </p>
          <p>
            The shapes are familiar enough:
          </p>
          <p>
            <strong>Concatenate (join).</strong> Source has <span class="inline-code">first_name</span> and <span class="inline-code">last_name</span>; destination wants one <span class="inline-code">Full Name</span>. Glue them together.
          </p>
          <p>
            <strong>Split.</strong> The reverse — source stores one <span class="inline-code">Full Address</span>; destination wants <span class="inline-code">street</span>, <span class="inline-code">city</span>, <span class="inline-code">zip</span>. Break it apart.
          </p>
          <p>
            <strong>Change the type.</strong> Source sends a date as text — <span class="inline-code">"21/06/2026"</span> — destination expects a real date. Or <span class="inline-code">"1,200"</span> needs to become the number <span class="inline-code">1200</span>. Same value, wrong format; convert it.
          </p>
          <p>
            The shapes are easy. The <strong>care</strong> is in the cases that don't fit the happy path — and these are the ones that bite later, not in the demo:
          </p>
          
          <ul class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px;">
            <li>
              <strong class="text-on-surface">Empty and missing values.</strong> What does "join first + last name" produce when there's no last name? <span class="inline-code">"Kaleem "</span> with a trailing space? An error? Decide on purpose, for every transformation.
            </li>
            <li>
              <strong class="text-on-surface">Splitting is a guess.</strong> "Glue two fields" is safe — you always get one result. "Split one field into three" <em>assumes a pattern</em>. One address with no zip, or a name with a middle name, and your split lands the pieces in the wrong boxes silently. Splitting needs a rule for when the input doesn't match the shape you expected.
            </li>
            <li>
              <strong class="text-on-surface">Type changes hide ambiguity.</strong> <span class="inline-code">"03/04/2026"</span> — is that March 4th or April 3rd? The conversion looks clean and gives you a confidently wrong date. Numbers have the same trap: <span class="inline-code">"1,200"</span> is one thousand two hundred in one place and one-point-two in another. The format you assume <em>is</em> the bug.
            </li>
            <li>
              <strong class="text-on-surface">Same idea, different scale or unit.</strong> One system stores money in dollars, another in cents. One uses a percentage of 0–100, another 0–1. The field maps, the type matches, and the value is still off by 100&times;. Nothing errors — it's just wrong.
            </li>
          </ul>

          <blockquote class="my-stack-md quote-block font-quote text-on-surface">
            "Filter and mapping you decide once. Transformation you have to get right for every record that will ever cross — including the messy one you haven't seen yet. That's where the care goes."
          </blockquote>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What "basic" actually means</h2>
          <p>
            So a <em>basic</em> integration — the 101 version — is the three ends-and-bridge in their simplest form:
          </p>
          <p>
            1. <strong>Source:</strong> read the right event from the right system (follow its docs for auth + the API call).<br>
            2. <strong>Bridge:</strong> <strong>filter</strong> to the records that should cross (decide once), <strong>map</strong> the fields <em>and their option values</em> (decide once), and <strong>transform</strong> anything that doesn't line up — the part that has to stay right for every record, so it's where your care goes.<br>
            3. <strong>Destination:</strong> write it where it needs to go (again, follow that platform's docs).
          </p>
          <p>
            Get the bridge right and the basic version genuinely works. The concept is small once you stop staring at the two ends and start respecting the middle.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What this post is deliberately <em>not</em> covering</h2>
          <p>
            The basic version above is not the production version.
          </p>
          <p>
            The moment it runs in the real world, the world shows up: the destination is down for thirty seconds, two events arrive at once, something fails silently at 2am and you hear about it from an angry customer instead of a dashboard. Handling that — <strong>retries, queues, logging, monitoring</strong> — is what turns a working integration into a <em>reliable</em> one.
          </p>
          <p>
            I left every one of those out on purpose. Bolting reliability onto a bridge whose mapping is still wrong is just building a sturdier path to the wrong place. Get the bridge right first; make it reliable second. Each of those gets its own post, and I'll link them here as I write them.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What I'd do now</h2>
          <p>
            Before I touch either end, I sketch the bridge on paper: what's allowed to cross (filter), what each field and each dropdown value becomes (mapping), and what has to be reshaped (transformation). Plain words, no code. Nine times out of ten the bug I'd have spent a day chasing is sitting right there in that one-page sketch, visible before I connect anything.
          </p>
          <p>
            If you take one thing from this: the two ends are the part the docs already solve. The bridge is the part that's yours.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Why I'm sharing this</h2>
          <p>
            I've been building integrations since 2021, and it was not a smooth five years. Syncs broke in UAT, broke on edge cases, broke at scale — one broke in production six months in, over a rare edge case, and took the whole sync down with it. Every one of those taught me something, and I can build robust, reliable syncs now because of them. I'm writing it down for the people a few steps behind me — and for the ones ahead, who can tell me what I'm still getting wrong.
          </p>
        </div>

        <!-- Next/Prev Navigation -->
        <nav class="flex flex-col sm:flex-row justify-between gap-6 border-t border-outline-variant pt-stack-sm mt-stack-lg">
          <div class="flex-1 text-left flex flex-col gap-2">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px; opacity: 0.5;">&larr; Previous</span>
            <span class="font-body-lg text-on-surface-variant" style="font-size: 16px;">None</span>
          </div>
          <a class="flex-1 group text-left sm:text-right flex flex-col gap-2" href="/learnings/integration/retries-and-idempotency">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px;">Next &rarr;</span>
            <span class="font-body-lg text-on-surface group-hover:text-primary transition-colors">Retries and idempotency: how trying again quietly doubles everything</span>
          </a>
        </nav>
      </article>

    </div>
  `;
}
