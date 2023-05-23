const { DIDs } = require('./dist');
const { ClusterType, SolanaUtil } = require('@identity.com/sol-did-client');
const { Keypair, Connection} = require('@miraland/web3.js');

const clusterName = 'devnet';
const cluster = ClusterType.parse(clusterName);

const connection = new Connection(cluster.solanaUrl(), 'recent');
const payerAccountPromise = SolanaUtil.newAccountWithLamports(
  connection,
  1000000000
);

const didsPromise = payerAccountPromise
  .then(payerAccount => new DIDs({ payer: payerAccount.secretKey, cluster: clusterName }));

module.exports = {
  enableAwait: true,
  context: { dids: didsPromise, Keypair },
  prompt: 'DID $ '
}
