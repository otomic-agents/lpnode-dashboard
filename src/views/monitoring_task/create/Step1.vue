<template>
  <PageWrapper title="Input script" contentFullHeight fixedHeight contentBackground>
    <div class="mt-5">
      <!-- <a-list-item> -->
      <CodeEditor v-model:value="value" :mode="modeValue" />
    </div>
    <!-- </a-list-item> -->

    <a-button type="primary" preIcon="mdi:page-next-outline" @click="next_step()"> Debug </a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { PageWrapper } from '/@/components/Page';
  import { Base64 } from 'js-base64';
  const def_script_code = `//const { DatabaseDict } = require("/data/lp_node_monitor/dist/monitor_sdk");
//const sdk = require("/data/lp_node_monitor/dist/monitor_sdk").default;

// const db = await sdk.database(DatabaseDict.Lp);
async function main(system_data) {
  //const db = await sdk.database(DatabaseDict.Lp);
  //const result = await db.collection("monitor_historys").find({}).sort({_id:-1}).limit(1).toArray();
  //console.log("db_result:", result);
  console.log("system_data:", system_data);
  return "exec ok";
}

process.on("message", async (systemData) => {
  const result = await main(systemData);
  process.send(result);
  // process.exit();
});
`;
  export default defineComponent({
    components: {
      CodeEditor,
      PageWrapper,
    },
    emits: ['next'],
    setup(_, { emit }) {
      const next_step = () => {
        emit('next', {
          editValue: Base64.encode(value.value),
        });
      };
      const modeValue = ref<MODE>(MODE.JS);
      console.log('modeValue:', modeValue);
      const value = ref('');

      // showData();
      value.value = def_script_code;
      return { value, modeValue, next_step };
    },
  });
</script>
<style lang="less" scoped>
  .step1 {
    width: 1350px;
    margin: 0 auto;
    padding-top: 30px;
  }
</style>
