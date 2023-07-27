<template>
  <a-button type="default" @click="prev_step()"> Modify </a-button>
  <a-button
    type="primary"
    preIcon="mdi:page-next-outline"
    v-if="createState.runComplete === true"
    @click="next_step()"
  >
    Next
  </a-button>
</template>
<script lang="ts">
  import { createState } from './global_state';
  import { defineComponent, reactive, toRefs } from 'vue';
  export default defineComponent({
    components: {},
    emits: ['next', 'prev'],
    setup(_, { emit }) {
      const state = reactive({
        createState,
      });
      const next_step = () => {
        console.log('step 2 next_step');
        emit('next');
      };
      const prev_step = () => {
        emit('prev');
      };
      console.log(emit);
      return {
        ...toRefs(state),
        next_step,
        prev_step,
      };
    },
  });
</script>
