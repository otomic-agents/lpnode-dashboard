<template>
  <BasicDrawer v-bind="$attrs" @register="register" title="Program details" width="50%">

    <div class="resEditor" v-if="showEditor">
      <CodeEditor  v-model:value="editorJson" :mode="modeValue"/>
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
      const programRes: any = ref({})
      const editorJson = ref("{}")
      const showEditor = ref(false)

      console.log('props.data:')
      console.log(props.data)

      watch(() => props.data, async (newValue, oldValue) => {
        
        if (!(programRes.value == undefined || programRes.value == {})) {
          editorJson.value = newValue.details == "" ? "{}" : newValue.details
          
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





      return { register, closeDrawer, name, image, port, envs, modeValue, editorJson, showEditor};
    },
  });
</script>
<style lang="less" scoped>
.resEditor{
  margin-top: 40px;
  height: 600px;
}
</style>