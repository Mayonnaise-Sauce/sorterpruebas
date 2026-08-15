<script setup>
import { computed, inject, watch } from "vue";

import { artists } from "@/data/artists.js";

// Accesses global sorter state and actions provided in main.js
const sorterState = inject("sorterState");
const sorterActions = inject("sorterActions");

// Data received from the current route
const props = defineProps({
	sorter: String,
	type: String,
	album: String,
});

// Finds the current artist
const artist = computed(() => {
	return artists.find((artist) => artist.id === props.sorter);
});

// Gets the current artist's data
const currentData = computed(() => {
	return artist.value?.data;
});

// Generates the title for the sorter based on the current route
const sorterTitle = computed(() => {
	if (!currentData.value) {
		return "";
	}

	if (props.album) {
		const album = currentData.value.albums.find((a) => a.id === props.album);
		const albumName = album?.name.toUpperCase();
		return `${albumName} SONGS`;
	}

	switch (props.type) {
		case "songs":
			return `${currentData.value.title} SONGS`;

		case "albums":
			return `${currentData.value.title} ALBUMS`;

		default:
			return currentData.value.title;
	}
});

// Gets the items that should be sorted
function getItems() {
	if (!artist.value) {
		return null;
	}

	// Sort songs from a specific album
	if (props.album) {
		const album = artist.value.data.albums.find((album) => album.id === props.album);

		return album?.songs;
	}

	// Sort all albums
	if (props.type === "albums") {
		return artist.value.data.albums.map((album) => album.name);
	}

	// Sort all songs
	return artist.value.data[props.type];
}

// Initializes the sorter when the route changes
watch(
	() => [props.sorter, props.type, props.album],
	() => {
		const items = getItems();

		if (!items) return;

		sorterActions.initSorter({
			id: artist.value.data.id,
			title: artist.value.data.title,
			items,
		});
	},
	{ immediate: true },
);

// Gets the current left item
const leftItem = computed(() => {
	const index = sorterState.lists[sorterState.currentLeftList]?.[sorterState.leftIndex];
	return sorterState.sortingItems[index];
});

// Gets the current right item
const rightItem = computed(() => {
	const index = sorterState.lists[sorterState.currentRightList]?.[sorterState.rightIndex];
	return sorterState.sortingItems[index];
});

// Sends the user's choice to the sorter
function choose(value, ev) {
	sorterActions.choose(value);

	if (ev && ev.currentTarget) ev.currentTarget.blur();
}
</script>

<template>
	<v-container class="fill-height">
		<!-- TITLE -->
		<v-row justify="center">
			<v-col cols="12" class="text-center">
				<h2>{{ props.sorter === "custom" ? sorterState.title.toUpperCase() + " SORTER" : sorterTitle.toUpperCase() }}</h2>
				<p>
					Choose the option you prefer in each battle.
					<br />
					Selecting "I like both" or "No opinion" too often may affect the accuracy of your results
				</p>
			</v-col>
		</v-row>
		<!-- BATTLE -->
		<v-row justify="center">
			<v-col cols="12" class="text-center">
				<h3 v-if="!sorterState.finished">Battle #{{ sorterState.question }}</h3>
				<h3 v-else>Total number of battles: {{ sorterState.question - 1 }}</h3>
				<v-progress-linear height="30" color="blue-grey" :model-value="sorterActions.progress()" rounded>{{ sorterActions.progress() }}%</v-progress-linear>
			</v-col>
		</v-row>
		<!-- ITEM BUTTONS -->
		<v-row v-if="!sorterState.finished" class="sorter" justify="center" align="stretch">
			<v-col cols="4">
				<v-btn class="sorter-button full-size-btn pa-8" @click="choose(-1, $event)">
					{{ leftItem }}
				</v-btn>
			</v-col>
			<v-col cols="4" class="d-flex flex-column">
				<v-btn class="flex-grow-1 mb-4" @click="choose(0, $event)">I like both</v-btn>
				<v-btn class="flex-grow-1" @click="choose(0, $event)">No opinion</v-btn>
			</v-col>
			<v-col cols="4">
				<v-btn class="sorter-button full-size-btn pa-8" @click="choose(1, $event)">
					{{ rightItem }}
				</v-btn>
			</v-col>
		</v-row>
		<!-- RESULTS TABLE -->
		<v-row v-else justify="center">
			<v-col cols="8" class="text-center">
				<p>Your ranking has been generated.</p>
				<v-table class="ranking-table" striped="even">
					<tbody>
						<tr v-for="item in sorterState.ranking" :key="item.position">
							<td class="text-right"># {{ item.position }}</td>
							<td class="text-center py-4">{{ item.name }}</td>
						</tr>
					</tbody>
				</v-table>
				<p>You can start over by reloading the page.</p>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
/* Keeps table full width and lets columns size naturally */
.ranking-table table {
	width: 100%;
	table-layout: auto;
}

/* Keeps rank number on one line and aligns it right */
.ranking-table .rank-index,
.ranking-table td:first-child {
	white-space: nowrap;
	padding-right: 12px;
	text-align: right;
}
</style>
