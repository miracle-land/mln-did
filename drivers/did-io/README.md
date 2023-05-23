# DID.io SOL Driver

A SOL driver for the [did.io](https://github.com/digitalbazaar/did-io) DID client.

## Usage

The SOL driver supports the `generate()` and `get()` functions only, and generates
'sparse' DID documents, i.e. those derived from an initial private key with no additional
properties.

To generate a DID:

```js
import { CachedResolver } from '@digitalbazaar/did-io';
import didSol from '@identity.com/did-io-driver-sol';

const resolver = new CachedResolver(); 
resolver.use(didSol.driver({payer: PAYER_KEY}))

// Generate a DID
const did = await resolver.generate({
  method: 'sol',
  cluster: 'devnet'   // omit for mainnet
})
```

where PAYER_KEY is the private key of the transaction payer on miraland
and OWNER_KEY is the public key of the owner of the DID,
both encrypted as base58 strings.
