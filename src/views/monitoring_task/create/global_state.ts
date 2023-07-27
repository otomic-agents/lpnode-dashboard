import { reactive } from 'vue';
const createState = reactive({
  runComplete: false,
  code: '',
});

export { createState };
