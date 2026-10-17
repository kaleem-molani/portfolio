export function renderFromAutocompleteToAgent(): string {
  return `
    <div class="page-content-narrow">
      
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center; margin-bottom: var(--stack-sm);">
        <a class="hover:text-primary transition-colors" href="/learnings">Learnings</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <a class="hover:text-primary transition-colors" href="/learnings/agentic-ai">Agentic AI</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <span class="text-on-surface">Autocomplete to Agent</span>
      </nav>

      <!-- Article Header -->
      <article class="editorial-prose">
        <header class="mb-stack-lg flex flex-col gap-4">
          <div class="flex items-center gap-4 text-on-surface-variant font-label-caps" style="font-size: 11px; flex-wrap: wrap;">
            <span>Agentic AI</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>Jun 22, 2026</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>7 min read</span>
          </div>
          
          <h1 class="font-headline-xl text-on-surface">
            From autocomplete to agent: how AI actually got useful
          </h1>
          
          <p class="font-body-lg text-on-surface-variant italic quote-block" style="padding-left: 24px; border-left: 2px solid var(--color-primary);">
            "AI" went from a box that predicts the next word, to a system that can plan, use tools, remember, and check its own work — in a few short years. Most people skipped watching it happen. This is how I watched it.
          </p>
        </header>

        <!-- Featured Image -->
        <div class="w-full mb-stack-lg border border-outline-variant relative bg-surface-container-high flex items-center justify-center overflow-hidden" style="height: 384px;">
          <img src="/images/autocomplete_to_agent.png" alt="Editorial illustration of a feedback loop system, moving from simple text predictions to self-reflective agent loops" class="w-full h-full object-cover opacity-80" style="mix-blend-mode: multiply;">
        </div>

        <!-- Body Content -->
        <div class="font-body-lg text-on-surface flex flex-col gap-6 leading-relaxed">
          <h2 class="font-headline-md text-on-surface mt-stack-sm">Where I was standing when this started</h2>
          <p>
            For me, it started in late 2022. I had just spun up ChatGPT to see if it could help refactor a tricky piece of legacy Python code I was wrestling with. At the time, I assumed "AI" was just another marketing buzzword for advanced keyword matching, or at best a slightly smarter autocomplete. But when it didn't just fix the code, but explained the concurrency bug I'd missed—complete with a warning about race conditions in the specific framework I was using—the air left the room. It felt like talking to another programmer. That was the moment I stopped treating it as a toy and started treating it as a new class of computing.
          </p>
          <p>
            I want to tell you what I watched happen, because I think most people who use AI every day haven't really seen the steps. They went from "this is a toy" to "this is doing my job" without watching the machinery change underneath. The steps matter — because once you see them, you stop being surprised by what AI can and can't do, and you start being useful with it.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Step one: a very good guesser</h2>
          <p>
            The honest description of an LLM — a Large Language Model — is this: it is a program that has read an enormous amount of text, and learned, from that reading, what word is likely to come next.
          </p>
          <p>
            That's it. No understanding. No memory. No plan. It sees the words you gave it, calculates what word probably follows, outputs it, and then does the same for the next word. Over and over, fast. The result looks like a sentence because it <em>is</em> a sentence — but the intelligence isn't in any one step. It's in the pattern that emerged from reading more text than any human ever could.
          </p>
          <p>
            When I first really sat with this — not the demo, but the mechanism — I felt two things at once. It was more impressive than I'd expected (the sheer scale of what "read and learned patterns from" meant), and less impressive than the headlines (because it had no idea what it was saying). It was autocomplete, but autocomplete trained on everything ever written.
          </p>
          <p>
            And that was already useful. Genuinely useful. Ask it to draft an email, explain a concept, summarise a long document — it could do all of that, surprisingly well, because drafting emails and explaining concepts are pattern-completion tasks. The shape of a good explanation is in there, repeated millions of times in its training data.
          </p>
          <p>
            But it had limits that mattered: it couldn't look anything up. It couldn't calculate. Everything it said was drawn from a frozen snapshot of text, and anything it didn't "know" from that snapshot, it would confidently make up.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Step two: giving it hands</h2>
          <p>
            The first thing that changed the game wasn't a smarter model. It was giving the model access to tools.
          </p>
          <p>
            Search. A calculator. A code interpreter. A function that could call an API. Suddenly the model wasn't limited to what it had memorised — it could reach out and fetch a live answer, run a real calculation, execute a real action, and then fold that result back into its response.
          </p>
          <p>
            This is when I started paying very close attention. Because the jump wasn't just "it knows more now." The jump was that the model could decide, mid-conversation, to use a tool — look at what you'd asked it, judge that it needed a live answer rather than a remembered one, call the search tool, get the result, and answer you with it. The gap between "knows things" and "can do things" had quietly closed.
          </p>
          <p>
            Around this time, RAG — Retrieval-Augmented Generation — arrived as a pattern for the same problem applied to private data. Your own documents, your company's knowledge base, your CRM records: stuff the model was never trained on and couldn't know. The model would retrieve the relevant piece first (pulled from your data by a search step), then generate an answer grounded in what it just read. The same move: reach out, get the real thing, then respond.
          </p>
          <p>
            The word people started using was "agent." Technically, loosely, fairly confusingly.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Step three: giving it memory</h2>
          <p>
            The early tool-using model had a problem: every conversation started from zero. Ask it to help you with a task today, come back tomorrow, and it didn't know you. It didn't know what you'd already tried. It didn't know the context of what you were building. Every session was a cold start.
          </p>
          <p>
            Memory changed this — in a few different ways.
          </p>
          <ul class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px;">
            <li>
              <strong class="text-on-surface">Short-term memory</strong> is the conversation window itself: the longer the context it can hold, the more of the current conversation it can work with without forgetting. But that has a ceiling.
            </li>
            <li>
              <strong class="text-on-surface">Long-term memory</strong> is what gets stored and retrieved across sessions — notes, summaries, facts, preferences, logged results. The model doesn't carry it natively; something has to save it somewhere and retrieve it when relevant. But once that's wired up, the system starts to feel like something that <em>knows you</em> — that picks up where you left off, that doesn't need to be re-briefed.
            </li>
          </ul>
          <p>
            And here's where the definition of "agent" started to mean something more specific. A model with tools is impressive. A model with tools <em>and</em> memory is something you can build a workflow around. It's the difference between a smart contractor who shows up knowing nothing, and one who's worked with you before and has notes.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Step four: the loop (where "agent" becomes "agentic")</h2>
          <p>
            The step that mattered most wasn't any individual capability. It was the loop.
          </p>
          <p>
            Here's what I mean. Give a model a task. A simple model completes one step and stops — it answers your question, it drafts your email, it finds the search result. You read it, you react, you ask the next question. You are the loop.
          </p>
          <p>
            An agentic system doesn't wait for you between steps. It can:
          </p>
          <ol class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px; list-style-type: decimal; padding-left: 20px;">
            <li style="margin-bottom: 8px;">
              <strong class="text-on-surface">Plan</strong> — break the task into sub-steps on its own
            </li>
            <li style="margin-bottom: 8px;">
              <strong class="text-on-surface">Act</strong> — execute a step using a tool or a sub-agent
            </li>
            <li style="margin-bottom: 8px;">
              <strong class="text-on-surface">Observe</strong> — check the result of that step
            </li>
            <li style="margin-bottom: 8px;">
              <strong class="text-on-surface">Decide</strong> — use that result to determine the next step
            </li>
            <li style="margin-bottom: 8px;">
              <strong class="text-on-surface">Self-validate</strong> — check its own output before handing it back to you
            </li>
          </ol>
          <p>
            And it can call other agents — smaller, specialised models — for particular sub-tasks. A research sub-agent. A writing sub-agent. A code-checking sub-agent. The orchestrating agent doesn't have to do everything; it has to know what to delegate and when.
          </p>
          <p>
            That loop — plan &rarr; act &rarr; observe &rarr; decide, with memory across steps and validation before output — is what "agentic" actually means. Not just a model that can use a calculator. A system that can run a multi-step task, without you holding its hand through every step, and catch its own mistakes before you see them.
          </p>
          <p>
            When I first saw this working in a real context — not a demo, a live system doing a task I would have had to do myself — it stopped feeling like autocomplete at scale and started feeling like something categorically different.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The spectrum, not the switch</h2>
          <p>
            Here's the mistake I'd made for too long: I thought "agent" was a switch. Either the AI is just a chatbot, or it's an agent. Either it's dumb or it's smart.
          </p>
          <p>
            It's a spectrum. And most things people confidently call "agents" are still much closer to the left end than they think. A tool-calling LLM with no memory and no loop is at one end. A fully orchestrating agentic system with sub-agents, persistent memory, and a self-validation step is at the other. Everything in the real world is somewhere in between.
          </p>
          <p>
            Knowing where something sits on that spectrum is the thing I wish I'd understood earlier. Because once you know where you are, you know what the current system <em>can't</em> do, you know what you'd need to add to get to the next step, and you stop being either dismissive ("it's just autocomplete") or credulous ("it can do anything").
          </p>
          <p>
            The steps are:
          </p>
          <ul class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px;">
            <li>
              <strong class="text-on-surface">1. LLM</strong> — predicts text, nothing more. Frozen knowledge, no actions, no memory.
            </li>
            <li>
              <strong class="text-on-surface">2. LLM + tools / RAG</strong> — can reach outside its training data, execute actions, fetch live information.
            </li>
            <li>
              <strong class="text-on-surface">3. LLM + tools + memory</strong> — can build context over time, doesn't cold-start every session.
            </li>
            <li>
              <strong class="text-on-surface">4. Agentic system</strong> — plans, acts, observes, decides, delegates to sub-agents, validates its own output. The loop is the thing.
            </li>
          </ul>
          <p>
            Each step doesn't replace the last — it builds on it. You can't have a meaningful agentic loop without tools. You can't build durable workflows without memory. The evolution was additive.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What this means practically</h2>
          <p>
            I'm building in this space now — which is why this is the first post in this topic. Every post that follows is going to be about something real: a system I tried to build, a place it broke, a pattern I found.
          </p>
          <p>
            But before any of that: this map. Because "AI agent" means nothing without it. When someone tells you they've built an AI agent, the first question now isn't "what does it do" — it's "where does it sit on the spectrum?" Does it have memory? Does it loop? Does it self-validate? Is it orchestrating sub-agents or just chaining two API calls?
          </p>
          <p>
            The honest answer to those questions tells you more than the demo will.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What I'd do now</h2>
          <p>
            Before I touch any AI tooling, I sketch where on the spectrum I actually need to be for the task. Most things don't need the full agentic loop — and building the loop when you only need tool access is like buying a crane to hang a picture frame. Map the task, find the minimum-viable level of the spectrum, build there, and only add the next layer when the current one genuinely isn't enough.
          </p>
          <p>
            The one thing I'd tell someone starting today: learn the steps separately before you combine them. Understand what an LLM is doing when it predicts text. Understand what changes when you add a tool. Understand what changes when you add memory. Then understand the loop. Each step has its own failure modes — and if you've skipped the step, you won't recognise the failure when it happens.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Why I'm sharing this</h2>
          <p>
            I've been an avid user of AI since 2022 — starting with ChatGPT as a conversation partner, something that felt like talking to real intelligence for the first time. By 2026 I can't imagine my daily work without it: writing emails, building RAG pipelines, MCP servers, agent orchestration, internal tools, training material, documentation. I'm not exaggerating when I say it's woven into how I work — though if it disappeared tomorrow, I'd need a week to recalibrate, not an afternoon. I'm writing this as both an avid user and an avid tinkerer on top of LLMs — someone who has watched the thing change from the inside, one layer at a time. That's the journey I want to document here.
          </p>
        </div>

        <!-- Next/Prev Navigation -->
        <nav class="flex flex-col sm:flex-row justify-between gap-6 border-t border-outline-variant pt-stack-sm mt-stack-lg">
          <a class="flex-1 group text-left flex flex-col gap-2" href="/learnings/migration/it-is-not-a-copy-paste">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px;">&larr; Previous</span>
            <span class="font-body-lg text-on-surface group-hover:text-primary transition-colors">Migration 101: it's not a copy-paste</span>
          </a>
          <div class="flex-1 text-left sm:text-right flex flex-col gap-2">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px; opacity: 0.5;">Next &rarr;</span>
            <span class="font-body-lg text-on-surface-variant" style="font-size: 16px;">More coming soon</span>
          </div>
        </nav>
      </article>

    </div>
  `;
}
