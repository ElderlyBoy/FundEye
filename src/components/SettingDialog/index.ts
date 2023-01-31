import Component from './index.vue';
import { h, render } from 'vue';

import type store from '@/store'

interface Props {
  store: typeof store;
}

class Init {
  constructor(props: Props) {
    const vm = h(Component, props);
    const container = document.createElement('div');
    render(vm, container);
    document.body.appendChild(container.firstElementChild as HTMLDivElement);
  }
}

export default Init