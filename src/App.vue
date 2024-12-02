<script setup>
import { onMounted, ref } from 'vue'
import { connectWallet, signMessage, switchChain, getConctract } from './common/wallet'
import { ElMessage } from 'element-plus'
// 钱包地址
let account = ref('')
// 签名
let signText = ref(''), signResult = ref('')
// 切换链
let selectedChain = ref('1337')

let abiAddress = ref(''), contractAddress = ref('')//合约地址
// 设置的值和获取的值
let setInputVal = ref(), getInputVal = ref()
let loading = ref(false)
// 设置下拉选项
const options = [
  { label: 'Ethereum 主链', value: '1' },
  { label: 'Binance Smart Chain', value: '56' },
  { label: '自定义本地', value: '1337' }
]

onMounted(async () => {
  // 初始化连接
  getConnect()
})

// 连接钱包
const getConnect = async () => {
  // 连接钱包 获取地址
  const wallet = await connectWallet()
  if (wallet) {
    account.value = wallet.address
  }
}
// 获取签名
const getSign = async () => {
  signResult.value = await signMessage(signText.value)
}
// 切换链(网络)
const selChange = async () => {
  const res = await switchChain(selectedChain.value)
  el_message('切换成功', 0)
}
//解析合约 调用合约方法
const getAbi = async (type) => {
  // 不管是获取还是设置 都需要先校验是否存在合约地址 和abi参数
  if (!contractAddress.value) {
    return el_message('请先设置合约地址', 1)
  }
  if (!abiAddress.value) {
    return el_message('请先设置abi参数', 1)
  }
  if (type == 'set' && !setInputVal.value) {
    return el_message('请先设置参数再调用', 1)
  }
  // 设置值
  if (type == 'set') {
    loading.value = true
    const contract = await getConctract(contractAddress.value, abiAddress.value, type)
    const res = await contract.setValue(setInputVal.value);
    await res.wait()
    //  设置成功获取下
    // 设置成功 清空输入框
    setInputVal.value = ''
    loading.value = false
    getAbi('get')
    return el_message('设置成功', 0)
  } else {
    // 获取值
    const contract = await getConctract(contractAddress.value, abiAddress.value, type)
    const value = await contract.getValue()
    getInputVal.value = value.toNumber()
    return el_message('获取成功', 0)
  }
}
// 定义全局message
const el_message = (msg, type) => {
  const msg_type = {
    0: 'success',
    1: 'warning'
  }
  ElMessage({
    message: msg,
    type: msg_type[type],
    duration: 2000
  })
}
</script>

<template>
  <el-card style="max-width: 800px;" title="连接钱包">
    <div v-if="account">
      <el-descriptions title="状态:已连接" :border="true" :column="1">
        <el-descriptions-item label="钱包地址:">
          <el-tag>{{ account }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="签名信息:">
          <p><el-input v-model="signResult" v-if="signResult" disabled type="textarea" /></p>
          <el-input v-model="signText" type="textarea" placeholder="可根据需要输入获取签名也可直接获取" />
          <p>
            <el-button size="small" type="primary" @click="getSign">点击获取</el-button>
          </p>
        </el-descriptions-item>
        <el-descriptions-item label="切换链:">
          <el-select v-model="selectedChain" @change="selChange" placeholder="选择" size="small" style="width: 140px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="合约地址:">
          <el-input v-model="contractAddress" placeholder="请输入合约地址" />
        </el-descriptions-item>
        <el-descriptions-item label="合约参数(abi):">
          <el-input v-model="abiAddress" type="textarea" placeholder="请输入合约参数" />
        </el-descriptions-item>
        <el-descriptions-item label="当前合约参数值:">
          <p><el-tag size="large" v-if="getInputVal">当前合约值:{{ getInputVal }}</el-tag></p>
          <el-button type="primary" @click="getAbi('get')">点击获取合约值</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="获取合约方法:">
          <p> <el-input v-model="setInputVal" type="textarea" placeholder="设置参数" /></p>
          <el-button type="primary" @click="getAbi('set')" :loading="loading">根据参数设置合约值</el-button>
        </el-descriptions-item>

      </el-descriptions>
    </div>
    <div v-else>
      <el-button type="primary" @click="getConnect">请先和Metamask建立连接</el-button>
    </div>
  </el-card>
</template>

<style scoped></style>
