<script setup>
import packageJson from "@/../package.json";

import AppHeader from "@/components/AppHeader.vue";
import { artists } from "@/data/artists.js";
</script>

<template>
	<v-app>
		<!-- HEADER -->
		<AppHeader :artists="artists" />
		<!-- MAIN VIEWS -->
		<v-main>
			<router-view />
		</v-main>
		<!-- FOOTER -->
		<v-footer class="flex-grow-0 d-flex align-center justify-center">
			<span class="text-body-small py-2"> Created by Mayonnaise_Sauce · v{{ packageJson.version }} </span>
		</v-footer>
	</v-app>
</template>
