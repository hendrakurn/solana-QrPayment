# SolPay Design System (V1) — Style Guidelines

> Asset ID: `assets/b01afdb06ccc4490bc2f407339db2dad`
> Version: 1
> Source: MCP Stitch — `list_design_systems`

## Brand & Style

The design system is a modern, high-tech fintech environment that blends the efficiency of AI with the security of blockchain finance. It is built to bridge the gap between complex Web3 assets and the immediacy of retail payments.

The aesthetic direction follows a **Modern Dark-Mode** approach, drawing inspiration from high-performance utility apps like Shazam and the structured precision of Stripe. The interface evokes a sense of "intelligent speed"—minimizing cognitive load through a focus-first hierarchy where the primary payment action is the singular hero of the experience. The mood is professional, minimal, and secure, utilizing glowing accents and dark layered surfaces to create a premium, futuristic atmosphere suitable for the next generation of financial agents.

## Layout & Spacing

The layout philosophy is **Focus-First**, meaning the interface is built around a single primary action per screen. We use a dynamic padding system based on an 8px grid to ensure consistent alignment and rhythmic balance.

- **Primary Container:** Uses a 16px or 24px side margin to keep content centered and readable.
- **Vertical Rhythm:** Large 32px gaps are used to separate major functional blocks (e.g., the Scanner from the Navigation bar), while 8px-16px gaps are used for related elements within a card or list.
- **Touch Targets:** All interactive elements maintain a minimum hit area of 44px to ensure usability in fast-paced retail environments and on devices with varying screen sensitivities.

## Elevation & Depth

Depth in this system is communicated through **Tonal Layering** and **Luminous Accents** rather than traditional heavy shadows.

- **Surfaces:** The primary background is the darkest layer. Cards and modals sit one level above, using the secondary surface color.
- **Glow Effects:** The primary "Tap to Pay" action uses a blue outer glow (blur: 20px, opacity: 0.3) to simulate a physical light source, making it feel active and urgent.
- **Glassmorphism:** Subtle backdrop blurs are reserved for top-level navigation bars or temporary AI overlay prompts, maintaining a sense of place while focusing on the task at hand.

## Components

### Buttons
- **Primary Action:** Large, blue, rounded-xl buttons with a subtle glow effect. Text is uppercase or semibold for maximum prominence.
- **Secondary/Ghost:** Outlined or transparent buttons used for "Cancel" or "Settings" to maintain hierarchy.

### Cards
- **Wallet & History Cards:** Use the secondary surface color with a subtle 1px border. They are grouped by date or category with clear, high-contrast labels.

### Input Fields
- **Search & Amount Entry:** Minimal borders with large, clear typography. Amount inputs should feel "Hero-sized" to prevent payment errors.
- **Validation:** Instant visual feedback (green/red) for address validation or balance checks.

### Scanner Component
- **Viewfinder:** A central, glowing frame with a pulse animation to indicate it is active.
- **Feedback:** Haptic feedback and a visual "success transition" when a QR code is successfully captured.

### AI Assistant
- **Interface:** Floating action bubbles or bottom-sheet overlays that use the purple accent color to distinguish "Agent" suggestions from standard UI elements.
- **Loading:** Shimmering skeleton loaders are required for all AI-calculated data to manage perceived latency.
