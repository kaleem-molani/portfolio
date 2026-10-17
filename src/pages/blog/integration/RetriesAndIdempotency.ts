export function renderRetriesAndIdempotency(): string {
  return `
    <div class="page-content-narrow">
      
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center; margin-bottom: var(--stack-sm);">
        <a class="hover:text-primary transition-colors" href="/learnings">Learnings</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <a class="hover:text-primary transition-colors" href="/learnings/integration">Integration</a>
        <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
        <span class="text-on-surface">Retries & Idempotency</span>
      </nav>

      <!-- Article Header -->
      <article class="editorial-prose">
        <header class="mb-stack-lg flex flex-col gap-4">
          <div class="flex items-center gap-4 text-on-surface-variant font-label-caps" style="font-size: 11px; flex-wrap: wrap;">
            <span>Integration</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>Jun 22, 2026</span>
            <span class="w-1 h-1 bg-primary rounded-none" style="display: inline-block; width: 4px; height: 4px;"></span>
            <span>6 min read</span>
          </div>
          
          <h1 class="font-headline-xl text-on-surface">
            Retries and idempotency: how trying again quietly doubles everything
          </h1>
          
          <p class="font-body-lg text-on-surface-variant italic quote-block" style="padding-left: 24px; border-left: 2px solid var(--color-primary);">
            When a sync fails, the obvious fix is to try again. But a retry that isn't <em>safe to repeat</em> is how the same contact lands in your target system twice. The retry is the easy half. The half that actually matters — <strong>idempotency</strong>: one record in the source stays one record in the target, no matter how many times the sync runs. Updates and deletes handle this for free; <em>create</em> is the one action that doesn't, and it's where all the duplicates come from.
          </p>
        </header>

        <!-- Featured Image -->
        <div class="w-full mb-stack-lg border border-outline-variant relative bg-surface-container-high flex items-center justify-center overflow-hidden" style="height: 384px;">
          <img src="/images/retries_idempotency.png" alt="Editorial illustration showing data duplicates resolving back to a single unique node" class="w-full h-full object-cover opacity-80" style="mix-blend-mode: multiply;">
        </div>

        <!-- Body Content -->
        <div class="font-body-lg text-on-surface flex flex-col gap-6 leading-relaxed">
          <h2 class="font-headline-md text-on-surface mt-stack-sm">The morning the contacts doubled</h2>
          <p>
            In the 101 post I got the bridge right and thought I was finished. The sync ran beautifully for weeks. Contacts flowed from the source into the target system, clean and mapped, exactly as designed. I stopped watching it.
          </p>
          <p>
            Then one morning someone on the team pinged me: <em>why are there two of every contact from yesterday?</em>
          </p>
          <p>
            I went looking, fully expecting to find something broken — a failed run, an error in the logs, a red mark somewhere. There was nothing. No error. No failure. The integration had done precisely what I'd built it to do. It had just done it twice. It’s a sinking feeling when you realize the system didn’t actually fail; it had executed a perfect creation twice, simply because I hadn't taught it how to remember its own history.
          </p>
          <p>
            To understand how a sync with no errors produces a pile of duplicates, I have to back up to a decision I'd made weeks earlier without thinking twice about it.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The fix that felt obviously right</h2>
          <p>
            When I first put the sync into the real world, it met the real world — and the real world fails in small, boring ways. The target system goes down for thirty seconds during a deploy. The network blips. A request times out waiting for an answer. None of that means your logic is wrong; it just means the other end wasn't ready <em>at that exact second</em>.
          </p>
          <p>
            So I did the obvious thing, the thing anyone would do. When a call failed, I made it <strong>retry</strong>. Wait a moment, try again. Still nothing? Wait a little longer, try once more. And honestly, it worked — most of the time the target came back on the second attempt, the contact landed, and nobody ever knew there'd been a hiccup.
          </p>
          <p>
            Retrying felt complete. Failed? Try again. I genuinely couldn't see what could go wrong with that. The duplicates were about to show me.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The blip that wasn't what it looked like</h2>
          <p>
            Here's what had actually happened the night the contacts doubled.
          </p>
          <p>
            The sync sent "create this contact" to the target system. The target received it, created the contact, and started sending back its little "done, here you go" reply. And right then — in the half-second the reply was travelling back — the network blipped, and that reply vanished.
          </p>
          <p>
            Sit with what my side could see at that moment. I had sent a request. I had heard <em>nothing</em> back. From where I stood, that looks exactly, identically, like a real failure. There is no way to tell, from silence alone, whether the contact was never created or whether it was created and the confirmation just got lost on the way home.
          </p>
          <p>
            So my retry did its job faithfully. It sent "create this contact" again. And the target system — which already had that contact — shrugged and created a second one.
          </p>
          <p>
            The failure was never in the <em>doing</em>. The contact got created the first time, no problem. The failure was in the <em>knowing whether it was done</em>. My retry couldn't tell "it didn't happen" apart from "it happened but I didn't hear back" — and for anything that creates a record, those two situations need opposite responses. The feature I'd added to make the sync more reliable had quietly made it less correct.
          </p>

          <blockquote class="my-stack-md quote-block font-quote text-on-surface">
            "A retry assumes the first attempt did nothing. The moment that assumption is wrong, 'try again' becomes 'do it twice.'"
          </blockquote>

          <h2 class="font-headline-md text-on-surface mt-stack-md">The word that fixes it</h2>
          <p>
            The repair isn't to retry more cautiously. You can't out-clever the silence; you'll never reliably know whether the lost reply meant success or failure. The repair is to make the action not <em>care</em> how many times it runs. The word for that is <strong>idempotency</strong>, and under the long name is a genuinely simple idea:
          </p>
          
          <blockquote class="my-stack-md quote-block font-quote text-on-surface">
            "Doing it once and doing it five times land at the exact same result."
          </blockquote>
          
          <p>
            Flipping a switch to "on" is idempotent — flip it five times and the light is just on. Adding a new contact, the way I'd built it, was the opposite — do it five times and you get five contacts. Once I understood that, the duplicates stopped being mysterious. My action simply wasn't safe to repeat, and retries repeat.
          </p>
          <p>
            So I changed what "create this contact" meant. Instead of asking the target to <em>make a new contact</em> every time, I gave each contact a stable identity decided at the source — its email, in this case — and asked the target a different question: <em>do you already have the contact with this email? If yes, leave it; if no, create it.</em> Now the request could arrive once or five times and the answer was always the same single contact. The retry could fire as often as it liked and never make a mess.
          </p>
          <p>
            (That's the identity idea from the 101, turned up one level. There, two systems disagreed about what made a contact <em>unique</em> and records got dropped. Here, I handed the target a stable identity <em>on purpose</em>, so that a repeat could be recognized as a repeat instead of mistaken for a newcomer.)
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">A small detour, because "same result" can mislead you</h2>
          <p>
            There's a plain definition of idempotency floating around that's worth pausing on, because it nearly sent me the wrong way. It goes: <em>run the same function twice and you get the same result.</em> True in computing — but read it carelessly and you'll conclude my sync was already fine. After all, "create a new contact" run twice does give the same result <em>every time</em>: a new contact. Consistent. Identical behaviour. And in integration, completely wrong — because two identical "create" runs leave you with two contacts.
          </p>
          <p>
            That's the trap. The plain definition is about the <em>function</em> behaving consistently. Integration cares about the <em>world</em> ending up consistent. So it needs its own version of the rule, and it's blunt:
          </p>

          <blockquote class="my-stack-md quote-block font-quote text-on-surface">
            "One record in the source should be exactly one record in the target — no matter how many times the sync runs."
          </blockquote>

          <p>
            Once I held the rule that way, something useful fell out: the three things a sync actually does — create, update, delete — are not equally dangerous. They behave very differently when they run twice.
          </p>
          <p>
            <strong>Update is naturally safe.</strong> "Set this contact's phone number to X," run twice, just sets it to X twice. The second run changes nothing. No special handling needed — repeating an update lands you in the same place.
          </p>
          <p>
            <strong>Delete is safe too, with one polite catch.</strong> "Delete contact #4471," run twice — the first run deletes it; the second run finds nothing there and errors. But the <em>world</em> is identical either way: the contact is gone. So delete is idempotent as long as you catch that "already gone" error and treat it as success instead of a failure. (Which, conveniently, is also exactly what a retry needs.)
          </p>
          <p>
            <strong>Create is the only real troublemaker.</strong> Run "create this contact" twice and you either get two records, or — if the target enforces uniqueness — the second attempt fails outright and can take the whole sync down with it. Create is the one action where "run it again" is genuinely unsafe until you do something about it.
          </p>
          <p>
            So the entire weight of making a sync idempotent lands on <strong>create</strong>, and the fix is the rule above: on the second arrival, <em>check whether the record already exists — and if it does, update instead of create.</em> Same incoming request, one record in the target, every time.
          </p>
          <p>
            Where that check lives is a choice, not a coincidence. Sometimes the platform gives it to you — an "upsert" (update-or-insert) endpoint, or a unique key the target enforces — and idempotency is handled by <strong>platform design</strong>. When it doesn't, you build the check yourself in the bridge — look up by the stable identity first, then decide create-or-update — and it's handled by <strong>integration design</strong>. Either is fine. What's <em>not</em> fine is assuming it's handled when neither side actually does it. That assumption is precisely the gap my duplicate contacts fell through.
          </p>

          <h2 class="font-headline-md text-on-surface mt-stack-md">What I understand now that I didn't that morning</h2>
          <p>
            The order is the whole lesson, and I had it backwards.
          </p>
          <p>
            I'd built the retry first, because retrying is the obvious move, and discovered idempotency the hard way — through a colleague counting duplicate contacts. Built the other way around, there's no bad morning at all. First you make each action safe to repeat: give the thing a stable identity so the target can recognize "I've already got this one." <em>Then</em> you let retries run freely, with a short wait between attempts and a limit so they don't try forever. Once repeating is harmless, a retry costs nothing and saves you constantly.
          </p>
          <p>
            So now, before I add a single retry to anything, I ask one question of every action a sync performs: <em>if this runs twice, what happens?</em> For updates the answer is "nothing extra" — already safe. For deletes it's "an error I can swallow" — safe once I handle it. For creates it's "a duplicate contact" — and that's the one I fix first, by making sure something, the platform or my own bridge logic, checks-then-updates instead of blindly creating. The retry was never the dangerous bit. Running <em>create</em> twice was.
          </p>
          <p>
            I kept this to that one pair on purpose. How long to wait between attempts, what to do with a record that fails <em>every</em> time, how you even find out a sync misbehaved before a teammate does — each of those is its own story, and each one sits on top of this single idea: nothing else about reliability is safe to build until repeating an action is safe.
          </p>
        </div>

        <!-- Next/Prev Navigation -->
        <nav class="flex flex-col sm:flex-row justify-between gap-6 border-t border-outline-variant pt-stack-sm mt-stack-lg">
          <a class="flex-1 group text-left flex flex-col gap-2" href="/learnings/integration/bridge-is-the-whole-job">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px;">&larr; Previous</span>
            <span class="font-body-lg text-on-surface group-hover:text-primary transition-colors">Integration 101: the bridge is the whole job</span>
          </a>
          <a class="flex-1 group text-left sm:text-right flex flex-col gap-2" href="/learnings/integration/the-hidden-cost-of-brittle-webhooks">
            <span class="font-label-caps text-on-surface-variant" style="font-size: 11px;">Next in Integration &rarr;</span>
            <span class="font-body-lg text-on-surface group-hover:text-primary transition-colors">The Hidden Cost of Brittle Webhooks</span>
          </a>
        </nav>
      </article>

    </div>
  `;
}
