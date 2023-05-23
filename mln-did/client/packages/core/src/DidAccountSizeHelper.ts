import {
  AddVerificationMethodParams,
  BitwiseVerificationMethodFlag,
  RawDidSolDataAccount,
  RawVerificationMethod,
  Service,
  VerificationMethodType,
} from './lib/types';
import { getBinarySize } from './lib/utils';
import { PublicKey } from '@miraland/web3.js';
import BN from 'bn.js';

export class DidAccountSizeHelper {
  constructor(private didAccount: RawDidSolDataAccount) {}

  static getServiceSize(service: Service | undefined): number {
    if (!service) {
      return 0;
    }

    return (
      4 +
      getBinarySize(service.fragment) + // String: fragment binary size
      4 +
      getBinarySize(service.serviceType) +
      4 +
      getBinarySize(service.serviceEndpoint)
    );
  }

  static getVerificationMethodSize(
    verificationMethod:
      | RawVerificationMethod
      | AddVerificationMethodParams
      | undefined
  ): number {
    if (!verificationMethod) {
      return 0;
    }

    return (
      4 +
      getBinarySize(verificationMethod.fragment) + // String: fragment binary size
      2 + // flags
      1 + // method
      4 +
      verificationMethod.keyData.length
    ); // keyData Vector<u8>
  }

  static getVerificationMethodDefaultSize(): number {
    return (
      4 +
      7 + // String: "default"
      2 + // flags
      1 + // method
      4 +
      32
    ); // Vec<u8>[32] ed25519 pubkey
  }

  getDidAccountSize(): number {
    return (
      1 + // version
      1 + // bump
      8 + // nonce
      DidAccountSizeHelper.getVerificationMethodDefaultSize() + // initial_authority
      4 +
      this.didAccount.verificationMethods.reduce(
        (acc, cur) => acc + DidAccountSizeHelper.getVerificationMethodSize(cur),
        0
      ) + // verification_methods
      // + 4 + self.verification_methods.iter().fold(0, | accum, item| { accum + item.size() }) // verification_methods
      4 +
      this.didAccount.services.reduce(
        (acc, cur) => acc + DidAccountSizeHelper.getServiceSize(cur),
        0
      ) + // services
      // + 4 + self.services.iter().fold(0, | accum, item| { accum + item.size() }) // services
      4 +
      this.didAccount.nativeControllers.length * 32 + // native_controllers
      // + 4 + self.native_controllers.len() * 32 // native_controllers
      4 +
      this.didAccount.otherControllers.reduce(
        (acc, cur) => acc + 4 + getBinarySize(cur),
        0
      )
    ); // other_controllers
    //+ 4 + self.other_controllers.iter().fold(0, | accum, item| { accum + 4 + item.len() })
  }

  getTotalNativeAccountSize(): number {
    return (
      8 + // anchor discriminator
      this.getDidAccountSize()
    );
  }

  static getTotalInitialNativeAccountSize(): number {
    return (
      8 + // anchor discriminator
      this.getInitialDidAccountSize()
    );
  }

  static getInitialDidAccountSize(): number {
    return (
      1 + // version
      1 + // bump
      8 + // nonce
      DidAccountSizeHelper.getVerificationMethodDefaultSize() + // initial_authority
      4 + // verification_methods
      4 + // services
      4 + // native_controllers
      4
    ); // other_controllers
  }

  static fromAccount(didAccount: RawDidSolDataAccount): DidAccountSizeHelper {
    return new DidAccountSizeHelper(didAccount);
  }
}

export const getDefaultRawDidSolDataAccount = (
  authority: PublicKey
): RawDidSolDataAccount => ({
  version: 0,
  bump: 0,
  nonce: new BN(0),
  initialVerificationMethod: {
    fragment: 'default',
    flags: BitwiseVerificationMethodFlag.CapabilityInvocation,
    methodType: VerificationMethodType.Ed25519VerificationKey2018,
    keyData: authority.toBuffer(),
  },
  verificationMethods: [],
  services: [],
  nativeControllers: [],
  otherControllers: [],
});
