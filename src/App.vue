<template>
  <AppHeader />
  <div class="main-container">
    <AppAside />
    <el-config-provider size="small" :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppAside from '@/components/AppAside.vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style lang="scss">

</style>