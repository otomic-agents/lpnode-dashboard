<template>
  <PageWrapper :class="prefixCls" title="TaskList">
    <template #headerContent> </template>
    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in list" :key="item.title">
            <a-col :span="8">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`">
                  <div :class="`${prefixCls}__card-title`"
                    >Name:
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`"> Corn: {{ item.corn }} </div>
                  <div :class="`${prefixCls}__card-detail`">
                    Script Path: {{ item.script_path }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`"> Type: {{ item.type }} </div>
                  <div :class="`${prefixCls}__card-detail`"> CreatedAt: {{ item.created_at }} </div>
                  <div :class="`${prefixCls}__action`">
                    <template v-for="action in item.actions" :key="action.icon">
                      <div :class="`${prefixCls}__action-item`" @click="action.fn(item)">
                        <Icon
                          v-if="action.icon"
                          :class="`${prefixCls}__action-icon`"
                          :icon="action.icon"
                          :color="action.color"
                        />
                        {{ action.text }}
                      </div>
                    </template>
                    <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                  </div>
                </a-card>
              </a-list-item>
            </a-col>
          </template>
        </a-row>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { actions, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col, List } from 'ant-design-vue';
  import { list } from '/@/api/lpnode/monitoring';
  import { TaskInfo } from '/@/api/lpnode/model/monitoringModel';
  import { deleteTask } from '/@/api/lpnode/monitoring';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: {
      Icon,
      // Tag,
      // BasicForm,
      PageWrapper,
      [Card.name]: Card,
      [List.name]: List,
      [Row.name]: Row,
      [Col.name]: Col,
      [List.Item.name]: List.Item,
    },
    setup() {
      const { createMessage } = useMessage();
      const searchList: any = ref([]);
      const delete_fn = async (item: any) => {
        if (item.type === 'system') {
          return;
        }
        console.log(item);
        const params: any = {
          _id: item.id,
        };
        let resp = await deleteTask(params);
        console.log('resp:', resp);
        if (resp != undefined) {
          createMessage.success('Delete task succeed');
          fetch();
        }
      };

      const fetch = async () => {
        let resp: Array<TaskInfo> = await list({});
        console.log('resp:');
        console.log(JSON.stringify(resp));

        let newList: any = [];
        resp.forEach((item) => {
          newList.push({
            id: item._id,
            title: item.name,
            corn: item.corn,
            script_path: item.scriptPath,
            type: item.taskType,
            content: item.corn,
            created_at: item.createdAt,
            actions: [
              {
                icon: 'material-symbols:delete-forever',
                text: 'delete',
                color: '#018ffb',
                fn: delete_fn,
              },
            ],
          });
        });

        searchList.value = newList;
      };
      fetch();

      return {
        prefixCls: 'list-card',
        list: searchList,
        actions,
        schemas,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-card {
    &__action-item {
      margin-top: 20px;
    }

    &__link {
      margin-top: 10px;
      font-size: 14px;

      a {
        margin-right: 30px;
      }

      span {
        margin-left: 5px;
      }
    }

    &__card {
      width: 100%;
      margin-bottom: -8px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;
        color: @text-color;

        .icon {
          margin-top: -5px;
          margin-right: 10px;
          font-size: 38px !important;
        }
      }

      &-detail {
        padding-top: 10px;
        padding-left: 30px;
        font-size: 14px;
        color: @text-color-secondary;
      }
    }
  }
</style>
