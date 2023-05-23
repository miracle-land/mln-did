# `did:mln` CLI

A typescript-based CLI for registering, manipulating, and resolving DIDs using the `did:mln` method.

## Command line tool
The client library comes with a command line tool `sol` that resolves and manipulate
DIDs.

### Installation
```shell
yarn global add @identity.com/sol-did-cli # or npm install -g @identity.com/sol-did-cli
```
### Usage

#### Resolve a DID
```shell
sol did:mln:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa # resolves a DID on mainnet-beta
...
sol did:mln:devnet:6fjuEFDTircJVNCQWYe4UHNfbYrU1a4sEr8FQ5w7d8Fx # resolves a DID on devnet
````

<!-- toc -->
* [`did:mln` CLI](#didsol-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @identity.com/sol-did-cli
$ sol COMMAND
running command...
$ sol (--version)
@identity.com/sol-did-cli/3.3.0 darwin-arm64 node-v16.13.0
$ sol --help [COMMAND]
USAGE
  $ sol COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sol help [COMMAND]`](#sol-help-command)
* [`sol resolve DIDSOL`](#sol-resolve-didsol)

## `sol help [COMMAND]`

Display help for sol.

```
USAGE
  $ sol help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for sol.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.19/src/commands/help.ts)_

## `sol resolve DIDSOL`

Resolves a did:mln DID

```
USAGE
  $ sol resolve [DIDSOL]

ARGUMENTS
  DIDSOL  did:mln DID to be resolved

DESCRIPTION
  Resolves a did:mln DID

EXAMPLES
  $ sol resolve did:mln:devnet:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa
  {
    "@context": [
      "https://w3id.org/did/v1.0",
      "https://w3id.org/sol/v2.0"
    ],
    "controller": [],
    "verificationMethod": [
      {
        "id": "did:mln:devnet:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa#default",
        "type": "Ed25519VerificationKey2018",
        "controller": "did:mln:devnet:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa",
        "publicKeyBase58": "ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa"
      }
    ],
    "authentication": [],
    "assertionMethod": [],
    "keyAgreement": [],
    "capabilityInvocation": [
      "#default"
    ],
    "capabilityDelegation": [],
    "service": [],
    "id": "did:mln:devnet:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa"
  }
```

_See code: [dist/commands/resolve/index.ts](https://github.com/identity-com/sol-did/blob/v3.3.0/dist/commands/resolve/index.ts)_
<!-- commandsstop -->
