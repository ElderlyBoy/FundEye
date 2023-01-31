<template>
  <el-dialog v-model="visible" v-if="!destroy" @closed="destroy = true" title="设置">
    <ElScrollbar height="400px" max-height="45vh">
      <ElForm :model="form" label-position="top">
        <ElFormItem label="更新频率设置（秒）">
          <ElSlider v-model="form.refreshRate" show-input :min="10" :max="180"></ElSlider>
        </ElFormItem>
      </ElForm>
      <ElTable :data="tableData" border stripe>
        <ElTableColumn>
          <template #header>
            <div class="fund-setting-title-area">
              <span>基金设置</span>
              <ElLink type="success" @click="addFund">添加</ElLink>
            </div>
          </template>
          <ElTableColumn label="序号" type="index" width="50px"></ElTableColumn>
          <ElTableColumn label="基金代码" width="100px" prop="code">
            <template v-slot="{row}">
              <ElInput v-if="row.editing" v-model="row.code" placeholder="请输入" clearable maxlength="7"></ElInput>
            </template>
          </ElTableColumn>
          <ElTableColumn label="持仓份额" width="100px" prop="count">
            <template v-slot="{row}">
              <ElInput v-if="row.editing" v-model="row.count" placeholder="请输入" clearable type="number"></ElInput>
              <span v-else>{{ row.count || 0 }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="备注" prop="remark">
            <template v-slot="{row}">
              <ElInput v-if="row.editing" v-model="row.remark" placeholder="请输入" clearable maxlength="20"></ElInput>
              <span v-else>{{ row.remark || '无' }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" prop="remark">
            <template v-slot="{row, $index}">
              <template v-if="row.editing">
                <ElLink type="success" @click="done($index)">完成</ElLink>
                <ElLink style="margin-left: 10px;" type="info" @click="deleteFund($index)">取消</ElLink>
              </template>
              <template v-else>
                <ElLink type="primary" @click="row.editing = true">编辑</ElLink>
                <ElLink style="margin-left: 10px;" type="danger" @click="deleteFund($index)">删除</ElLink>
              </template>
            </template>
          </ElTableColumn>
        </ElTableColumn>
      </ElTable>
    </ElScrollbar>
    <template #footer>
      <ElButton type="primary" @click="submit()">保存</ElButton>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive, nextTick } from 'vue';
import type {state} from "@/store/index";
import type Store from "@/store/index"
import { ElMessage } from 'element-plus';

const props = defineProps(['store']);
const store: typeof Store = reactive(props.store);

const visible = ref(true);
const destroy = ref(false);
const tableData = ref([] as typeof state.fundData)
const form = reactive({
  refreshRate: store.state.refreshRate
});

tableData.value = JSON.parse(JSON.stringify(store.state.fundData));

function submit() {
  let canSave = true;
  tableData.value.forEach(item => {
    if (item.editing) canSave = false;
  })
  if(!canSave) return ElMessage.warning('请完成所有基金设置后再保存！')
  store.commit('refreshRate', form.refreshRate);
  store.commit('fundData', tableData.value);
  visible.value = false;
}

function deleteFund(index: number) {
  nextTick(() => {
    tableData.value.splice(index, 1);
  })
}

function addFund() {
  tableData.value.push({
    code: '',
    count: 0,
    remark: '',
    editing: true
  })
}

function done(index: number) {
  let target = tableData.value[index];
  if (!target.code) return ElMessage.warning('请输入基金代码！');
  target.editing = false;
}

</script>

<style lang="scss">
.fund-setting-title-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>