<template>
    <PageWrapper :class="prefixCls" title="Guide">
        <div class="pt-4 m-4 desc-wrap">
        <a-card :title="title" :bordered="false">
            <a-steps :current="step" progress-dot size="small">

            <!-- <a-step title="Install Chain Client" @click="goInstallClient">
                <template #description>
                    <div>EVM Image:</div>
                    <p>kldtks/edge:obridge-chain-client-evm-e693e512 (recommend)</p>

                    <div>XRP Image:</div>
                    <p>kldtks/edge:obridge-chain-client-xrp-376bba36 (recommend)</p>

                    <div>NEAR Image:</div>
                    <p>kldtks/edge:obridge-chain-client-near-37b587b2 (recommend)</p>
                </template>
            </a-step>
            
            <a-step title="Install Program AMM" @click="goInstallAmm">
                <template #description>
                    <div>AMM Image:</div>
                    <p>kldtks/edge:obridge-lp-amm-9100bf81 (recommend)</p>

                    <div>Market Price Image:</div>
                    <p>kldtks/edge:obridge-lp-market-59296d16 (recommend)</p>
                </template>
            </a-step>   -->

            <a-step title="Config Token" @click="goConfigToken">
                <!-- <template #description>
                    <div>BSC Test Token A:</div>
                    <p>address:<br/>0x7E477f81Fb9E7184190<br/>
                        Ca53C8B9069532408Cc9B
                        token name:<br/>
                        TestERC20Src <br/>
                        market name:<br/>
                        USDT<br/>
                        decimal:<br/>
                        18</p>

                    <div>BSC Test Token B:</div>
                    <p>address:<br/>0x61D35C6B6a7568542ac<br/>A42448B47690650C69bb9
                    token name:<br/>
                    TestERC20Dst <br/>
                    market name:<br/>
                    USDC<br/>
                    decimal:<br/>
                    18</p>
                </template> -->
            </a-step> 

            <a-step title="Config Token" @click="goConfigToken">
                <!-- <template #description>
                    <div>BSC Test Token A:</div>
                    <p>address:<br/>0x7E477f81Fb9E7184190<br/>
                        Ca53C8B9069532408Cc9B
                        token name:<br/>
                        TestERC20Src <br/>
                        market name:<br/>
                        USDT<br/>
                        decimal:<br/>
                        18</p>

                    <div>BSC Test Token B:</div>
                    <p>address:<br/>0x61D35C6B6a7568542ac<br/>A42448B47690650C69bb9
                    token name:<br/>
                    TestERC20Dst <br/>
                    market name:<br/>
                    USDC<br/>
                    decimal:<br/>
                    18</p>
                </template> -->
            </a-step> 

            <a-step title="Config Wallet" @click="goConfigWallet">
                <!-- <template #description>
                    <div>Test Wallet 1</div>
                    <p> address:<br/>0x10FE2771907B0c42456<br/>95daD7e9Ed064d45860f8<br/>private key:<br/>058d185b433e50118a1bd<br/>451c13a7602df50b060e4<br/>a83e3b5057f5feff98fd3f </p>
                </template> -->
            </a-step> 

            <a-step title="Register LP Account" @click="goRegisterLP">
            </a-step> 

            <a-step title="Config Authentication Limiter" @click="">
            </a-step> 

            <a-step title="Config Bridge" @click="goConfigBridge">
            </a-step> 

            <a-step title="Congratulations" >
            </a-step> 


            </a-steps>
        </a-card>
        </div>

        <div class="pt-4 m-4 desc-wrap">
            <ImportToken v-if="step == 0" :ctx="dataToken1"/>
            <ImportToken v-if="step == 1" :ctx="dataToken2"/>
            <ImportWallet v-if="step == 2"/>
            <RegisterLp v-if="step == 3"/>
            <AuthenticationLimiter v-if="step == 4"/>
            <ConfigBridge v-if="step == 5"/>
        </div>
        
    </PageWrapper>
</template>
<script lang="ts">
import { PageWrapper } from '/@/components/Page';
import { Divider, Card, Empty, Descriptions, Steps, Tabs } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { useGo } from '/@/hooks/web/usePage';
import { list as programeList  } from '/@/api/lpnode/base';
import { ListModel } from '/@/api/lpnode/model/baseModel';
import { list as tokenList } from '/@/api/lpnode/token';
import { TokenInfo } from '/@/api/lpnode/model/tokenModel';
import { list as walletList } from '/@/api/lpnode/wallet';
import { WalletInfo } from '/@/api/lpnode/model/walletModel';
import { list as accountList } from '/@/api/lpnode/account';
import { AccountInfo } from '/@/api/lpnode/model/accountModel';
import { list as bridgeList } from '/@/api/lpnode/bridge';
import { BridgeInfo } from '/@/api/lpnode/model/bridgeModel';
import { setAuthenticationLimiter, getAuthenticationLimiter } from '/@/api/lpnode/account';
import { GetAuthenticationLimiterModel, GetAuthenticationLimiterParams, AuthenticationLimiterModel, AuthenticationLimiterParams } from '/@/api/lpnode/model/accountModel';

import ImportToken from '/@/views/token/import/index.vue';
import ImportWallet from '/@/views/wallet/import/index.vue';
import RegisterLp from '/@/views/account/register/index.vue';
import ConfigBridge from '/@/views/bridge/create/index.vue';
import AuthenticationLimiter from '/@/views/account/limiter/index.vue'

// testnet
// const dataToken1 = {
//     "defaultData": {
//         "address": "0x7E477f81Fb9E7184190Ca53C8B9069532408Cc9B",
//         "token_name": "TestERC20Src",
//         "market_name": "USDT",
//         "precision": 18,
//         "type": "stable_coin"
//     }
// }

// const dataToken2 = {
//     "defaultData": {
//         "address": "0x61D35C6B6a7568542acA42448B47690650C69bb9",
//         "token_name": "TestERC20Dst",
//         "market_name": "USDC",
//         "precision": 18,
//         "type": "stable_coin"
//     }
// }

// mainnet
const dataToken1 = {
    "defaultData": {
        "address": "0x55d398326f99059ff775485246999027b3197955",
        "token_name": "USDT",
        "market_name": "USDT",
        "precision": 18,
        "type": "stable_coin"
    }
}

const dataToken2 = {
    "defaultData": {
        "address": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
        "token_name": "USDT",
        "market_name": "USDT",
        "precision": 18,
        "type": "stable_coin"
    }
}

export default defineComponent({
    components: {
        ImportToken,
        ImportWallet,
        PageWrapper,
        RegisterLp,
        ConfigBridge,
        AuthenticationLimiter,
        [Divider.name]: Divider,
        [Card.name]: Card,
        [Steps.name]: Steps,
        [Steps.Step.name]: Steps.Step,
    },

    setup() {
        const go = useGo();
        const title = ref('')
        const step = ref(0)

        const goInstallClient = () => {
            go(`/chain-client/install`);
        }

        const goInstallAmm = () => {
            go(`/amm/install`);
        }

        const goConfigToken = () => {
            go(`/token/import`);
        }

        const goConfigWallet = () => {
            go(`/wallet/import`);
        }

        const goRegisterLP = () => {
            go(`/account/register`);
        }

        const goConfigBridge = () => {
            go(`/bridge/import`);
        }

        const checkStatus = async () => {
            // let respClient: ListModel = await programeList({
            //     installType: 'ammClient'
            // })
            // if(respClient != undefined && respClient.length > 0){
            //     step.value = 1
            // } else {
            //     return
            // }

            // let respAmm: ListModel = await programeList({
            //     installType: 'amm'
            // })
            // if(respAmm != undefined && respAmm.length > 0){
            //     step.value = 2
            // } else {
            //     return
            // }

            let respToken: Array<TokenInfo> = await tokenList({})
            if(respToken != undefined && respToken.length > 0){
                step.value = 1
            } else {
                return
            }

            // let respToken: Array<TokenInfo> = await tokenList({})
            if(respToken != undefined && respToken.length > 1){
                step.value = 2
            } else {
                return
            }

            let respWallet: Array<WalletInfo> = await walletList({})
            if(respWallet != undefined && respWallet.length > 0){
                step.value = 3
            } else {
                return
            }

            let respAccount: Array<AccountInfo> = await accountList({})
            if(respAccount != undefined && respAccount.length > 0){
                step.value = 4
            } else {
                return
            }

            let litmiterStr: string = await getAuthenticationLimiter({})
            if(litmiterStr != undefined) {

                const litmiter = JSON.parse(litmiterStr)
                step.value = 5
            } else {
                return 
            }
            
            let respBridge: Array<BridgeInfo> = await bridgeList({})
            if(respBridge != undefined && respBridge.length > 0){
                step.value = 6
            } else {
                return
            }
        }

        checkStatus()
        // step.value = 6

        return {
            title,
            step,
            dataToken1,
            dataToken2,
            goInstallClient,
            goInstallAmm,
            goConfigToken,
            goConfigWallet,
            goRegisterLP,
            goConfigBridge
        }
    }
})

</script>