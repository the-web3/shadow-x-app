export const getAllWalletData = () => {
    return uni.getStorageSync('walletData') || {}
}

export const hasWalletFunc = () => {
    const allWalletData = getAllWalletData();
    const chainIdList = Object.keys(allWalletData)
    let hasWallet = false
    for(let chainId of chainIdList){
        if(allWalletData[chainId].length > 0){
            hasWallet = true;
            break;
        }
    }
    return hasWallet
}
