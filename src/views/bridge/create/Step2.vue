<template>
  <div class="step2">
    <a-list>
      
       <a-row :gutter="0">

        <a-col :span="2"/>
        <a-col :span="9">
          <!-- <a-list-item> -->
          <BasicForm @register="registerSrc" @srcchain="onSrcChain"/>
          <!-- </a-list-item> -->
        </a-col>
        <a-col :span="2"/>
        <a-col :span="9">
          <!-- <a-list-item> -->
          <BasicForm @register="registerDst" />
          <!-- </a-list-item> -->
        </a-col>
        <a-col :span="2"/>

        <a-col :span="6" />
        <a-col :span="12">
          <!-- <a-list-item> -->
          <BasicForm @register="register" />
          <!-- </a-list-item> -->
        </a-col>
        <a-col :span="6" />
        
       </a-row>
       <a-row :gutter="0">
        
       </a-row>
    </a-list>
    
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2SchemasSrc, step2SchemasDst, step2Schemas } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';
  import { Card, Row, Col, List } from 'ant-design-vue';
  import { list as programeList, chainList, relayList } from '/@/api/lpnode/base';
  import { ListModel,RelayListModel } from '/@/api/lpnode/model/baseModel';
  import { list as tokenList } from '/@/api/lpnode/token';
  import { TokenInfo } from '/@/api/lpnode/model/tokenModel';
  import { list as walletList } from '/@/api/lpnode/wallet';
  import { WalletInfo } from '/@/api/lpnode/model/walletModel';
  import { getChainType, getChainID } from '/@/obridge/utils'
  import { string } from 'vue-types';

  export default defineComponent({
    components: {
      BasicForm,
      [Alert.name]: Alert,
      [Divider.name]: Divider,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    emits: ['next', 'prev'],
    setup(_, { emit }) {
      const chainIds = ref([])
      const chains = ref([])
      const tokens = ref([])
      const wallets = ref([])
      const amms = ref([])
      const relays = ref([])
      

      const [register, { validate, setProps }] = useForm({
        labelWidth: 80,
        schemas: step2Schemas,
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: 'next',
        },
        showSubmitButton: true,
        resetFunc: customResetFunc,
        submitFunc: customSubmitFunc,
      });
      const [registerSrc, { validate: validateSrc, setProps : setPropsSrc }] = useForm({
        labelWidth: 80,
        schemas: step2SchemasSrc,
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        showSubmitButton: false,
      });
      const [registerDst, { validate: validateDst, setProps : setPropsDst }] = useForm({
        labelWidth: 80,
        schemas: step2SchemasDst,
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        showSubmitButton: false,
      });

      async function customResetFunc() {
        emit('prev');
      }

      async function customSubmitFunc() {
        try {
          const valuesAmm = await validate();
          const valuesSrc = await validateSrc();
          const valuesDst = await validateDst();

          const values = Object.assign({}, valuesSrc, valuesDst, valuesAmm)
          if(values.src_chain == undefined) return
          if(values.dst_chain == undefined) return
          if(values.src_token == undefined) return
          if(values.dst_token == undefined) return
          if(values.src_wallet == undefined) return
          if(values.dst_wallet == undefined) return

          chainIds.value.forEach(chainInfo => {
            console.log(chainInfo)
            if(chainInfo.chainId == getChainID(values.src_chain)) {
              values.src_chain = chainInfo.id
            }
            if(chainInfo.chainId == getChainID(values.dst_chain)) {
              values.dst_chain = chainInfo.id
            }
          })
          
          relays.value.forEach(relayItem=>{
            console.log("relayItem",relayItem)
            if (relayItem.relayApiKey ==values.relay){
              values.relayUri = relayItem.relayUri
              values.relayApiKey= relayItem.relayApiKey
            }
          })
          setProps({
            submitButtonOptions: {
              loading: false,
            },
          });
          setTimeout(() => {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
            emit('next', values);
          }, 1);
        } catch (error) {}
      }

      const syncChain = async () => {
        let resp: ListModel = await programeList({
          installType: 'ammClient'
        })
        chains.value = resp
      }

      const syncChainId = async () => {
        let resp: ListModel = await chainList({})
        console.log('resp')
        console.log(resp)
        chainIds.value = resp
      }

      const syncRelay = async()=>{
        let resp:RelayListModel = await relayList({})
        console.log("relay resp")
        console.log(resp)
        relays.value = resp
      }

      const syncToken = async () => {
        let resp: Array<TokenInfo> = await tokenList({})
        tokens.value = resp
      }

      const syncWallet = async () => {
        let resp: Array<WalletInfo> = await walletList({})
        wallets.value = resp
      }

      const syncAmm = async () => {
        let resp: ListModel = await programeList({
          installType: 'amm'
        })
        amms.value = resp
      }


      let srcChain = undefined
      let srcToken = undefined
      let dstChain = undefined
      let dstToken = undefined

      const updateSrcTokenOptions = async (chain, dstToken) => {
        let newChainArr = []
        tokens.value.forEach(element => {
          if(element.chainId == getChainID(chain) && element.address != dstToken?.split(',')[0]) {
            newChainArr.push({
              label: element.tokenName,
              value: `${element.address},${element._id}`
            })
          }
        })

        step2SchemasSrc[1].componentProps = ({ formModel, formActionType }) => {
          // console.log('on componentProps')
          // console.log(formModel)
          // console.log(formActionType)

          return {
            options: newChainArr,
            onChange: (e: any) => {
              console.log('onchange')
              console.log(e)

              srcToken = e
              updateDstTokenOptions(dstChain, srcToken)
            }
          }
        }

        setPropsSrc({
          schemas: step2SchemasSrc
        })
      }

      const updateDstTokenOptions = async (chain, srcToken) => {
        let newChainArr = []
        tokens.value.forEach(element => {
          if(element.chainId == getChainID(chain) && element.address != srcToken?.split(',')[0]) {
            newChainArr.push({
              label: element.tokenName,
              value: `${element.address},${element._id}`
            })
          }
        })

        step2SchemasDst[1].componentProps = ({ formModel, formActionType }) => {
          // console.log('on componentProps')
          // console.log(formModel)
          // console.log(formActionType)

          return {
            options: newChainArr,
            onChange: (e: any) => {
              console.log('onchange')
              console.log(e)

              dstToken = e
              updateSrcTokenOptions(srcChain, dstToken)
            }
          }
        }

        setPropsDst({
          schemas: step2SchemasDst
        })
      }

      const updateSrcWalletOptions = async (chain) => {
        let newChainArr = []
        wallets.value.forEach(element => {
          if(element.chainId == getChainID(chain)) {
            newChainArr.push({
              label: element.walletName,
              value: element.id
            })
          }
        })

        step2SchemasSrc[2].componentProps = ({ formModel, formActionType }) => {
          // console.log('on componentProps')
          // console.log(formModel)
          // console.log(formActionType)

          return {
            options: newChainArr,
            onChange: (e: any) => {
              console.log('onchange')
              console.log(e)
            }
          }
        }

        setPropsSrc({
          schemas: step2SchemasSrc
        })
      }

      const updateDstWalletOptions = async (chain) => {
        let newChainArr = []
        wallets.value.forEach(element => {
          if(element.chainId == getChainID(chain)){
            newChainArr.push({
              label: element.walletName,
              value: element.id
            })
          }
        })

        step2SchemasDst[2].componentProps = ({ formModel, formActionType }) => {
          // console.log('on componentProps')
          // console.log(formModel)
          // console.log(formActionType)

          return {
            options: newChainArr,
            onChange: (e: any) => {
              console.log('onchange')
              console.log(e)
            }
          }
        }

        setPropsDst({
          schemas: step2SchemasDst
        })
      }

      const updateSrcChainOptions = async () => {
        let newChainArr = []
        chains.value.forEach(element => {
          newChainArr.push({
            label: element.name,
            value: element.name
          })
        })

        step2SchemasSrc[0].componentProps = ({ formModel, formActionType }) => {
          // console.log('on componentProps')
          // console.log(formModel)
          // console.log(formActionType)

          return {
            options: newChainArr,
            onChange: (e: any) => {
              console.log('onchange')
              console.log(e)

              srcChain = e
              updateSrcTokenOptions(srcChain, dstToken)
              updateSrcWalletOptions(e)
            }
          }
        }

        setPropsSrc({
          schemas: step2SchemasSrc
        })
      }

      const updateDstChainOptions = async () => {
        let newChainArr = []
        chains.value.forEach(element => {
          newChainArr.push({
            label: element.name,
            value: element.name
          })
        })

        step2SchemasDst[0].componentProps = ({ formModel, formActionType }) => {
          // console.log('on componentProps')
          // console.log(formModel)
          // console.log(formActionType)

          return {
            options: newChainArr,
            onChange: (e: any) => {
              console.log('onchange')
              console.log(e)

              dstChain = e
              updateDstTokenOptions(dstChain, srcToken)
              updateDstWalletOptions(e)
            }
          }
        }

        setPropsDst({
          schemas: step2SchemasDst
        })
      }

      const updateRelayOptions = async ()=>{
         let relayArr = [] 
         relays.value.forEach((item:{ relayUri:string,relayApiKey:string})=>{
          //@ts-ignore
          relayArr.push({
             label: item.relayUri,
             value: item.relayApiKey
          })
         })
         step2Schemas[3].componentProps = ({}) => {
          return {
            options: relayArr
          }
        }
         setProps({
          schemas: step2Schemas
        })
      }

      const updateAmmOptions = async () => {
        let newAmmArr = []
        console.log('updateAmmOptions:')
        console.log(amms.value)
        amms.value.forEach(element => {
          newAmmArr.push({
            label: element.name,
            value: element.name
          })
        })
        console.log(newAmmArr)
        step2Schemas[0].componentProps = ({ formModel, formActionType }) => {
          return {
            options: newAmmArr
          }
        }
        setProps({
          schemas: step2Schemas
        })
      }

      const syncOptions = async () => {

        if(chains.value == undefined || tokens.value == undefined || wallets.value == undefined || amms.value == undefined || chainIds.value == undefined) {
          return
        }

        updateSrcChainOptions()
        updateDstChainOptions()
        updateAmmOptions()
        updateRelayOptions()
      }

      watch(() => chains.value, syncOptions)
      watch(() => tokens.value, syncOptions)
      watch(() => wallets.value, syncOptions)
      watch(() => amms.value, syncOptions)
      watch(() => relays.value, syncOptions)

      syncChain()
      syncChainId()
      syncToken()
      syncWallet()
      syncAmm()
      syncRelay()

      const onSrcChain = () => {
        console.log('onSrcChain')
      }

      return { register, registerSrc, registerDst, onSrcChain };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 1350px;
    margin: 0 auto;
    padding-top: 30px;
  }
</style>
