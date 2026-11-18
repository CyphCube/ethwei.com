# Ethwei

A beginner-friendly DeFi portal. Set up a wallet safely, compare gas prices on test networks, learn what DeFi risks look like, and practice with free test tokens before using real money.

## What's on the site

- Wallet: a safe wallet-setup checklist, with a link to the Sacklink app.
- Gas: current mainnet gas prices and native-token transfer cost in USD for Ethereum, Base, Arbitrum, Arc, BSC and HyperEVM, read from the gas.ethwei.com API (display only).
- DeFi: plain-language descriptions of common DeFi apps with risk labels.
- Playground: a guided first test transaction and testnet apps to try.
- Blog: guides on DeFi risks and staying safe.
- Five languages: English, Chinese, Korean, Japanese and Vietnamese. English is complete. New text in the other four is still English until translated.

## Run locally

```bash
hugo server
```

## Build

```bash
./build.sh
```

Generated site output is written to `public/`.

## Configuration

Links to the full apps (wallet, gas, DeFi, playground) and the test faucet are set under `[params.apps]` in `config.toml`.
