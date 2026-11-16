---
name: DEN Global — Blue Liquid Glass
description: One network. Every journey.
colors:
  primary: "#2875f5"
  action-start: "#2769df"
  action-end: "#1b5cda"
  accent: "#82b6ff"
  ground: "#050912"
  surface: "#101d32"
  ink: "#f5f8ff"
  muted: "#b6c8e2"
  line: "#3f587b"
typography:
  display:
    fontFamily: "DEN Space, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.03em"
    lineHeight: 1.15
  body:
    fontFamily: "DEN Inter, sans-serif"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  control: "12px"
  panel: "16px"
spacing:
  small: "8px"
  medium: "16px"
  large: "24px"
components:
  button-primary:
    backgroundColor: "linear-gradient(180deg, {colors.action-start}, {colors.action-end})"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "12px 20px"
---
# DEN Global

## Overview

**Creative North Star: "Blue Liquid Glass Network"**

The owner's 16 November 2026 reference, https://www.pinterest.com/pin/1053420169113254911/, supersedes the earlier green and amber identities. Adapt its blue liquid-glass marketplace to DEN's existing shopping, delivery and operational workflows. Cars and automotive claims in the reference are not DEN content. All nine workspaces share this system; dark-only appearance remains.

## Colors

Black-blue grounds, white text, cool blue secondary text, bright blue actions and blue-white glass edges. Semantic warnings and errors retain distinct colors and explicit text. Never recolor statuses as decorative brand accents.

## Typography

Self-hosted Inter for UI and Space Grotesk for headings and DEN. Desktop page headings 30–46px, phone 30px. Auth story 40–64px. At 780px and below, all input, select and textarea text uses 16px with an explicit override to avoid automatic iOS zoom. Keep tabular numerals in financial and operational data.

## Layout

224px desktop rail, 80px header, 36px content inset. At 780px and below, show a floating, horizontally scrollable bottom navigation with safe-area padding. Keep Wallet, Settings and Profile in the top action row. Preserve access to every existing destination. Use single-column working areas and internally scrolling wide tables. Main controls target 44px minimum; phone workspace links and manager filters also enforce a 44px minimum. Auth uses a desktop split and a compact stacked phone form. Installable web app metadata uses the same black-blue shell color.

## Elevation & Depth

Static blue reflective geometry behind the workspace replaces the shopping photo. Navigation and elevated panels use a restrained 18px backdrop blur and translucent navy with white-blue keylines. Working text remains opaque; input fields and drawers are nearly opaque. Avoid nested blur and continuous background animation. Reduced-transparency makes the explicitly listed surfaces opaque. General cards remain opaque without backdrop-filter support; directly declared translucent navigation and other surfaces retain alpha backgrounds without blur.

## Shapes

12px controls, 16px panels, 20px mobile navigation. Keep QR codes on white. Preserve map attribution and native map interactions.

## Components

Every workspace loads the shared stylesheet as a blocking head link before its app renders, so loading states use the same blue/black palette. The decorative renderer reuses that stylesheet and mounts once.

The original vector circuitry opening is inspired by https://www.pinterest.com/pin/913667843169225135/. It resolves to DEN Global, lasts 2.4 seconds, offers Skip intro, plays once per tab session, and is omitted for reduced motion. It does not depend on or delay API loading. Session storage suppresses replay on same-origin navigation and sign-in redirects in a tab session. If storage is unavailable, suppression lasts only within the current document.

Primary buttons render an action-start to action-end gradient; the primary token is the action-control base value. Buttons have distinct primary, secondary, disabled and keyboard focus states. Empty, pending and locked states retain real product copy. Pet care and role choice remain in Settings. The wallet keeps server-provided readiness and never implies unavailable funding or payouts are enabled.

## Do's and Don'ts

Preserve authentication, role permissions, business data, foreground GPS consent and stale labels, MapLibre/OpenFreeMap attribution, and existing feature locks. No invented inventory, ratings, metrics or ETAs. This UI release does not activate payments, apply pending migrations or unlock international bookings. Keep functional routes and product facts unchanged.
