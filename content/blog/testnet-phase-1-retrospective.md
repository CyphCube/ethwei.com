---
title: "Testnet Phase 1 Retrospective: The Bugs We Found Before Mainnet Did"
seoTitle: "Testnet Phase 1 Retrospective: Bugs We Found"
date: 2026-08-04
category: "Engineering"
image: "/blog/testnet-phase-1-retrospective.jpg"
summary: "Ethwei's first testnet ran for five weeks without an unplanned halt. That's not the interesting part. The interesting part is the four problems it surfaced — a governance bypass, a supply-cap gap, and a slashing accident — and why we removed code instead of adding more to fix them."
description: "Ethwei's testnet ran five weeks without a halt — but the real story is four bugs we found: a governance bypass, a supply-cap gap, and a slashing accident."
---

Ethwei's first testnet, `ethwei-testnet-1`, ran for about five weeks — 29 June to 4 August 2026 — and reached a final height of 621,526 blocks at roughly five seconds per block, with zero unplanned halts. Final supply closed at 6,999,827,484 ETE.

That uptime number is not really the point of this post. Anyone can run a chain for five weeks without it falling over. The more useful question is what breaks when you actually try to use the thing the way it's meant to be used — and whether you find that out now, on a testnet, or later, on mainnet, with real value on the line.

We found four real problems. All four are fixed. This is what they were.

## What was proven

Before getting to what broke, it's worth being clear about what the testnet was actually testing:

- **Fixed-emission proof-of-stake economics** ran continuously for five weeks without drift, under the tokenomics being tested for Phase 1: 7B genesis supply, a 10B hard cap, a fixed emission of 100M ETE/year (~15.84 ETE per block) scheduled over 30 years, and 0% community tax — every staking reward goes to stakers, none held back.
- **Multi-validator consensus** — a second validator, CyphCube-2, joined the live chain from block 0, synced roughly 138,000 blocks, and was later decommissioned and removed cleanly.
- **Governance end-to-end** — six proposals were submitted, all six passed, and the resulting parameter changes auto-executed on-chain with no manual intervention.
- **Slashing, jailing, and token burning** were verified empirically, not just reasoned about on paper (more on this below).
- **The full public stack held up** — HTTPS RPC/API, a branded block explorer, Keplr wallet integration.
- **Infrastructure separation was deliberate** — the validator machine runs only the node. The explorer, docs, and this site are all hosted separately.

That's the baseline. Here's what actually mattered.

## 1. A governance bypass (high severity)

Ethwei's testnet originally enforced two custom governance rules: only validators could submit proposals, and the `NoWithVeto` vote option was disabled.

A security review found that both restrictions could be circumvented entirely — through Cosmos's legacy governance API and through weighted votes, neither of which respected the custom rule. This wasn't theoretical. It was confirmed exploitable on the live testnet, then fixed.

Custom rules bolted onto a battle-tested framework are exactly the kind of thing that looks fine until someone checks the seams.

## 2. The decision that followed

The fix wasn't a patch. Ethwei removed its custom governance code entirely and reverted to stock, unmodified Cosmos governance — with spam deterred the standard way, economically, via a proposal deposit, instead of a custom permission check.

Custom governance attack surface went from "two bypassable rules" to zero, because there's no custom logic left to bypass. Maintaining a bespoke rule forever, patch after patch, was the more clever option. Removing it was the simpler one. We took simpler.

## 3. The supply cap could have been breached (high severity)

The emission module tracked how much it had minted using an internal counter. That counter was not preserved across a genesis export/import — the standard mechanism behind many chain upgrades.

An upgrade could have silently reset that counter and re-minted the entire staking reserve from scratch, breaking the 10B hard cap without any single transaction looking wrong. The fix was to stop trusting the counter: the cap is now enforced against the chain's actual on-chain supply, so it holds regardless of what any internal counter thinks happened.

## 4. The slashing accident (the best story)

When CyphCube-2 was decommissioned, it went offline — and was jailed and slashed 1% after only about four minutes downtime. That's 10,020,000 ETE, hitting every delegator to that validator proportionally.

The investigation traced this to something simpler than a bug: Ethwei was running Cosmos SDK's raw default slashing parameters — a 100-block signing window (about four minutes of grace) with a 1% downtime penalty. On mainnet, that configuration means a routine server reboot or a slow software upgrade — not an attack, just ordinary operations — would slash every delegator behind that validator.

The fix had two parts. First, the signing window widened from 100 blocks to 10,000, and the downtime penalty dropped from 1% to 0.01%. Then, on further review, the posture was relaxed again to match Cosmos Hub's own settings — only 5% of blocks in the window need to be signed — taking the grace period from roughly four minutes to about 13 hours.

Double-sign slashing stays untouched at 5%. Going offline is an accident. Signing two different blocks at the same height is an attack. They shouldn't be punished the same way, and now they aren't.

## A verifiable-supply moment, as a side effect

That same slash gave us a clean way to confirm something that's easy to claim and harder to prove: burned ETE is actually destroyed, not redistributed to anyone.

Total supply dropped by exactly 10,020,000 ETE — matching the slash down to the token. Because of it, the testnet actually ended with *less* ETE in existence than it started with: cumulative burns outpaced everything emission had minted over the five weeks. Nobody captures value from a slash. It just leaves.

## Design choices this validated

A few architectural decisions held up under the same five weeks of use:

- **No IBC, no bridges.** Deliberate independence, and one less category of attack surface to worry about.
- **Sixteen lean modules**, with five removed from the stock set (`nft`, `group`, `authz`, `feegrant`, `mint`) — less surface area for the same reason.
- **Emission constants are hardcoded**, not governance-adjustable, so no governance vote — however it's arrived at — can inflate supply beyond what's already fixed in code.
- **0% community tax.** Every staking reward goes to stakers, full stop.

## Being honest about what this wasn't

This was a controlled testnet, not a stress test, and it's worth being direct about the difference. It did not include external third-party validators, real users or real value at stake, adversarial conditions at any real scale, or an independent professional security audit. Those remain prerequisites before mainnet — this retrospective is not a substitute for any of them.

## What's next: Phase 2

Phase 2 will run on a brand-new testnet with revised tokenomics, built around a fair-launch principle rather than a large pre-mine.

Genesis supply drops from 70% of the max supply to 10% — 1B ETE — with the remaining 90% (9B ETE) earned by participants through staking over 30 years, at a fixed 300M ETE/year. Max supply stays at 10B.

The reasoning is straightforward: 70% of a token's total supply pre-mined to a single address is a weak fair-launch story, no matter how the tokenomics are framed around it. Having 90% of supply earned through participation, rather than pre-allocated before anyone else shows up, is closer to the principles Ethwei is actually built on.

A boring and simple blockchain is a good blockchain — but boring doesn't mean untested. It means testing hard enough, early enough, that nothing interesting happens when it counts.
