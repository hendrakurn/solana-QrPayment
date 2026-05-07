# SolPay V2 Design System — Style Guidelines

> Asset ID: `assets/01acebda3c4942d09aaa98bdb44c6cc3`
> Version: 1
> Source: MCP Stitch — `list_design_systems`

## Brand & Style
The brand personality is defined by a fusion of institutional security and cutting-edge intelligence. It evokes a sense of "speed of light" transactions while maintaining a grounded, trustworthy atmosphere.

The design style is **Modern Dark-Mode** with heavy influences of **Glassmorphism** and **High-Contrast Accents**. This system utilizes deep, near-black voids as a canvas for vibrant, glowing interactive elements, drawing visual metaphors from high-end crypto wallets and AI-driven interfaces. The aesthetic is polished, sleek, and prioritizes focus through light-based hierarchy rather than physical borders.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for mobile-first interaction. A base-8 spacing scale ensures vertical rhythm and consistent density.

Margins are kept generous (20px) to provide a premium, airy feel that prevents the dark interface from feeling cramped. Elements should be grouped using logical proximity—related data points (like a currency symbol and an amount) use `xs` or `sm` spacing, while distinct sections use `md` or `lg` spacing.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Ambient Glows**.

- **Level 0 (Background):** The base layer (#000915).
- **Level 1 (Cards/Surfaces):** Slightly elevated (#1C1C1D) with a subtle 1px border of 10% white to define edges.
- **Level 2 (Modals/Popovers):** Higher elevation using soft, diffused shadows with a 0.15 opacity black blur.
- **Active State (Glow):** Primary action elements utilize a colored outer glow (drop shadow with high blur, matching the element's primary color at 30% opacity) to signify intelligence and "active" energy.

## Components

### Buttons
- **Primary:** Filled with the Action Blue (#0088FF), white text, and a signature blue glow effect.
- **Secondary:** Outlined or ghost style with high-contrast text.
- All buttons must feature large touch targets (min 48px height) and distinctive "pressed" states using subtle scale transforms.

### Cards
Cards are the primary container for data. They feature the Secondary Surface color, a soft 1px border, and no heavy shadows unless they are "floating." Content inside cards should be padded at `md` (24px) to ensure high readability.

### Input Fields
Inputs are minimal—removing heavy background fills in favor of a bottom-border or a very subtle dark fill. Focus states must be unmistakable, using the Action Blue for the border and a faint inner glow.

### Scanner
The central scanner is the hallmark of the interface. It should feature a continuous "pulse" animation using the accent colors, with a high-transparency blur (Glassmorphism) inside the scan-zone to maintain focus on the real-world target.

### Chips & Tags
Used for transaction status (e.g., "Pending," "Complete"). These utilize low-opacity versions of the semantic colors (Success Green, Warning Gold, Error Red) with high-contrast text labels.
