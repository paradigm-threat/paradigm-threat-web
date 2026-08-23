# Agent instructions

Single entry point for assistants. **Site hooks / CleverScript** — minimal surface in this checkout.

---

## Git and go-live

Catalog repo **`paradigm-threat-web`** · branch **`release`** · publish origin **`iad1`**.

| Step | Action |
|------|--------|
| 1 | Checkout **`release`**. |
| 2 | **`git push iad1 HEAD:release`** first. |
| 3 | **`git push gitlab HEAD:release`**. |

**Related repos:** content in **paradigm-threat-files** and **paradigm-threat-timeline**; site shell in **paradigm-threat-site** (not in catalog). Agent hub for corpus work: [`../paradigm-threat-files/AGENTS.md`](../paradigm-threat-files/AGENTS.md).

*Last updated: 2026-08-23*
