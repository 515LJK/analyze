<template>
    <div class="index">
        <Form
            :model="rechargeForm"
            :rules="rechargeRules"
            ref="rechargeForm"
        >
            <form-item label="充值方式：">
                <radio-group
                    v-model="rechargeForm.type"
                    @change="typeChange"
                >
                    <radio :label="0">
                        充值
                    </radio>
                    <radio :label="1">
                        返点
                    </radio>
                    <radio :label="2">
                        赠送
                    </radio>
                </radio-group>
            </form-item>
            <template v-if="rechargeForm.type === 0">
                <form-item
                    label="充值金额："
                    prop="charge"
                >
                    <input
                        type="number"
                        v-model="rechargeForm.charge"
                        placeholder="请输入充值金额"
                    />
                </form-item>
            </template>
            <template v-if="rechargeForm.type === 1">
                <form-item
                    label="返点比例："
                    class="rebate"
                    prop="rate"
                >
                    <input
                        type="number"
                        v-model="rechargeForm.rate"
                        placeholder="请输入返点比例"
                        :disabled="!rechargeForm.charge_id"
                    />%
                    <button
                        type="primary"
                        :disabled="!rechargeForm.charge_id"
                    >
                        计算赠送金额
                    </button>
                </form-item>
            </template>
            <form-item
                label="赠送金额："
                prop="rebate"
            >
                <input
                    type="number"
                    :disabled="rechargeForm.type === 1 && !rechargeForm.charge_id"
                    v-model="rechargeForm.rebate"
                    placeholder="请输入赠送金额"
                />
            </form-item>
        </Form>
        <div @click="submit">123</div>
    </div>
</template>

<script>
import {Radio, Input, RadioGroup} from 'element-ui';
import FormItem from 'element-ui/packages/form/src/form-item.vue';
import Form from 'element-ui/packages/form/src/form.vue';

export default {
    data() {
        return {
            rechargeForm: {
                type: 0
            },
            rechargeRawForm: {
                sync: 1,
                charge: '',
                rebate: '',
                charge_id: '',
                rate: '',
                date: '',
                bank: '',
                realname: '',
                contract: ''
            },
            rechargeRules: {
                charge: [{required: true, message: '请输入充值金额', trigger: 'blur'}],
                rebate: [{validator: this.validateRebate, trigger: 'blur'}],
                date: [{required: true, message: '请输入汇款日期', trigger: 'change'}],
                bank: [{required: true, message: '请输入汇款银行', trigger: 'blur'}],
                realname: [{required: true, message: '请输入企业名称', trigger: 'blur'}],
                contract: [{required: true, message: '请选择合同编号', trigger: 'change'}]
            }
        }
    },
    created() {
    },
    methods: {
        typeChange() {
            this.resetRechargeForm();
        },
        resetRechargeForm() {
            const {rechargeForm} = this.$refs;
            rechargeForm.clearValidate();
            Object.keys(this.rechargeRawForm).forEach(key => {
                this.$set(this.rechargeForm, key, this.rechargeRawForm[key]);
            });
        },
        submit() {
            const {rechargeForm} = this.$refs;
            rechargeForm.validate(async (valid) => {
                console.log(valid)
            });
        },
        validateRebate(rule, value, callback) {
            if (!value) {
                callback(new Error('请输入赠送金额'));
            } else {
                callback();
            }
        }
    },
    components: {
        Form,
        FormItem,
        Radio, 
        Input, 
        RadioGroup
    }
}
</script>

<style>
@import '~element-ui/lib/theme-chalk/index.css';
</style>