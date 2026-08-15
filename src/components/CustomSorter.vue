<script setup>
import { ref, inject, nextTick } from "vue";
import { useRouter } from "vue-router";

// Gets the router instance to navigate between pages
const router = useRouter();

// Stores the current input text
const input = ref("");

// Gets the reference to the input field for focusing it after adding an item
const itemInput = ref(null);

// Stores all items added by the user
const items = ref([]);

// Gets the sorter actions provided by a parent component
const sorterActions = inject("sorterActions");

// Stores the custom sorter title
const sorterTitle = ref("");

// Adds the current input as a new item
function addItem() {
	const value = input.value.trim();

	if (!value) return;

	items.value.push(value);
	input.value = "";

	// Focuses the input field after adding an item
	nextTick(() => {
		if (!itemInput.value) return;

		if (typeof itemInput.value.focus === "function") {
			itemInput.value.focus();
			return;
		}

		const el = itemInput.value.$el || itemInput.value;
		if (el && el.querySelector) {
			const native = el.querySelector('input, textarea');
			if (native && typeof native.focus === 'function') native.focus();
		}
	});
}

// Removes an item from the list using its position
function removeItem(index) {
	items.value.splice(index, 1);
}

// Finishes creating the custom sorter
function done() {
	if (items.value.length < 2) return;

	sorterActions.initCustomSorter(sorterTitle.value.trim(), items.value);

	router.push({ name: "customSorter" });
}
</script>

<template>
	<v-container class="fill-height">
		<!-- TITLE -->
		<v-row justify="center">
			<v-col cols="8" class="text-center">
				<h2>CUSTOM SORTER</h2>
				<p>Create your own ranking by adding the options you want to compare.</p>
			</v-col>
		</v-row>
		<!-- SORTER TITLE -->
		<v-row justify="center">
			<v-col cols="10">
				<v-text-field v-model="sorterTitle" label="Sorter title" variant="outlined" clearable hide-details />
			</v-col>
		</v-row>
		<!-- ITEM INPUT FIELD -->
		<v-row justify="center">
			<v-col cols="8">
				<v-text-field ref="itemInput" v-model="input" label="Add an item" variant="outlined" clearable hide-details @keyup.enter="addItem" />
			</v-col>
			<v-col cols="2">
				<v-btn class="full-size-btn" @click="addItem">Add</v-btn>
			</v-col>
		</v-row>
		<v-row v-if="items.length" justify="center">
			<p v-if="items.length === 1">1 item added</p>
			<p v-else>{{ items.length }} items added</p>
		</v-row>
		<!-- LIST OF ITEMS -->
		<v-row justify="center" v-show="items.length > 0">
			<v-col cols="8">
				<v-list>
					<v-list-item class="text-wrap" v-for="(item, index) in items" :key="index">
						{{ item }}
						<template #append>
							<v-btn variant="text" icon="mdi-delete" @click="removeItem(index)"> </v-btn>
						</template>
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
		<!-- DONE BUTTON -->
		<v-row justify="center">
			<v-btn :disabled="items.length < 2 || !sorterTitle.trim()" @click="done">Start sorting</v-btn>
		</v-row>
	</v-container>
</template>
