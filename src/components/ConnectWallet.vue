<script setup>
import { useHashConnectWallet } from '../store'

const hcWallet = useHashConnectWallet();

async function handleWalletConnection() {
  await hcWallet.connectWallet();
}

</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="300" src="@/assets/logo.svg" />

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            href="https://github.com/Hashpack/hashconnect"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <v-icon
              icon="mdi-view-dashboard"
              size="large"
              start
            />

            Hashconnect docs
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            @click=handleWalletConnection
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
          >
            <v-icon
              icon="mdi-speedometer"
              size="large"
              start
            />

            Connect with Hashpack
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            href="https://discord.com/invite/9tduCfV3JG"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <v-icon
              icon="mdi-account-group"
              size="large"
              start
            />

            Discord
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

