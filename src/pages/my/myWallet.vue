<template>
	<wallet-list/>
</template>
<script lang="ts">
	import { ComponentInternalInstance, computed, defineComponent, getCurrentInstance, ref } from 'vue'
	import walletList from '@/components/wallet-list/index.vue'
	export default defineComponent({
		components: {
			walletList
		},
		setup() {
		},
	})
</script>
<style lang="scss">
</style>
