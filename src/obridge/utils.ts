export const getChainID = (chain) => {
    switch (chain) {
        case 'bsc':
          return 9006
        case 'avax':
          return 9000
        case 'xrp':
          return 144
        case 'near':
          return 397
        case 'eth':
          return 60;
        case 'polygon':
          return 966;
        case 'op':
          return 614
        default:
          break;
      }
}

export const getChainType = (chain) => {
    switch (chain) {
        case 'bsc':
          return 'evm'
        case 'avax':
          return 'evm'
        case 'eth':
          return 'evm'
        case 'polygon':
          return 'evm'
        case 'xrp':
          return 'xrp'
        case 'near':
          return 'near'
        default:
          break;
      }
}

export const getChainName = (chainId) => {
  switch (chainId) {
    case 9006:
      return 'bsc'
    case 9000:
      return 'avax'
    case 144:
      return 'xrp'
    case 397:
      return 'near'
    case 60:
      return 'eth'
    case 966:
      return 'polygon'
    default:
      break;
  }
}