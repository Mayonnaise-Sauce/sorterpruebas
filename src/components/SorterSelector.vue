<script setup>
import { computed, ref } from "vue";
import { artists } from "@/data/artists.js";

// Artist ID received from the route
const props = defineProps({
	sorter: {
		type: String,
		required: true,
	},
});

// Finds the selected artist
const artist = computed(() => {
	return artists.find((artist) => artist.id === props.sorter);
});

// Controls whether the album selection dialog is open
const albumDialog = ref(false);
</script>

<template>
	<v-container v-if="artist" class="fill-height">
		<!-- TITLE -->
		<v-row justify="center">
			<v-col cols="12" class="text-center">
				<h2>{{ artist.data.title.toUpperCase() }} SORTER</h2>
				<p>What do you want to sort?</p>
			</v-col>
		</v-row>
		<!-- SORTERS -->
		<v-row justify="center">
			<v-col cols="12" sm="6" md="6" lg="4" class="d-flex">
				<v-card class="pa-8 w-100 text-center" :to="`/${artist.id}/songs`">
					<v-card-title>Songs</v-card-title>
					<v-card-subtitle class="text-wrap">Sort all {{ artist.name }} songs</v-card-subtitle>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="4" class="d-flex">
				<v-card class="pa-8 w-100 text-center" :to="`/${artist.id}/albums`">
					<v-card-title>Albums</v-card-title>
					<v-card-subtitle class="text-wrap">Sort all {{ artist.name }} albums</v-card-subtitle>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" md="6" lg="4" class="d-flex">
				<v-card class="pa-8 w-100 text-center" @click="albumDialog = true">
					<v-card-title>Album songs</v-card-title>
					<v-card-subtitle class="text-wrap">Choose an album and sort its songs</v-card-subtitle>
				</v-card>
			</v-col>
		</v-row>
		<!-- ALBUM SELECTION DIALOG -->
		<v-dialog v-model="albumDialog" max-width="500">
			<v-card>
				<v-card-title class="text-center pt-8">Choose an album</v-card-title>
				<v-card-text class="pa-8">
					<v-row align="stretch">
						<v-col v-for="album in artist.data.albums" :key="album.id" class="text-center">
							<v-btn icon variant="plain" width="80" height="80" :to="`/${artist.id}/albums/${album.id}`" @click="albumDialog = false">
								<v-avatar size="80" :image="album.icon" />
							</v-btn>
							<p class="text-wrap">{{ album.name }}</p>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>
