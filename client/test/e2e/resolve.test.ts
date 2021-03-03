import { resolve } from '../../src';
import { SolanaUtil } from '../../src/solana-util';
import { SolidTransaction } from '../../src/transaction';
import { Account, Connection } from '@solana/web3.js';
import {
  CLUSTER,
  TEST_DID_ACCOUNT_SECRET_KEY,
  VALIDATOR_URL,
} from './constants';

describe('resolve', () => {
  const connection = new Connection(VALIDATOR_URL, 'recent');
  let solidDIDAccount: Account;
  let authority: Account;

  beforeAll(async () => {
    const payer = await SolanaUtil.newAccountWithLamports(
      connection,
      1000000000
    );
    authority = new Account(TEST_DID_ACCOUNT_SECRET_KEY);
    solidDIDAccount = await SolidTransaction.createSolid(
      connection,
      payer,
      authority
    );
  }, 60000);

  it('looks up a DID from the blockchain', async () => {
    const did =
      'did:solid:' + CLUSTER + ':' + solidDIDAccount.publicKey.toBase58();
    const document = await resolve(did);

    console.log(document);
    return expect(document).toMatchObject({
      id: did,
    });
  });
});
