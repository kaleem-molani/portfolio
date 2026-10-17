export function renderAbout(): string {
  return `
    <div class="page-content">
      
      <!-- Top Section: Hero -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">

        <!-- Left: Heading + intro -->
        <div class="md:col-span-7 flex flex-col gap-stack-sm">
          <span class="font-label-caps text-primary">About</span>
          <h1 class="font-headline-xl text-on-surface">
            I'm Kaleem Molani.
          </h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl mt-4">
            I build software systems for a living — and I'm still learning to architect them well. This site is where I do that learning out loud.
          </p>
        </div>

        <!-- Right: At-a-glance info panel -->
        <div class="md:col-span-5 border border-outline-variant bg-surface-container-lowest p-8 flex flex-col gap-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>

          <div class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-3">
            At a glance
          </div>

          <div class="flex flex-col gap-stack-sm">

            <div class="flex flex-col gap-2">
              <span class="font-label-caps text-label-caps text-primary">Role</span>
              <span class="font-body-md text-on-surface">Tech Lead · Systems &amp; Integration</span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-label-caps text-label-caps text-primary">Based in</span>
              <span class="font-body-md text-on-surface">Jodhpur, Rajasthan, India</span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-label-caps text-label-caps text-primary">Currently studying</span>
              <span class="font-body-md text-on-surface">Rust · Ownership &amp; Memory Safety</span>
            </div>

            <div class="flex flex-col gap-2">
              <span class="font-label-caps text-label-caps text-primary">Domains</span>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Systems Design</span>
                <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Integrations</span>
                <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Agentic AI</span>
                <span class="px-3 py-1 bg-surface-container font-label-caps text-label-caps text-on-surface">Data Migration</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      <hr class="full-bleed">


      <!-- Body Content -->
      <article class="editorial-prose flex flex-col gap-stack-md">
        
        <section class="flex flex-col gap-4">
          <h2 class="font-headline-md text-on-surface">What I actually do</h2>
          <p class="font-body-md text-on-surface-variant">
            By day I'm a Tech Lead at a Noida-based software company. Most of my work lives in the unglamorous, important middle of things: connecting CRMs, moving companies off systems they've outgrown, wiring up integrations, and lately building AI agents that do useful work instead of just talking. The hard part is never the code — it's understanding the mess well enough to design something that survives contact with reality.
          </p>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-headline-md text-on-surface">Why I do this in the open</h2>
          <p class="font-body-md text-on-surface-variant">
            Honestly? Because I learn better when I have to explain myself. Writing something down forces me to actually understand it — and the half-finished, slightly-wrong version is usually more useful to someone a few steps behind me than a polished tutorial written years later. So I publish the learning as it happens: the wins, the dead ends, and the things I got embarrassingly wrong before they clicked.
          </p>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-headline-md text-on-surface">How I think</h2>
          <p class="font-body-md text-on-surface-variant mb-2">
            A few things I believe, that show up in everything I build:
          </p>
          <ul class="custom-list font-body-md text-on-surface-variant">
            <li>
              <strong class="text-on-surface" style="display: block; margin-bottom: 4px;">Systems before tactics.</strong>
              Most problems handed to me as a "quick fix" are system-design problems in disguise. Fix the system and the symptoms stop coming back.
            </li>
            <li>
              <strong class="text-on-surface" style="display: block; margin-bottom: 4px;">Model reality first.</strong>
              Get the underlying model right before automating anything — name things correctly, map how they actually relate. Automation on top of a wrong model just makes the wrong thing happen faster.
            </li>
            <li>
              <strong class="text-on-surface" style="display: block; margin-bottom: 4px;">Clarity is a deliverable.</strong>
              If I can't explain a design simply, I don't understand it yet. The spec, the diagram, the plain-English version — that's not overhead, it's the work.
            </li>
          </ul>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-headline-md text-on-surface">The rest of me</h2>
          <p class="font-body-md text-on-surface-variant">
            When I'm not doing that, I tinker with microcontrollers — ESP32s and the like — building small hardware gadgets for the pure fun of making something physical. I'm building an AI curriculum on the side. And I teach: my own team, and a couple of people one-on-one. I've come to think explaining things is just how my brain processes them — this site is the public version of that habit. I'm based in Jodhpur, in Rajasthan, India.
          </p>
        </section>
      </article>

      <!-- Closing Statement -->
      <section class="mt-stack-lg max-w-4xl mx-auto text-center border-box py-stack-md bg-surface-container-low px-margin-mobile relative overflow-hidden group">
        <div class="absolute top-0 left-0 w-1 h-full bg-primary" style="transform: scaleY(0); transform-origin: bottom; transition: transform 0.5s;"></div>
        <p class="font-quote text-on-surface">
          "That's the whole idea here: not a portfolio of finished things, but a notebook kept in the open. If you're a few steps behind me on any of this, I hope it saves you some time. If you're a few steps ahead — tell me what I'm getting wrong."
        </p>
      </section>

    </div>
  `;
}
