import {
  BitwiseVerificationMethodFlag,
  DidSolService,
  ExtendedCluster,
  VerificationMethodType,
} from '@identity.com/sol-did-client';
import { Keypair, LAMPORTS_PER_SOL } from '@miraland/web3.js';
import { airdrop } from '../tests/utils/utils';
import { utils, Wallet as EthWallet } from 'ethers';
import { Wallet as NodeWallet } from '@project-serum/anchor';
import { DidSolIdentifier } from '@identity.com/sol-did-client';

(async () => {
  const authority = Keypair.generate();
  const cluster: ExtendedCluster = 'localnet';

  const identifier = DidSolIdentifier.create(authority.publicKey, cluster);
  // create service for a did:mln:${authority.publicKey}
  const service = DidSolService.build(identifier, {
    wallet: new NodeWallet(authority),
  });

  // resolve generative did document
  const didDoc = await service.resolve();
  console.log(JSON.stringify(didDoc, null, 2));
  // {
  //   "@context": [
  //   "https://w3id.org/did/v1.0",
  //   "https://w3id.org/sol/v0"
  // ],
  //   "controller": [],
  //   "verificationMethod": [
  //   {
  //     "id": "did:mln:localnet:GQNzcYZtfdBpZ4KG1q6UBmHyC1B8gJhy5MergNpV5qov#default",
  //     "type": "Ed25519VerificationKey2018",
  //     "controller": "did:mln:localnet:GQNzcYZtfdBpZ4KG1q6UBmHyC1B8gJhy5MergNpV5qov",
  //     "publicKeyBase58": "GQNzcYZtfdBpZ4KG1q6UBmHyC1B8gJhy5MergNpV5qov"
  //   }
  // ],
  //   "authentication": [],
  //   "assertionMethod": [],
  //   "keyAgreement": [],
  //   "capabilityInvocation": [
  //   "#default"
  // ],
  //   "capabilityDelegation": [],
  //   "service": [],
  //   "id": "did:mln:localnet:GQNzcYZtfdBpZ4KG1q6UBmHyC1B8gJhy5MergNpV5qov"
  // }

  // airdrop some sol
  await airdrop(service.connection, authority.publicKey, 5 * LAMPORTS_PER_SOL);

  // Initialize account (Will be done implicitly when with "withAutomaticAlloc", see later)
  await service.initialize().rpc();

  // close an account
  const rentDestination = Keypair.generate();
  await service.close(rentDestination.publicKey).rpc();

  // add a ETh Verification Method (with automatic (re)initialization)
  const ethKey = EthWallet.createRandom();
  const ethAddress = utils.arrayify(ethKey.address);

  await service
    .addVerificationMethod({
      fragment: 'eth-address',
      keyData: Buffer.from(ethAddress),
      methodType: VerificationMethodType.EcdsaSecp256k1RecoveryMethod2020,
      flags: [BitwiseVerificationMethodFlag.CapabilityInvocation],
    })
    .withAutomaticAlloc(authority.publicKey)
    .rpc();

  // add a service and sign with the eth key
  // uses a nonAuthority for authority (fails) and rent funding (allowed)
  const nonAuthority = Keypair.generate();
  await airdrop(
    service.connection,
    nonAuthority.publicKey,
    5 * LAMPORTS_PER_SOL
  );

  await service
    .addService(
      {
        fragment: 'service-1',
        serviceType: 'service-type-1',
        serviceEndpoint: 'http://localhost:3000',
      },
      false,
      nonAuthority.publicKey
    )
    .withAutomaticAlloc(nonAuthority.publicKey)
    .withPartialSigners(nonAuthority)
    .withEthSigner(ethKey)
    .rpc();

  // this would fail (nonAuthority is not in DID)
  // await service.addService({
  //   id: "service-1",
  //   serviceType: "service-type-1",
  //   serviceEndpoint: "http://localhost:3000",
  // }, nonAuthority.publicKey)
  //   .withAutomaticAlloc(nonAuthority.publicKey)
  //   .withPartialSigners(nonAuthority)
  //   .rpc()

  // set controllers (native or others)
  await service
    .setControllers([
      `did:mln:localnet:${Keypair.generate().publicKey.toBase58()}`,
      `did:ethr:${EthWallet.createRandom().address}`,
    ])
    .withAutomaticAlloc(authority.publicKey)
    .rpc();

  // print document
  const didDocUpdated = await service.resolve();
  console.log(JSON.stringify(didDocUpdated, null, 2));

  // {
  //   "@context": [
  //   "https://w3id.org/did/v1.0",
  //   "https://w3id.org/sol/v0"
  // ],
  //   "controller": [
  //   "did:mln:localnet:Epuvox1GR8yMzB6g4UWH6yEjf55JWrieS5f4qqwne8vG",
  //   "did:ethr:0xe3b81fdF0A6415021E9A6924F4eCB17D90c0F08B"
  // ],
  //   "verificationMethod": [
  //   {
  //     "id": "did:mln:localnet:AbRUNiwyjagwSuTxHuMpUTF3zxBnMD4DsGkp5hUDivGs#default",
  //     "type": "Ed25519VerificationKey2018",
  //     "controller": "did:mln:localnet:AbRUNiwyjagwSuTxHuMpUTF3zxBnMD4DsGkp5hUDivGs",
  //     "publicKeyBase58": "AbRUNiwyjagwSuTxHuMpUTF3zxBnMD4DsGkp5hUDivGs"
  //   },
  //   {
  //     "id": "did:mln:localnet:AbRUNiwyjagwSuTxHuMpUTF3zxBnMD4DsGkp5hUDivGs#default",
  //     "type": "EcdsaSecp256k1RecoveryMethod2020",
  //     "controller": "did:mln:localnet:AbRUNiwyjagwSuTxHuMpUTF3zxBnMD4DsGkp5hUDivGs",
  //     "ethereumAddress": "0xbC3e75382cF939da15baBA51480Ee64eDE5Cc79C"
  //   }
  // ],
  //   "authentication": [],
  //   "assertionMethod": [],
  //   "keyAgreement": [],
  //   "capabilityInvocation": [
  //   "#default",
  //   "#eth-address"
  // ],
  //   "capabilityDelegation": [],
  //   "service": [
  //   {
  //     "id": "service-1",
  //     "type": "service-type-1",
  //     "serviceEndpoint": "http://localhost:3000"
  //   }
  // ],
  //   "id": "did:mln:localnet:AbRUNiwyjagwSuTxHuMpUTF3zxBnMD4DsGkp5hUDivGs"
  // }

  const [, sizeBefore] = await service.getDidAccountWithSize();
  console.log(`size before: ${sizeBefore}`);
  // size before: 269

  // resize an account
  await service.resize(10_000).rpc();
  const [, sizeAfter] = await service.getDidAccountWithSize();
  console.log(`size after: ${sizeAfter}`);
  // size after: 10000
})().catch(console.error);
