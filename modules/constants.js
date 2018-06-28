export const InfuraEndpoints = {
  ethereum: {
    http: {
      Main: 'http://node4.auxilium.global:8545' //'https://mainnet.infura.io/mist',
      // Ropsten: 'https://ropsten.infura.io/mist',
    },
    websockets: {
      Main: 'ws://node4.auxilium.global:8546/ws' //'wss://mainnet.infura.io/ws',
      // Ropsten: 'wss://ropsten.infura.io/ws',
    }
  },
  ipfs: {
    gateway: 'https://ipfs.infura.io',
    rpc: 'https://ipfs.infura.io:5001'
  }
};
