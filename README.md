# Stripes NFT Contracts

This repo contains all of the contracts deployed for [Stripes](https://stripes.troyb.xyz/#/).

Stripes is a 100% on-chain generative art project. The metadata for each STRIPE token is generated when the NFT is minted and stored on-chain. These smart contract decode the on-chain data to draw the image on an SVG canvas. These NFTs do not rely on IPFS or APIs to retrieve the image off-chain.

## Stripes ([$STRIPES](https://stardust-explorer.metis.io/address/0x36c27551BED3E1dB018FC93807378e312d3Bb397/transactions))

Stripes is a collection of 10,000 pieces of on-chain generative art. 

Contracts:
* [StripesNFT.sol](./contracts/StripesNFT.sol): An ERC721 contract that generated pseudo-random attributes and produces an SVG canvas from data stored on-chain
* [BytesLib.sol](./contracts/BytesLib.sol): A gas-efficient library of byte array utils ([source](https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol))
* [Library.sol](./contracts/Library.sol): Function library for base64 encoding and other useful function

About:
* Each Stripe is randomly generated at mint time
* Each STRIPE token has 10 randomly generated stripes with the following characteristics:
  * Width of 1-32 pixels
  * Y-location
  * Color (R-G-B)
  * Speed (1-10 second loop)
* The contract contains a `tokenURI()` function which provides valid metadata used by marketplaces like OpenSea
  * The `image` attributes is created by an on-chain function that creates an SVG canvas
  * Unlike most NFT projects, the functionality is entirely on-chain. Most projects query off-chain storage from IPFS or some API to return the image.
  * As long as the Metis blockchain is running, you will be able to return your NFTs image and metadata

## Deployment

**Note:** This deployment requires an environment variable named `PRIVATE_KEY_METIS` with a private key to a wallet containing some Metis testnet tokens.

To deploy this contract to the Stardust testnet:
```
yarn install
yarn deploy_test
```
