<script setup>
import customIcon from "@/assets/icons/custom.png";
import { artists } from "@/data/artists.js";
</script>

<template>
	<v-container class="fill-height">
		<!-- TITLE -->
		<v-row justify="center">
			<v-col cols="12" class="text-center">
				<h1 class="font-weight-bold">SORTER</h1>
				<p>Pick an artist to start sorting their songs or albums.<br />Or create your own custom ranking.</p>
			</v-col>
		</v-row>
		<!-- ARTIST SORTERS -->
		<v-row justify="center">
			<v-col v-for="artist in artists" :key="artist.id" class="text-center">
				<v-btn variant="plain" width="100" height="100" icon :to="{ path: artist.id }">
					<v-avatar size="100" :image="artist.icon" />
				</v-btn>
				<p class="text-wrap">{{ artist.name }}</p>
			</v-col>
		</v-row>
		<v-divider class="my-8">OR</v-divider>
		<!-- CUSTOM SORTER -->
		<v-row justify="center" class="mt-8">
			<v-col class="text-center">
				<v-btn variant="plain" width="100" height="100" icon to="/custom">
					<v-avatar size="100" :image="customIcon" />
				</v-btn>
				<p>Custom</p>
			</v-col>
		</v-row>
	</v-container>
</template>
