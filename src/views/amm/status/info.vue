<template>
  <BasicDrawer v-bind="$attrs" @register="register" title="Program details" width="50%">

   
    <a-input v-model:value="name" disabled>
            <template #addonBefore>  Name: </template>
          </a-input>

    
    <a-input v-model:value="image" >
            <template #addonBefore> Image: </template>
          </a-input>

    
    <a-input v-model:value="port" >
            <template #addonBefore> port: </template>
          </a-input>

    
    <a-input v-for="item in envs" v-model:value="item.value" >
            <template #addonBefore> {{item.key}} </template>
          </a-input>

    <a-button type="primary" @click="confirm"> Confirm </a-button> 
    <a-button type="error" @click="del"> Delete </a-button> 

    <div class="resEditor" v-if="showEditor">
      <CodeEditor  v-model:value="editorJson" :mode="modeValue"/>
      <a-button type="primary" @click="save"> Save </a-button> 
    </div>

  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, watch, ref, computed, reactive, nextTick } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { update } from '/@/api/lpnode/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uninstallAmm, edit } from '/@/api/lpnode/amm';
  import { Card, Row, Col, List, Input } from 'ant-design-vue';
  import { CodeEditor, JsonPreview, MODE } from '/@/components/CodeEditor';

  export default defineComponent({
    components: { BasicDrawer,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col, 
      [Input.name]: Input,
      CodeEditor
      },
    props: {
      data: Object
    },
    setup(props) {
      const modeValue = ref<MODE>(MODE.JSON);
      const [register, { closeDrawer }] = useDrawerInner();
      const { createMessage } = useMessage();

      const name = ref('')
      const image = ref('')
      const port = ref('')
      const envs = ref([])
      const ammRes: any = ref({})
      const editorJson = ref("{}")
      const showEditor = ref(false)

      console.log('props.data:')
      console.log(props.data)

      watch(() => props.data, async (newValue, oldValue) => {

        console.log("on props.data.value change")
        console.log(newValue)

        name.value = newValue.name
        image.value = newValue.clientInfo.deployment.image
        port.value = newValue.clientInfo.deployment.containerPort
        ammRes.value = newValue.res
        
        if (!(ammRes.value == undefined || ammRes.value == {})) {
          editorJson.value = newValue.res.templateResult ? newValue.res.templateResult : newValue.res.template
          
          showEditor.value = false
          await nextTick()
          await nextTick()
          await nextTick()
          showEditor.value = true
        } else {
          editorJson.value = "{}"
          showEditor.value = false
        }
        

        let newEnvs = Object.assign([], newValue.clientInfo.deployment.customEnv)
        
        envs.value = newEnvs
      })


      const confirm = async () => {

        let newData = props.data
        newData.clientInfo.deployment.image = image.value
        newData.clientInfo.deployment.containerPort = port.value
        newData.clientInfo.deployment.customEnv = envs.value

        console.log('newData:')
        console.log(newData)

        let resp = await update({
          setupConfig: {
          installType: newData.installType,
          name: props.data.name,
          update: true,
          installContext: JSON.stringify(newData.clientInfo)
        }})

        console.log('resp:')
        console.log(resp)
        if(resp != undefined) {
          createMessage.success('Configuration succeeded')
          closeDrawer()
        }
      }

      const del = async () => {
        let resp = await uninstallAmm({
          setupConfig: {
          uninstall: true,
          installType: props.data.installType,
          name: props.data.name,
        }})

        console.log('resp:')
        console.log(resp)
        if(resp != undefined) {
          createMessage.success('Delete succeeded')
          closeDrawer()
        }
      }

      const save = async () => {
        let params = ammRes.value
        params.templateResult = editorJson.value

        let resp = await edit(params)

        console.log('resp:')
        console.log(resp)

        if(resp != undefined) {
          createMessage.success('Config succeeded')
          // closeDrawer()
        }
      }

      return { register, closeDrawer, name, image, port, envs, confirm, del, modeValue, editorJson, save, showEditor};
    },
  });
</script>
<style lang="less" scoped>
.resEditor{
  margin-top: 40px;
  height: 600px;
}
</style>