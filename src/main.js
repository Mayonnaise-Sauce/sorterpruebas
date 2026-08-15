import "@mdi/font/css/materialdesignicons.css";
import "@/assets/main.css";

import { createApp } from "vue";

import App from "@/App.vue";

import router from "@/router";
import { useSorter } from "@/composables/useSorter.js";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Creates the Vue application instance using the root component
const app = createApp(App);

// Creates the sorter manager and its reactive state
const sorter = useSorter();

// Makes the sorter state and sorter actions available to all components using inject()
app.provide("sorterState", sorter.state);
app.provide("sorterActions", sorter);

// Adds Vuetify to the Vue application
app.use(
	createVuetify({
		components,
		directives,
	}),
);

// Adds Vue Router to handle page navigation
app.use(router);

// Starts the Vue application inside the #app element
app.mount("#app");
