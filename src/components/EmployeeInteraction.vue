<script setup>
import { ref } from "vue";
import { useHashConnectWallet } from '@/store/HashConnectStore'

let balance = ref("");

const hcWallet = useHashConnectWallet();

async function handleSwap() {
  await hcWallet.swap();
}

async function getUserBalance() {
  const res = await hcWallet.getAmountForWithdraw();
  balance.value = res;
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="handleSwap">Swap funds</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="getUserBalance">Get user balance</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Balance: {{ balance }} USDC
      </v-col>
    </v-row>
  </v-container>
</template>
