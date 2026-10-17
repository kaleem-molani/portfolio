---
name: The Editorial Portfolio
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2eb'
  surface-container: '#f5ece5'
  surface-container-high: '#f0e7df'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#56423c'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#8a726b'
  outline-variant: '#ddc0b8'
  surface-tint: '#a0401f'
  primary: '#9d3d1c'
  on-primary: '#ffffff'
  primary-container: '#bd5532'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#576060'
  on-secondary: '#ffffff'
  secondary-container: '#d9e1e1'
  on-secondary-container: '#5c6464'
  tertiary: '#5c5c58'
  on-tertiary: '#ffffff'
  tertiary-container: '#747470'
  on-tertiary-container: '#fefcf7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#802908'
  secondary-fixed: '#dce4e4'
  secondary-fixed-dim: '#c0c8c8'
  on-secondary-fixed: '#151d1d'
  on-secondary-fixed-variant: '#404848'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Karla
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Karla
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Karla
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  quote:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  scale: 8px
  margin-desktop: 80px
  margin-mobile: 24px
  gutter: 32px
  container-max: 1120px
  stack-lg: 64px
  stack-md: 32px
  stack-sm: 16px
---

## Brand & Style
The design system is built on the narrative of "The Modern Intellectual"—an intersection of authoritative journalism and personal warmth. It rejects the cold sterility of corporate SaaS in favor of an **Editorial Minimalism** style. The aesthetic is "architected," where every element exists for a specific functional or hierarchical reason rather than decoration.

The target audience consists of peers, collaborators, and high-value clients who appreciate nuance, thought-leadership, and human-centric perspectives. The emotional response should be one of quiet confidence, reliability, and warmth, achieved through generous whitespace, deliberate asymmetrical layouts, and a focus on high-quality typography.

## Colors
This design system utilizes a palette grounded in organic, earthy tones to evoke the feeling of high-end print media.
- **Primary (Terracotta):** A muted, human accent used sparingly for calls to action, active states, and emphasis.
- **Secondary (Deep Ink):** Our primary text and structural color, providing high contrast against the background without the harshness of pure black.
- **Tertiary (Cream):** The foundation of the UI. This warm off-white provides a soft, readable canvas that feels more tactile than digital.
- **Neutral (Charcoal/Stone):** Used for secondary text, metadata, and subtle borders to maintain a sophisticated hierarchy.

## Typography
The typography is the core of this design system. We pair **Playfair Display**, a high-contrast transitional serif, with **Karla**, a quirky and accessible grotesque sans-serif. 

- **Headlines:** Use Playfair Display for all major headings to establish authority and an editorial "voice." Large headings should have slightly tighter letter-spacing to feel cohesive.
- **Body:** Use Karla for all long-form content. Its slightly irregular character shapes provide a human, approachable feel that aids legibility in dense text.
- **Micro-copy:** Use `label-caps` for eyebrows, categories, and tags to create a clear visual distinction from body text.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop, centered to create the feeling of a printed page. 

- **Grid:** A 12-column grid is used for complex layouts (like galleries or index pages), but a narrow 8-column center-aligned column is preferred for long-form essays to optimize line length.
- **Whitespace:** Use generous vertical spacing (`stack-lg`) between major sections to allow the content to "breathe" and signal a transition in thought.
- **Responsive:** On mobile, margins reduce to 24px, and the grid collapses to a single column. All typography scales to the defined mobile roles to maintain readability.

## Elevation & Depth
In keeping with the editorial theme, the design system avoids traditional drop shadows and skeuomorphism. 

- **Low-Contrast Outlines:** Instead of shadows, use thin (1px) borders in a slightly darker shade of the neutral color (`#E2E0D8`) to define containers.
- **Tonal Layers:** Depth is created by stacking slightly darker cream tones or the primary terracotta color in small blocks behind content to pull it forward.
- **Flat Surface:** All interactive elements remain flat. Depth is signaled through color changes (e.g., a button filling with the secondary color on hover) rather than physical elevation.

## Shapes
The shape language is strictly **Sharp**. Elements utilize 0px border radii to reinforce the architectural, structured feel of the design. This creates clean lines that align perfectly with the grid and the "straight" terminals of the Karla typeface. 

- **Image Treatment:** Photos should be rectangular and sharp. 
- **Dividers:** Use thin, full-bleed or container-width horizontal rules to separate sections, mimicking newspaper or journal layouts.

## Components
- **Buttons:** Rectangular with no radius. Primary buttons are solid `secondary_color` with white text. Secondary buttons are `primary_color` outlines with an arrow icon (→) to signify movement.
- **Cards:** Defined by a 1px border or a subtle tonal background. Typography inside cards should lead with an "eyebrow" label in `label-caps`.
- **Input Fields:** Minimalist. Only a bottom border (2px) in the neutral color, which turns to the primary terracotta on focus. Labels sit above the line in `label-caps`.
- **Lists:** Clean, using the Primary color for custom bullet points (small squares or dashes) rather than standard circles.
- **Quote Blocks:** Large Playfair Display text, centered or left-aligned, with a vertical terracotta bar on the left to indicate importance.
- **Chips/Tags:** Small, rectangular boxes with a light neutral background and `label-caps` text. No rounded corners.