<template>
  <header class="app-header">
    <img src="/icon.png" alt="">
    <h1>{{ title }}</h1>
    <ElButton type="primary" @click="setting">设置</ElButton>
    <ElButton type="warning" @click="minimize">最小化</ElButton>
    <ElButton type="danger" @click="close">关闭</ElButton>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SettingDialog from '@/components/SettingDialog/index'
import { useStore } from 'vuex';
import { key } from '@/store/index'
import { ipcRenderer } from 'electron';
import { ElMessageBox } from 'element-plus';
const title = ref(document.title);

const store = useStore(key);
function setting() {
  new SettingDialog({
    store
  })
}
function close() {
  ElMessageBox.confirm('是否确认退出程序？', '提示', {
    type: 'warning'
  }).then(() => {
    ipcRenderer.send('quit');
  }).catch(() => {
    return false
  })
}

function minimize() {
  ipcRenderer.send('minimize');
}
</script>

<style lang="scss">
.app-header {
  -webkit-app-region: drag;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--el-bg-color);
  height: 40px;
  padding: 0 10px;
  position: fixed;
  z-index: 3000;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px solid var(--el-border-color);
  >img {
    height: 30px;
    width: 30px;
    border-radius: 30px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  >h1 {
    font-size: 1em;
    flex-grow: 2;
  }
  >.el-button {
    -webkit-app-region: none;
  }
}
</style>