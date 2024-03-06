<template>
    <PageWrapper 
    contentBackground
    title="AuthenticationLimiter"
    contentClass="p-4">
        
        
        <div class="limiter">
            <div class="limiter-form">
                
                <BasicForm @register="register">
        
                </BasicForm>

                <div>
                    black list: 
                    <a-button v-for="item in blackList" :key="item" type="dashed" @click="onBlackCancel(item)">{{item}}</a-button>
                </div>
                    white list:
                    <a-button v-for="item in whiteList" :key="item" type="dashed" @click="onWhiteCancel(item)">{{item}}</a-button>
                <div>

                </div>

            </div>
        </div>
        <Loading :loading="isLoading" />
    </PageWrapper>
</template>
<script lang="ts">
import { PageWrapper } from '/@/components/Page';
import { Ref, defineComponent, ref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form';
import { Select, Input, Divider, Checkbox } from 'ant-design-vue';
import { limitSchema } from './data';
import { setAuthenticationLimiter, getAuthenticationLimiter } from '/@/api/lpnode/account';
import { GetAuthenticationLimiterModel, GetAuthenticationLimiterParams, AuthenticationLimiterModel, AuthenticationLimiterParams } from '/@/api/lpnode/model/accountModel';
import { nextTick } from 'vue';
import { Loading } from '/@/components/Loading/index';
import { useTabs } from '/@/hooks/web/useTabs';

export default defineComponent({
    components: {
        PageWrapper,
        BasicForm,
        Loading
    },

    setup() {

        const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
        const isLoading = ref(false)
        const blackList: Ref<string[]> = ref([])
        const whiteList: Ref<string[]> = ref([])

        limitSchema[0].componentProps.onChange = async (e: any) => {
            if (e == true) {
                whiteList.value = []
            } else {
                blackList.value = []
            }
        }

        limitSchema[1].componentProps.onChange = async (e: any) => {
            const v = await validate()
            console.log('validate', v)
            console.log('onChange blacklist', e)
            if (v.isblack && v.state) {
                blackList.value.push(e)
            }
            
        }

        limitSchema[2].componentProps.onChange = async (e: any) => {
            const v = await validate()
            console.log('validate', v)
            console.log('onChange whitelist', e)
            if (!v.isblack && v.state) {
                whiteList.value.push(e)
            }
            
        }

        const onBlackCancel = (item: string) => {
            blackList.value = blackList.value.filter(black => black != item)
        }

        const onWhiteCancel = (item: string) => {
            whiteList.value = whiteList.value.filter(black => black != item)
        }

        const [register, { validate, setProps, setFieldsValue }] = useForm({
            labelWidth: 100,
            schemas: limitSchema,
            actionColOptions: {
            span: 14,
            },
            showResetButton: false,
            submitButtonOptions: {
            text: 'submit',
            },
            submitFunc: customSubmitFunc,
        });

        async function customSubmitFunc() {
            isLoading.value = true
            console.log('on customSubmitFunc')
            const v = await validate()

            await setAuthenticationLimiter({
                authenticationLimiter: JSON.stringify({
                    country_white_list: whiteList.value.join(','),
                    country_black_list: blackList.value.join(','),
                    min_age: '18',
                    account_black_list: '',
                    state: v.state == true ? 'on' : 'off'
                })
            })

            isLoading.value = false
            refreshPage()
        }

        const getDataFromAdmin = async () => {
            const resp: GetAuthenticationLimiterModel = await getAuthenticationLimiter({})
            console.log('getDataFromAdmin resp', resp)

            if (resp == undefined) {
                console.log('reset values ')

                blackList.value = []
                whiteList.value = []
                setFieldsValue({
                    // 'state': false,
                    'isblack': false
                })
                
            } else {
                console.log('set values ')

                const dataObj = JSON.parse(resp)
                console.log('dataObj', dataObj)

                blackList.value = dataObj.country_black_list.split(',')
                whiteList.value = dataObj.country_white_list.split(',')
                setFieldsValue({
                    // 'state': dataObj.state == "on",
                    'isblack': dataObj.country_black_list != ''
                })

            }

        }

        getDataFromAdmin()

        return { register, blackList, whiteList, onBlackCancel, onWhiteCancel }
    }
})
</script>
<style lang="less" scoped>
.limiter {
    &-form {
        width: 450px;
        margin: 0 auto;
    }

    p {
      color: @text-color;
    }
}
</style>