<script setup>
import { ref } from "vue";
import { useHashConnectWallet } from '@/store/HashConnectStore'

let tokenToBeAssociated = ref("");
let tokenToBeApproved = ref("");
let allowanceAmount = ref("");
let whitelistAccountId = ref("");
let amountForDeposit = ref("");

const hcWallet = useHashConnectWallet();

async function handleApproveSpender() {
  await hcWallet.approveSpender(tokenToBeApproved.value, allowanceAmount.value);
}

async function associateSwapperWithToken() {
  await hcWallet.associateSwapperWithToken(tokenToBeAssociated.value);
}

async function handleWhitelist() {
  await hcWallet.whitelist();
}

async function handleDeposit() {
  await hcWallet.deposit();
}

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="associateSwapperWithToken">Associate swapper with token</v-btn>
      </v-col>
      <v-col>
        <v-text-field label="TokenID for Association" v-model="tokenToBeAssociated"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="handleApproveSpender">Approve spender</v-btn>
      </v-col>
      <v-col>
        <v-text-field label="TokenID for Approval" v-model="tokenToBeApproved"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Allowance amount" v-model="allowanceAmount"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="handleWhitelist">Whitelist user</v-btn>
      </v-col>
      <v-col>
        <v-text-field label="accountId" v-model="whitelistAccountId"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="handleDeposit">Deposit</v-btn>
      </v-col>
      <v-col>
        <v-text-field label="Deposit amount" v-model="amountForDeposit"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
