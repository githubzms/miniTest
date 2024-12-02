#### vite初始化一个vue项目
`npm create vite@latese`

#### 安装所需依赖
`npm install ethers web3modal element-plus`

#### 谷歌浏览器 安装Metamask钱包 密码是:12345678

#### 私钥 

#### 方法解释
 - getConnect 连接钱包
 - getSign 获取签名
 - selChange 切换链
 - getAbi 解析合约 调用合约方法

#### 注意项
- EVM 版本 部署的时候要选择兼容版本  这两个可以 
- .evm 版本: cancu 一直部署不上去
- 可以试试 berlin / istabul
    

#### sol代码部分
``` javascript
`// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
contract DynamicContract {
     // 定义一个变量
    uint256 private  value;

    // 记录值的修改
    event Valuechanged(uint256 newValue);

    // 初始化值
    constructor(uint256 _value){
        value=_value;
    }

    // 获取值 (注意是 returns)
    function getValue() public  view  returns  (uint256){
        return value;
    } 

    // 设置值
    function setValue(uint256 _value) public {
        value=_value;
        emit Valuechanged(_value);//当值改变了 记录下值
    }
}
```