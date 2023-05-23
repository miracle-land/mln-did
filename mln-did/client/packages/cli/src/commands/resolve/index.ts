import { Command } from '@oclif/core';
import { DidSolIdentifier } from '@identity.com/sol-did-client';
import { DidSolService } from '@identity.com/sol-did-client';

export default class Resolve extends Command {
  static description = 'Resolves a did:mln DID';

  static examples = [
    `$ sol resolve did:mln:devnet:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa
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
}`,
  ];

  static flags = {};

  static args = [
    {
      name: 'didsol',
      description: 'did:mln DID to be resolved',
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(Resolve);

    const service = DidSolService.build(args.didsol);

    // console.log(`did:mln: ${service.did}`);
    // console.log(`did:mln PDA: ${service.didDataAccount.toBase58()}`);
    // console.log(`did:mln legacy PDA: ${service.legacyDidDataAccount.toBase58()}`);

    const doc = await service.resolve();
    this.log(JSON.stringify(doc, null, 2));
  }
}
