import GlobalSplash from '@/components/GlobalSplash.vue';
import { createVNode, render } from 'vue';
import { defineBoot } from '#q-app';

let vm;

export default defineBoot(({ app }) => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const vnode = createVNode(GlobalSplash);
  render(vnode, el);

  vm = vnode.component?.exposed;

  // Intercept $q.loading and replace with custom splash
  const $q = app.config.globalProperties.$q;

  if ($q?.loading) {
    const originalShow = $q.loading.show;
    const originalHide = $q.loading.hide;

    $q.loading.show = () => {
      showSplash();
    };

    $q.loading.hide = () => {
      hideSplash();
    };
  }
});

export function showSplash() {
  vm?.show();
}

export function hideSplash() {
  vm?.hide();
}
