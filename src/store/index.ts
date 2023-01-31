import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

interface FundItem {
  code: string;
  count: number;
  remark?: string;
  editing?: boolean;
}

interface State {
  directCloseApp: boolean;
  showCloseOptions: boolean;
  fundData: FundItem[];
  refreshRate: number;
}

// 1. 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const state: State = {
  directCloseApp: false, //是否直接关闭App
  showCloseOptions: true, //是否显示关闭确认
  fundData: [] as FundItem[], //基金数据
  refreshRate: 60//更新频率
};

export default createStore<State>({
  state,
  mutations: {
    directCloseApp(state, val: boolean) {
      state.directCloseApp = val;
    },
    showCloseOptions(state, val: boolean) {
      state.showCloseOptions = val;
    },
    fundData(state, val: FundItem[]) {
      state.fundData = val;
    },
    refreshRate(state, val: number) {
      state.refreshRate = val;
    },
  },
  actions: {},
  modules: {},
});
