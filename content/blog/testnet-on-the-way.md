---
title: "Testnet Is on the Way — Build on Cosmos SDK"
date: 2026-06-10
category: "Engineering"
summary: "Our public testnet is approaching. Here is what developers can expect when building on the Ethwei testnet."
description: "Our public testnet is approaching. Here's what developers can expect when building on the Ethwei testnet."
---

The Ethwei testnet is approaching. This post covers what it's built on, and what to expect once it's live.

## Built on the Cosmos SDK

Ethwei runs on the Cosmos SDK, on top of CometBFT consensus. That's a deliberate choice, not a default. We're not building our own consensus engine or reinventing a virtual machine — that's exactly the kind of unnecessary complexity that works against a boring, dependable chain. Cosmos gives us a modular, battle-tested foundation, so our own engineering effort goes into the parts that are actually specific to real world asset tokenization.

For developers, this means the testnet won't feel unfamiliar. If you've worked with a Cosmos SDK chain before, you already understand most of how Ethwei is put together.

## What the testnet is for

A testnet's job is to find problems before they matter. We'd rather discover a bad assumption, a missing edge case, or a bug in a module now — on a network where nothing is actually at stake — than later, on mainnet, with real value behind it. Expect us to test our own claims here rather than assume them: predictable behavior, dependable consensus, and modules that do less rather than more.

## What developers can expect

In the coming weeks, we'll be sharing:

- **Validator onboarding details** — how to join as a validator and what's required to run a node.
- **Faucet access** — a way to get testnet tokens for development and testing.
- **SDK documentation** — the references you'll need to start building against Ethwei.

## Stay tuned

We'll share the exact launch details as they're ready. If you want to build on infrastructure for real world assets that takes boring and simple seriously, this is where that starts.
