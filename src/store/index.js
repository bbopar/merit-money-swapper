import { createPinia } from 'pinia';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import useConfig from '@/store/ConfigStore';
import { useHashConnectWallet } from '@/store/HashConnectStore';

/** Pinia Store */
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

export { useConfig, useHashConnectWallet };
