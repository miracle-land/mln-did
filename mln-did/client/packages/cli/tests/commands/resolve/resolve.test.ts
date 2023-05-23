import { expect, test } from '@oclif/test';
import { Keypair } from '@miraland/web3.js';
import { getGeneratedDidDocument } from '../../fixtures/loader';

describe('resolve', () => {
  const randomLocalnetKey = Keypair.generate().publicKey.toBase58();
  const randomDevnetKey = Keypair.generate().publicKey.toBase58();
  test
    .stdout()
    .command(['resolve', `did:mln:localnet:${randomLocalnetKey}`])
    .it('resolves randomly-generated did', (ctx) => {
      expect(JSON.parse(ctx.stdout)).to.deep.equal(
        getGeneratedDidDocument(randomLocalnetKey, 'did:mln:localnet:')
      );
    });
  test
    .stdout()
    .command([
      'resolve',
      'did:mln:localnet:F4z36iiKA1Ymp7suNTiTGpN9JH3C5sceSGBSzyPsfFJz',
    ])
    .it('resolves legacy did', (ctx) => {
      expect(JSON.parse(ctx.stdout)).to.deep.equal(
        getGeneratedDidDocument(
          'F4z36iiKA1Ymp7suNTiTGpN9JH3C5sceSGBSzyPsfFJz',
          'did:mln:localnet:'
        )
      );
    });
  test
    .stdout()
    .command(['resolve', `did:mln:devnet:${randomDevnetKey}`])
    .it('resolves did on devnet', (ctx) => {
      expect(JSON.parse(ctx.stdout)).to.deep.equal(
        getGeneratedDidDocument(`${randomDevnetKey}`, 'did:mln:devnet:')
      );
    });
});

//did:mln:devnet:JCU5Xzri4N88UdS3WHQZZ9fgTVpiSxTiKiSZKbfJh7Sx
