# CreditSea — Mandatory Preset & Component Source Verification Matrix

> **Compliance**: Strict Implementation Verification Protocol  
> **Repository**: [lms-creditsea](https://github.com/vivekVerma2806/lms-creditsea.git)  
> **Audit Date**: 2026-10-01  
> **Status**: Verified in Workspace Source Code

This document provides code-level proof of every UI component, motion primitive, animation, preset, and visual asset integrated into the CreditSea application from the designated 27 source libraries.

---

## 1. Presets & Components Registry

### PRESET 1: NumberTicker
- **SOURCE**: magicui.design / 21st.dev
- **COMPONENT / PRESET NAME**: NumberTicker
- **SOURCE URL**: https://magicui.design/docs/components/number-ticker
- **CATEGORY**: Text Animation / Financial Telemetry
- **PURPOSE**: Smooth spring-physics tabular numeral counter for institutional monetary metrics, loan amounts, and closure rates.
- **WHERE USED**: Landing Page KPI strip, Hero facility preview, Dashboard Executive KPIs, Editorial CTA.
- **PROJECT FILE**: `frontend/src/components/presets/NumberTicker.jsx`
- **IMPLEMENTATION METHOD**: Copied component source code from Magic UI registry and adapted to Indian numbering format (`en-IN` lakhs/crores).
- **DEPENDENCIES**: `framer-motion` (`useMotionValue`, `useSpring`, `useInView`)
- **ADAPTATIONS MADE**: Added INR prefix/suffix handling (`₹`, ` Cr+`), configurable decimal places, and monospace tabular layout.
- **CODE LOCATION**: Lines 9–57 in `frontend/src/components/presets/NumberTicker.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 2: BlurFade
- **SOURCE**: magicui.design / 21st.dev
- **COMPONENT / PRESET NAME**: BlurFade
- **SOURCE URL**: https://magicui.design/docs/components/blur-fade
- **CATEGORY**: Entrance Motion
- **PURPOSE**: Restrained physical entrance reveal with combined blur and subtle vertical displacement.
- **WHERE USED**: Landing Page sections, Hero Section, Dashboard KPI grid, 404 Page container.
- **PROJECT FILE**: `frontend/src/components/presets/BlurFade.jsx`
- **IMPLEMENTATION METHOD**: Copied source implementation from Magic UI component registry.
- **DEPENDENCIES**: `framer-motion` (`useInView`, `motion.div`)
- **ADAPTATIONS MADE**: Tuned cubic bezier curve to `[0.21, 0.47, 0.32, 0.98]` to eliminate bouncy SaaS physics in favor of a private banking feel.
- **CODE LOCATION**: Lines 9–48 in `frontend/src/components/presets/BlurFade.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 3: AnimatedList
- **SOURCE**: magicui.design / 21st.dev
- **COMPONENT / PRESET NAME**: AnimatedList & AnimatedListItem
- **SOURCE URL**: https://magicui.design/docs/components/animated-list
- **CATEGORY**: Dashboard & Feed Component
- **PURPOSE**: Real-time simulated arrival animation for underwriting telemetry feeds and ledger transactions.
- **WHERE USED**: Executive Command Dashboard (`DashboardHome.jsx`) under "Real-Time Disbursal & Settlement Stream".
- **PROJECT FILE**: `frontend/src/components/presets/AnimatedList.jsx`
- **IMPLEMENTATION METHOD**: Direct component implementation with Framer Motion spring physics.
- **DEPENDENCIES**: `framer-motion` (`AnimatePresence`, `motion.div`)
- **ADAPTATIONS MADE**: Restyled arrival cards with obsidian/ivory borders and localized transaction descriptors.
- **CODE LOCATION**: Lines 9–56 in `frontend/src/components/presets/AnimatedList.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 4: ShimmerButton
- **SOURCE**: magicui.design / 21st.dev / gradientbuttons.colorion.co
- **COMPONENT / PRESET NAME**: ShimmerButton
- **SOURCE URL**: https://magicui.design/docs/components/shimmer-button
- **CATEGORY**: Button Interaction / CTA
- **PURPOSE**: Restrained champagne-gold border perimeter highlight for primary institutional actions without flashy backgrounds.
- **WHERE USED**: Hero Section CTA, Editorial CTA, Underwriting Verification triggers.
- **PROJECT FILE**: `frontend/src/components/presets/ShimmerButton.jsx`
- **IMPLEMENTATION METHOD**: Implemented CSS container queries and conic gradient perimeter animation.
- **DEPENDENCIES**: React, Tailwind CSS
- **ADAPTATIONS MADE**: Replaced colorful SaaS gradients with champagne gold (`#B49A68`) on obsidian (`#111111`).
- **CODE LOCATION**: Lines 8–50 in `frontend/src/components/presets/ShimmerButton.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 5: CardSpotlight
- **SOURCE**: ui.aceternity.com / 21st.dev / glass.samasante.com
- **COMPONENT / PRESET NAME**: CardSpotlight
- **SOURCE URL**: https://ui.aceternity.com/components/card-spotlight
- **CATEGORY**: Micro-Interaction / Card Surface
- **PURPOSE**: Radial cursor-tracking spotlight overlay that illuminates institutional cards as the user hovers.
- **WHERE USED**: Landing Page Core Principles cards, Executive Dashboard KPI cards.
- **PROJECT FILE**: `frontend/src/components/presets/CardSpotlight.jsx`
- **IMPLEMENTATION METHOD**: Copied Aceternity UI radial cursor gradient algorithm using `useMotionValue` and `useMotionTemplate`.
- **DEPENDENCIES**: `framer-motion`
- **ADAPTATIONS MADE**: Tuned spotlight color to warm champagne gold (`rgba(180, 154, 104, 0.12)`) on `#FFFFFF` card surface.
- **CODE LOCATION**: Lines 9–47 in `frontend/src/components/presets/CardSpotlight.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 6: TextEffect
- **SOURCE**: motion-primitives.com / text-effects.colorion.co
- **COMPONENT / PRESET NAME**: TextEffect
- **SOURCE URL**: https://motion-primitives.com/docs/text-effect
- **CATEGORY**: Typography Animation
- **PURPOSE**: Staggered word-by-word entrance reveal for primary editorial headlines.
- **WHERE USED**: Hero Section headline (`"Credit structured with absolute clarity"`), Landing Page section headers.
- **PROJECT FILE**: `frontend/src/components/presets/TextEffect.jsx`
- **IMPLEMENTATION METHOD**: Implemented staggered word split container with restrained cubic-bezier transition curves.
- **DEPENDENCIES**: `framer-motion`
- **ADAPTATIONS MADE**: Removed bouncy spring overshoot; uses `[0.16, 1, 0.3, 1]` financial institution curve.
- **CODE LOCATION**: Lines 9–56 in `frontend/src/components/presets/TextEffect.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 7: ScrollReveal
- **SOURCE**: motion-primitives.com / kinetics.colorion.co
- **COMPONENT / PRESET NAME**: ScrollReveal
- **SOURCE URL**: https://motion-primitives.com/docs/in-view
- **CATEGORY**: Scroll-Driven Animation
- **PURPOSE**: Viewport entry detection and smooth upward entrance for critical content blocks as the user scrolls.
- **WHERE USED**: Landing Page Core Principles section, Facility Calculator section, Target Analytics.
- **PROJECT FILE**: `frontend/src/components/presets/ScrollReveal.jsx`
- **IMPLEMENTATION METHOD**: Copied InView viewport-trigger preset with configurable distance and direction.
- **DEPENDENCIES**: `framer-motion` (`useInView`, `motion.div`)
- **ADAPTATIONS MADE**: Subtle 24px travel with slight blur resolution on entry.
- **CODE LOCATION**: Lines 9–48 in `frontend/src/components/presets/ScrollReveal.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 8: InstitutionalGauge
- **SOURCE**: circleloaders.dominikakissi.com / microkit.co
- **COMPONENT / PRESET NAME**: InstitutionalGauge
- **SOURCE URL**: https://circleloaders.dominikakissi.com
- **CATEGORY**: SVG Progress / Financial Telemetry
- **PURPOSE**: Precision circular SVG meter displaying credit limit utilization and portfolio recovery rates.
- **WHERE USED**: LoanCalculator (Limit Utilization), DashboardHome (Recovery Ratio card), BorrowerDashboard.
- **PROJECT FILE**: `frontend/src/components/presets/InstitutionalGauge.jsx`
- **IMPLEMENTATION METHOD**: SVG geometric circle stroke dashoffset calculation.
- **DEPENDENCIES**: React
- **ADAPTATIONS MADE**: Champagne-gold active arc with warm ivory track (`#DDD9D0`) and tabular numeral readout.
- **CODE LOCATION**: Lines 8–69 in `frontend/src/components/presets/InstitutionalGauge.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 9: CircleLoader
- **SOURCE**: circleloaders.dominikakissi.com
- **COMPONENT / PRESET NAME**: CircleLoader
- **SOURCE URL**: https://circleloaders.dominikakissi.com
- **CATEGORY**: Loading Preset
- **PURPOSE**: Minimalist concentric dual-ring SVG spinner for underwriting queues and ledger fetching states.
- **WHERE USED**: BorrowerDashboard ledger loader, SanctionPortal queue loader, DisbursementPortal transfer loader.
- **PROJECT FILE**: `frontend/src/components/presets/CircleLoader.jsx`
- **IMPLEMENTATION METHOD**: Dual-circle SVG with CSS keyframe rotation and stroke dashoffset.
- **DEPENDENCIES**: React
- **ADAPTATIONS MADE**: Standardized color tokens (`#B49A68` active arc, `#DDD9D0` track) with monospace label.
- **CODE LOCATION**: Lines 8–56 in `frontend/src/components/presets/CircleLoader.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 10: Dialog (Modal)
- **SOURCE**: ui.shadcn.com / component.gallery
- **COMPONENT / PRESET NAME**: Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- **SOURCE URL**: https://ui.shadcn.com/docs/components/dialog
- **CATEGORY**: Primitives / Overlays
- **PURPOSE**: Accessible institutional modal dialog with escape key dismissal, backdrop blur, and focus trap.
- **WHERE USED**: DisbursementPortal escrow transfer authorization, BorrowerDashboard ledger/receipt modals.
- **PROJECT FILE**: `frontend/src/components/presets/Dialog.jsx`
- **IMPLEMENTATION METHOD**: Adapted shadcn dialog architecture into React + Framer Motion.
- **DEPENDENCIES**: `framer-motion`, `lucide-react`
- **ADAPTATIONS MADE**: Warm ivory backdrop blur (`bg-[#111111]/70 backdrop-blur-sm`) and obsidian action buttons.
- **CODE LOCATION**: Lines 8–80 in `frontend/src/components/presets/Dialog.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 11: Tabs
- **SOURCE**: ui.shadcn.com / component.gallery
- **COMPONENT / PRESET NAME**: Tabs
- **SOURCE URL**: https://ui.shadcn.com/docs/components/tabs
- **CATEGORY**: Navigation & Filtering Primitive
- **PURPOSE**: Segmented control bar with animated sliding active pill (`layoutId="activeTabBadge"`).
- **WHERE USED**: SanctionPortal employment filter, Target Analytics timeframes.
- **PROJECT FILE**: `frontend/src/components/presets/Tabs.jsx`
- **IMPLEMENTATION METHOD**: Framer Motion layoutId shared spring transition between tab buttons.
- **DEPENDENCIES**: `framer-motion`
- **ADAPTATIONS MADE**: Obsidian pill (`bg-[#111111]`) with gold count badge on ivory container.
- **CODE LOCATION**: Lines 8–60 in `frontend/src/components/presets/Tabs.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 12: Badge
- **SOURCE**: ui.shadcn.com / component.gallery
- **COMPONENT / PRESET NAME**: Badge
- **SOURCE URL**: https://ui.shadcn.com/docs/components/badge
- **CATEGORY**: Status Primitive
- **PURPOSE**: Standardized financial status pill with animated live pulse indicator dot.
- **WHERE USED**: BorrowerDashboard facility status, SanctionPortal KYC badges, DisbursementPortal status.
- **PROJECT FILE**: `frontend/src/components/presets/Badge.jsx`
- **IMPLEMENTATION METHOD**: Multi-variant functional component with strict color mapping.
- **DEPENDENCIES**: React
- **ADAPTATIONS MADE**: Strict adherence to CreditSea color tokens: `#476353` (Success), `#A17E43` (Pending), `#874F4F` (Danger), `#B49A68` (Gold).
- **CODE LOCATION**: Lines 8–52 in `frontend/src/components/presets/Badge.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 13: InteractiveToggle
- **SOURCE**: microkit.co / uiverse.io
- **COMPONENT / PRESET NAME**: InteractiveToggle
- **SOURCE URL**: https://uiverse.io/elements
- **CATEGORY**: Micro-Interaction / Form Switch
- **PURPOSE**: Tactile spring-animated toggle switch with accessible role attributes.
- **WHERE USED**: LoanCalculator (switching between Simple Interest and Daily Accrual view).
- **PROJECT FILE**: `frontend/src/components/presets/InteractiveToggle.jsx`
- **IMPLEMENTATION METHOD**: Framer Motion layout spring switch component.
- **DEPENDENCIES**: `framer-motion`
- **ADAPTATIONS MADE**: Champagne gold fill (`#B49A68`) on active state with smooth mechanical knob physics.
- **CODE LOCATION**: Lines 8–52 in `frontend/src/components/presets/InteractiveToggle.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 14: RegionalOriginationMap
- **SOURCE**: mapcn.dev / minimal.gallery
- **COMPONENT / PRESET NAME**: RegionalOriginationMap
- **SOURCE URL**: https://mapcn.dev
- **CATEGORY**: Data Visualization / Map Component
- **PURPOSE**: Minimalist vector nodal map of regional lending hubs and escrow liquidity across India.
- **WHERE USED**: SourceAnalytics and TargetAnalytics executive desks.
- **PROJECT FILE**: `frontend/src/components/presets/RegionalOriginationMap.jsx`
- **IMPLEMENTATION METHOD**: Vector SVG nodal path visualization with interactive hover cards.
- **DEPENDENCIES**: React, Lucide-react
- **ADAPTATIONS MADE**: Styled in warm ivory background with champagne gold hubs and obsidian telemetry badges.
- **CODE LOCATION**: Lines 8–180 in `frontend/src/components/presets/RegionalOriginationMap.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED

---

### PRESET 15: EditorialCTA
- **SOURCE**: cta.gallery / 21st.dev / minimal.gallery
- **COMPONENT / PRESET NAME**: EditorialCTA
- **SOURCE URL**: https://cta.gallery
- **CATEGORY**: High-Conversion Section
- **PURPOSE**: Architectural framed call-to-action block with live capital allocation ticker and NBFC disclosure.
- **WHERE USED**: LandingPage above the footer.
- **PROJECT FILE**: `frontend/src/components/presets/EditorialCTA.jsx`
- **IMPLEMENTATION METHOD**: Responsive grid card with ShimmerButton and NumberTicker integration.
- **DEPENDENCIES**: React, React Router, Lucide-react, NumberTicker, ShimmerButton
- **ADAPTATIONS MADE**: Obsidian architectural framing with `#B49A68` hairline grid backdrop.
- **CODE LOCATION**: Lines 9–75 in `frontend/src/components/presets/EditorialCTA.jsx`
- **STATUS**: IMPLEMENTED + VERIFIED
