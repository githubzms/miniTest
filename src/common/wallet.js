import { ethers } from 'ethers'
import { ElMessage } from 'element-plus'

// 连接钱包 获取账户
export async function connectWallet() {
    if (!window.ethereum) {
        alert("请先安装 Metamask 钱包！");
        return null;
    }
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum); // v6 用法
        console.log("Provider:", provider);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        console.log("Signer:", signer);

        const address = await signer.getAddress();
        console.log("Address:", address);
        console.log("连接钱包成功:");
        return { provider, signer, address };
    } catch (error) {
        console.error("连接钱包失败:", error);
        ElMessage.error('请先和Metamask建立连接')
        throw new Error(`连接钱包失败: ${error.message}`);
    }
}
// 添加签名功能
export async function signMessage(message) {
    const { signer } = await connectWallet()
    if (signer) {
        const signResult = await signer.signMessage(message)
        return signResult
    }
    return null
}
// 实现换链功能
export async function switchChain(chainId) {
    try {
        // 切换链时传递有效的 chainId
        const hexChainId = '0x' + Number(chainId).toString(16);  // 获取十六进制 chainId
        console.log("正在切换到链:", hexChainId);
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }]
        })
        return true
    } catch (error) {
        console.log('换链失败', error);
        return false
    }
}
// 获取合约
export async function getConctract(contractAddress, abi,type) {
    try {
        // 如果是查询 `view` 方法，使用 provider
        // 如果是发送状态修改的交易，使用 signer
        const { provider, signer } = await connectWallet();
        const conctract = new ethers.Contract(contractAddress, abi, type == "get" ? provider : signer)
        return conctract
    } catch (error) {
        console.log('获取失败', error);
        return false
    }
}