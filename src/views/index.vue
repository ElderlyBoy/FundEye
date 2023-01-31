<template>
  <ElTable :data="tableData" border stripe v-loading="loading" height="calc(100vh - 90px)">
    <ElTableColumn fixed="left" type="index" label="序号" width="50px" align="center"></ElTableColumn>
    <ElTableColumn fixed="left" label="基金名称" min-width="200px" prop="name"></ElTableColumn>
    <ElTableColumn label="持仓（份）" min-width="100px">
      <template v-slot="{$index}">{{ store.state.fundData[$index]?.count }}</template>
    </ElTableColumn>
    <ElTableColumn label="昨日净值（元）" min-width="110px" prop="dwjz"></ElTableColumn>
    <ElTableColumn label="预估净值（元）" min-width="110px" prop="gsz"></ElTableColumn>
    <ElTableColumn label="预估增长率" min-width="110px" prop="gszzl">
      <template v-slot="{row}">
        <ElLink :type="row.gszzl >= 0 ? 'danger' : 'success'">{{ row.gszzl }}%</ElLink>
      </template>
    </ElTableColumn>
    <ElTableColumn fixed="right" label="预估收益(元)" min-width="100px">
      <template v-slot="{$index}">
        <ElLink :type="getMoney($index) >= 0 ? 'danger' : 'success'">{{ getMoney($index) }}</ElLink>
      </template>
    </ElTableColumn>
  </ElTable>
  <ElScrollbar width="100%">
    <div class="table-append">
      <span>更新频率：</span>
      <ElTag type="warning">{{ store.state.refreshRate }}秒</ElTag>
      <span class="title">更新于：{{ tableData[0]?.gztime }}</span>
      <span class="title">持仓总额：</span>
      <ElTag type="danger">{{ getTotalMoney() }}元</ElTag>
      <span class="title">预估盈亏：</span>
      <ElTag type="success">{{getResult()}}元</ElTag>
    </div>
  </ElScrollbar>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { key } from "@/store/index";

const store = useStore(key);
const loading = ref(true);

// eslint-disable-next-line
const tableData = ref([] as any[]);

// eslint-disable-next-line
function jsonpgz(val: any) {
  return val;
}

function init() {
  loading.value = true;
  Promise.allSettled(store.state.fundData.map((item) => {
    return axios.get(`https://fundgz.1234567.com.cn/js/${item.code}.js?rt=${Date.now()}`)
  })).then(res => {
    tableData.value = res.map(item => {
      if (item.status === "fulfilled") {
        if (/^jsonpgz\([\w\W]+\);$/.test(item.value.data)) {
          return eval(item.value.data)
        } else {
          return {}
        }
      } else {
        return {}
      }
    })
  }).catch(() => {
    alert('发生错误')
  }).finally(() => {
    loading.value = false;
  })
}

init()
let timmer = setInterval(() => {
  init()
}, store.state.refreshRate * 1000)

watch(store.state, () => {
  clearInterval(timmer);
  init();
  timmer = setInterval(() => {
    init();
  }, store.state.refreshRate * 1000)
})

function getMoney(index: number): number {
  // eslint-disable-next-line
  const row: any = tableData.value[index];
  row.count = store.state.fundData[index]['count'];

  let money_1 = row.count * row.dwjz;
  let money_2 = row.count * row.gsz;

  return Math.round((money_2 - money_1) * 100) / 100;
}

function getTotalMoney(): number {
  let total = 0;
  // eslint-disable-next-line
  tableData.value.forEach((item: any, index) => {
    total += item.dwjz * store.state.fundData[index]['count'];
  })
  return Math.round(total * 100) / 100;
}

function getResult() {
  let total = 0;
  tableData.value.forEach((_item, index) => {
    total += getMoney(index);
  })
  return Math.round(total * 100) / 100;
}

</script>

<style lang="scss">
.table-append {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
  background: var(--el-border-color-lighter);
  box-sizing: border-box;
  border-top: var(--el-border);
  padding: 0 10px;
  white-space: nowrap;
  min-width: fit-content;
  > .title {
    margin-left: 10px;
  }
}
</style>