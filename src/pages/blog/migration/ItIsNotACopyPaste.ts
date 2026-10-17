export function renderItIsNotACopyPaste(): string {
  return `
    <div class="page-content-narrow">
      
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center; margin-bottom: var(--stack-sm);">
        <a class="hover:text-primary transition-colors" href="/learnings">Learnings</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <a class="hover:text-primary transition-colors" href="/learnings/migration">Migration</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <span class="text-on-surface">Migration 101</span>
      </nav>

      <!-- Article Header -->
      <article class="editorial-prose">
        <header class="mb-stack-lg flex flex-col gap-4">
          <div class="flex items-center gap-4 text-on-surface-variant font-label-caps" style="font-size: 11px; flex-wrap: wrap;">
            <span>Migration</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>Jun 22, 2026</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>6 min read</span>
          </div>
          
          <h1 class="font-headline-xl text-on-surface">
            Migration 101: it's not a copy-paste
          </h1>
          
          <p class="font-body-lg text-on-surface-variant italic quote-block" style="padding-left: 24px; border-left: 2px solid var(--color-primary);">
            A data migration isn't moving files from one box to another — it's <em>rebuilding</em> your data inside a new system that disagrees with the old one about almost everything. It happens once, under a deadline, and you usually can't take it back. So the real job isn't the moving. It's reshaping the data to fit, and proving it actually landed right.
          </p>
        </header>

        <!-- Featured Image -->
        <div class="w-full mb-stack-lg border border-outline-variant relative bg-surface-container-high flex items-center justify-center overflow-hidden" style="height: 384px;">
          <img src="/images/migration_translation.png" alt="Editorial illustration showing data structure being translated and rebuilt with a tracking identifier link" class="w-full h-full object-cover opacity-80" style="mix-blend-mode: multiply;">
        </div>

        <!-- Body Content -->
        <div class="font-body-lg text-on-surface flex flex-col gap-6 leading-relaxed">
          <h2 class="font-headline-md text-on-surface mt-stack-sm">A small moment first</h2>
          <p>
            The first real migration I ran felt like the safest task on the list. The old system had the data; the new one needed it; my job was to carry it across. I exported, I imported, the totals matched, everyone moved on. It was only later — when someone went looking for a record that should have been there — that I learned "the totals matched" and "the data is correct" are two completely different claims.
          </p>
          <p>
            That gap is the whole topic. So let me map the thing first, then spend the rest of the post on the part that gap lives in.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Why "copy-paste" is the wrong picture</h2>
          <p>
            When people hear <em>migration</em> they picture copying a folder: same files, new location, done. That picture is what gets migrations into trouble, because a migration is almost never a copy. It's a <strong>translation</strong>.
          </p>
          <p>
            The old system and the new system were built by different people, at different times, with different ideas about how the world is shaped. They store the same customer differently. They allow things the other forbids. They mean different things by the word "required." Moving the data means re-expressing it in the new system's terms — and that's an act of rewriting, not copying.
          </p>
          <p>
            Two more things make it harder than a copy, and they're the reason it deserves real care:
          </p>
          <ul class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px;">
            <li>
              <strong class="text-on-surface">It's a one-shot, high-stakes event.</strong> An integration runs every day; if one sync is wrong you fix it and the next run is fine. A migration usually happens <em>once</em>, on a cutover date, often with the old system getting switched off behind it. Get it wrong and there isn't a clean "next run."
            </li>
            <li>
              <strong class="text-on-surface">"It ran" doesn't mean "it's right."</strong> A migration can finish with zero errors and still be quietly broken — records dropped, relationships severed, values subtly mangled. Nothing turns red. That's the dangerous part.
            </li>
          </ul>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The shape of every migration</h2>
          <p>
            Strip away the jargon and every migration is three steps:
          </p>
          <p>
            <strong>Extract</strong> — pull the data out of the old system. (Read everything you're carrying across.)
          </p>
          <p>
            <strong>Reshape</strong> — rewrite it to fit the new system: its fields, its rules, its model of the world. This is the translation, and it's where the work is.
          </p>
          <p>
            <strong>Load</strong> — put the reshaped data into the new system. (Write it in.)
          </p>
          <p>
            Picture it left to right: pull it out, rewrite it to fit, put it in. People expect extract and load to be the hard parts. They're the easy parts. The middle — and a fourth step almost everyone skips — is where migrations are won or lost.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Extract and load: real, but mostly solved</h2>
          <p>
            Pulling data out of the old system and pushing it into the new one is genuine work, but it's <em>generic</em> work. Each system has an export, an import, an API — and each one documents its own. The old tool's export is not the new tool's import, but they both exist and the steps are written down for you. Change the systems and this part changes, and you follow their docs and move on.
          </p>
          <p>
            There's little for me to teach here that the vendor hasn't already written better. The interesting part is the middle.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">Reshape: where the translation happens</h2>
          <p>
            Reshaping is taking what the old system gave you and making it true in the new system. If you've read the integration posts, the moves will feel familiar — mapping fields, converting types, handling the values that don't fit. The shapes are the same. What's different in a migration is the <em>stakes and the once-ness</em>: you don't get to be sloppy and fix it tomorrow, because there often is no tomorrow for this data.
          </p>
          <p>
            A few things bite migrations specifically:
          </p>
          <ul class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px;">
            <li>
              <strong class="text-on-surface">The new system is stricter than the old one.</strong> Old systems accumulate junk: blank required fields, two formats for the same phone number, a "country" field with forty spellings of "USA." The old system tolerated it for years. The new system, set up clean, rejects it on import — and now you're cleaning a decade of mess against a cutover deadline. The data you're moving is older and dirtier than you think.
            </li>
            <li>
              <strong class="text-on-surface">Relationships are the part that silently breaks.</strong> A single record is easy. The hard part is the <em>links</em> between them — this contact belongs to that company; this order belongs to that customer. Migrate the records but lose the links, and every individual row is technically present while the thing they formed together is gone. The counts still match. The meaning doesn't.
            </li>
            <li>
              <strong class="text-on-surface">History and "who/when" rarely survive.</strong> Created dates, the original owner, the audit trail — the new system wants to stamp everything with today and with you. Decide on purpose what history you carry across, because the default is to quietly lose it.
            </li>
            <li>
              <strong class="text-on-surface">Same value, new model.</strong> The old system had one "Status" field; the new one splits it into "Stage" and "Status." Or the old free-text field has to become a fixed dropdown. Reshaping isn't always one-field-to-one-field — sometimes you're deciding how an old idea even <em>exists</em> in the new world.
            </li>
          </ul>
          <p>
            There's one more thing to do during reshape that costs almost nothing and saves the whole verify step. Carry the old record's ID across with it.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The golden rule: carry the source's ID across</h2>
          <p>
            Every record in the old system has an identifier — a unique ID the source uses to mean "this exact record, and no other." When you reshape a record, <strong>bring that ID with it</strong> and store it in a field on the destination, something like <span class="inline-code">legacy_id</span> or <span class="inline-code">source_id</span>. You're not using it as the new system's own ID; you're keeping it as a tag that says <em>"this row came from that row over there."</em>
          </p>
          <p>
            It costs you one extra field and one line in the mapping. In return it gives you the one thing a migration otherwise doesn't have: a way to point at a record on each side and know, for certain, that they're the same record. That's the hook the entire verify step hangs on — which is why I call it the golden rule. Do this and verifying becomes fast and exact. Skip it and you're left guessing with counts.
          </p>
          <p>
            None of this is exotic. It's the honest admission that the two systems were never going to line up, and reshaping is where you absorb the difference — deliberately, with a decision for every messy case, not just the clean ones.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The fourth step nobody puts on the diagram: verify</h2>
          <p>
            Here's the step that separates a migration that <em>ran</em> from one that's <em>right</em>: after you load, you prove it landed correctly — <strong>before</strong> you switch the old system off.
          </p>
          <p>
            This is the part people skip, because the import said "success" and success feels like done. It isn't. But <em>how</em> you verify matters as much as that you do — because there are two obvious ways to check, and both are bad.
          </p>
          <p>
            <strong>Counting is too vague.</strong> "The old system had 10,000 records and the new one has 10,000" feels like proof, and it's almost worthless. A matching total can hide an equal number of duplicates created and originals dropped — 500 lost, 500 doubled, total unchanged. Counts can only ever tell you the <em>quantity</em> looks right, never that the <em>right records</em> are the ones that made it.
          </p>
          <p>
            <strong>Comparing every value of every record is too slow.</strong> The opposite extreme — open every record on both sides and check every field matches — is genuinely thorough and almost never practical. On any real dataset it takes forever and you'll never actually finish it before the cutover.
          </p>
          <p>
            The golden rule gives you the middle path that's both fast and exact. Because every destination record now carries its <span class="inline-code">source_id</span>, you can verify <em>existence</em> cheaply and completely:
          </p>
          <ul class="custom-list font-body-md text-on-surface-variant" style="margin-top: -8px; margin-bottom: 8px;">
            <li>
              <strong class="text-on-surface">Check the IDs, not the values.</strong> Take the full list of source IDs from the old system and confirm each one is present in the destination's <span class="inline-code">source_id</span> field. This is a fast, complete check — it covers <em>every</em> record, not a sample — and it answers the question counts can't: did <em>these specific records</em> make it across, or did something quietly drop and something else quietly duplicate? Any source ID missing on the other side is a dropped record. Any source ID showing up twice is a duplicate. The discrepancy isn't hidden in a total anymore — it's named.
            </li>
            <li>
              <strong class="text-on-surface">Let reshape own correctness.</strong> You don't need to re-check every value at verify time, because <em>that's reshape's job.</em> If the reshape rules are right, the values are right by construction — you proved the transformation once, for the field, instead of re-proving it ten thousand times, for each record. Verify confirms the records <em>arrived</em>; reshape already guaranteed they arrived <em>correct</em>.
            </li>
            <li>
              <strong class="text-on-surface">Then a handful of records by hand.</strong> Finish with a small, deliberate spot-check: open ten or so real records you know — including the ugly ones from reshape, the blank fields and the orphaned links — and look at them whole in the new system. This is the human sanity check that catches a reshape rule you got wrong. A few records, looked at properly, not all of them skimmed.
            </li>
          </ul>
          <p>
            So: IDs prove <em>everything arrived</em>, reshape proves <em>it's correct</em>, and a few hand-picked records prove <em>you didn't fool yourself</em>. Fast, complete, and honest — without the impossible task of comparing every value.
          </p>

          <blockquote class="my-stack-md quote-block font-quote text-on-surface">
            "Don't verify a migration by counting records or by comparing every value. Carry the source's ID into every destination record, then check those IDs all arrived. Reshape guarantees the values; the IDs guarantee the records; a handful checked by hand keeps you honest."
          </blockquote>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What "basic" actually means</h2>
          <p>
            So a <em>basic</em> migration — the 101 version — is four steps, not three:
          </p>
          <p>
            1. <strong>Extract:</strong> read the data out of the old system (follow its docs for the export or API).<br>
            2. <strong>Reshape:</strong> rewrite it to fit the new system's fields, rules, and model — handling the dirty data, the relationships, and the history on purpose, not by default — and carry each record's <strong>source ID</strong> across (the golden rule).<br>
            3. <strong>Load:</strong> write it into the new system (again, follow that platform's docs).<br>
            4. <strong>Verify:</strong> check that every <strong>source ID</strong> made it across (fast and complete), trust reshape for value correctness, and hand-check a handful of real records — all before you retire the old system.
          </p>
          <p>
            Get reshape and verify right and the migration genuinely holds. The concept is small once you stop picturing a copy and start respecting the translation.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What this post is deliberately <em>not</em> covering</h2>
          <p>
            The basic version above is the shape, not the full playbook.
          </p>
          <p>
            The moment a migration is real and large, more shows up: you can't move millions of records in one go, so you do it in batches; you don't trust the cutover blind, so you do a full <em>dry run</em> against a copy first; you plan how to roll back if the cutover goes wrong; you keep the old system readable for a while as a safety net. Each of those deserves its own post, and I'll link them here as I write them — starting with the one that matters most: you never migrate once.
          </p>
          <p>
            For how this differs from an <em>ongoing</em> sync — a migration happens once, an integration runs forever — see <a href="#/learnings/integration/bridge-is-the-whole-job">Integration 101: the bridge is the whole job</a>. Confusing the two is its own kind of expensive mistake.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What I'd do now</h2>
          <p>
            Before I extract anything, I write down two things on one page. First, the <strong>reshape plan</strong>: for every field, what it becomes in the new system, what I'll do with the records that don't fit — and the <span class="inline-code">source_id</span> field that rides along on every record. Second, the <strong>verification plan</strong>: the source-ID check that proves everything arrived, plus the specific real records I'll open by hand. I write the verification plan <em>before</em> the migration, on purpose, so "looks done" can't talk me out of it on the day. And I never let the source ID get dropped in reshape — it's one field, and it's the difference between verifying in minutes and guessing with counts.
          </p>
          <p>
            If you take one thing from this: a migration isn't moving data, it's rebuilding it somewhere new — and it isn't finished when it runs, it's finished when you've proven it's right.
          </p>
          
          <h2 class="font-headline-md text-on-surface mt-stack-md">Why I'm sharing this</h2>
          <p>
            I've carried data between systems enough times to have learned the hard way that the scary part isn't the moving — it's everything that fails without making a sound. The migrations that taught me most are the ones that "succeeded" and were wrong, and I only found out later. I'm writing it down for the people a few steps behind me, who are about to trust a green checkmark — and for the ones ahead, who can tell me what I'm still getting wrong.
          </p>
        </div>

        <!-- Next/Prev Navigation -->
        <nav class="flex flex-col sm:flex-row justify-between gap-6 border-t border-outline-variant pt-stack-sm mt-stack-lg">
          <a class="flex-1 group text-left flex flex-col gap-2" href="/learnings/integration/the-hidden-cost-of-brittle-webhooks">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px;">&larr; Previous in Integration</span>
            <span class="font-body-lg text-on-surface group-hover:text-primary transition-colors">The Hidden Cost of Brittle Webhooks</span>
          </a>
          <a class="flex-1 group text-left sm:text-right flex flex-col gap-2" href="/learnings/agentic-ai/from-autocomplete-to-agent">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px;">Next &rarr;</span>
            <span class="font-body-lg text-on-surface group-hover:text-primary transition-colors">From autocomplete to agent: how AI actually got useful</span>
          </a>
        </nav>
      </article>

    </div>
  `;
}
