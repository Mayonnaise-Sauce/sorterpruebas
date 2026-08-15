# Sorter

A simple web app for creating rankings by comparing two items at a time.

Choose an artist and sort their songs, albums, or the songs from a specific album. You can also create your own custom sorter with any list of items.

## Features

- Sort an artist's songs
- Sort an artist's albums
- Sort the songs from a specific album
- Create custom sorters with your own items
- Compare two items at a time
- Mark two items as equal or choose "No opinion"
- Generate a final ranking based on your choices
- Supports multiple artists and their own music data

## How it works

The sorter presents two items at a time. Choose the one you prefer, or select an option when you don't have a preference.

The app uses your choices to progressively build a ranking of all the items.

## Artists

Currently supported:

- Katarsis
- Aklì

More artists can be added by adding their data to the project.

## Tech Stack

- Vue 3
- Vite
- Vue Router
- Vuetify

## Running locally

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown by Vite in your browser.

## Notes

This is a personal project made for sharing with friends. It is not intended to be a public music database or a commercial application.
