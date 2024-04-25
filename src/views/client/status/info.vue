<template>
  <BasicDrawer v-bind="$attrs" @register="register" title="Client details" width="50%">

   
    <a-input v-model:value="name" disabled>
            <template #addonBefore>  Name: </template>
          </a-input>

    
    <a-input v-model:value="image" >
            <template #addonBefore> Image: </template>
          </a-input>

    
    <a-input v-model:value="rpc" >
            <template #addonBefore> RPC: </template>
          </a-input>

    
    <a-input v-model:value="start_block" >
            <template #addonBefore> Start block: </template>
          </a-input>

    <a-button type="primary" @click="confirm"> Confirm </a-button> 
    <!-- <a-button type="error" @click="del"> Delete </a-button>  -->
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { update } from '/@/api/lpnode/base';
  import { uninstallChainClient } from '/@/api/lpnode/chainclient';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { BasicDrawer },
    props: {
      data: Object
    },
    setup(props) {
      const [register, { closeDrawer }] = useDrawerInner();
      const { createMessage } = useMessage();

      const name = ref('')
      const image = ref('')
      const rpc = ref('')
      const start_block = ref('')

      console.log('props.data:')
      console.log(props.data)

      watch(() => props.data, (newValue, oldValue) => {

        console.log("on props.data.value change")
        console.log(newValue)

        name.value = newValue.title
        image.value = newValue.clientInfo.deployment.image
        rpc.value = newValue.clientInfo.deployment.rpcUrl
        start_block.value = newValue.clientInfo.deployment.startBlock
      })

      const confirm = async () => {

        let newData = props.data
        newData.clientInfo.deployment.image = image.value
        newData.clientInfo.deployment.rpcUrl = rpc.value
        newData.clientInfo.deployment.startBlock = start_block.value

        let resp = await update({
          setupConfig: {
          installType: 'ammClient',
          name: props.data.name,
          update: true,
          installContext: JSON.stringify(newData.clientInfo)
        }})

        console.log('resp:')
        console.log(resp)
        if(resp != undefined) {
          createMessage.success('Configuration succeed')
          closeDrawer()
        }
      }

      const del = async () => {
        let resp = await uninstallChainClient({
          setupConfig: {
            type: props.data.name,
            uninstall: true
          }
        })

        console.log('resp:')
        console.log(resp)

        if(resp != undefined) {
          createMessage.success('Delete client succeed')
          closeDrawer()
        }
      }


      return { register, closeDrawer, name, image, rpc, start_block, confirm, del};
    },
  });
</script>
