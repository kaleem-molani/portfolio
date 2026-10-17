export function renderFooter(): string {
  return `
    <footer class="bg-surface-container-low border-t border-outline-variant mt-auto w-full">
      <div class="w-full px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start py-stack-lg gap-stack-md">
        <div class="flex flex-col gap-4">
          <div class="font-headline-md text-headline-md text-on-surface">
            Build · Break · Learn
          </div>
          <div class="font-body-md text-body-md text-on-surface-variant">
            © 2026 — Systems Builder & Learner. Built for clarity and human scale.
          </div>
        </div>
        
        <!-- Quick footer links -->

      </div>
    </footer>
  `;
}
