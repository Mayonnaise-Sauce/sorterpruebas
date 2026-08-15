import { reactive } from "vue";

const initialState = {
	customSorterTitle: "", // Title of the custom sorter

	sortingItems: [], // Original items to sort
	lists: [], // Lists created while splitting the items
	parents: [], // Stores which list created each smaller list
	equals: [], // Stores items considered equal by the user
	results: [], // Temporary list used while merging items

	leftIndex: 0, // Current position in the left list
	rightIndex: 0, // Current position in the right list

	currentLeftList: 0, // Index of the current left list being compared
	currentRightList: 0, // Index of the current right list being compared

	question: 1, // Current battle number

	totalSize: 0, // Total number of comparisons needed
	finishedSize: 0, // Number of comparisons already completed

	finished: false, // Indicates whether sorting has finish

	ranking: [], // Final sorted ranking
};

// Creates and manages the state and actions of the sorter
export function useSorter() {
	const state = reactive({ ...initialState });

	// Resets the sorter back to its initial state
	function reset() {
		Object.assign(state, structuredClone(initialState));
	}

	// Returns a randomly shuffled copy of an array
	function shuffle(items) {
		const shuffled = [...items];

		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		return shuffled;
	}

	// Starts a sorter using the given sorter data
	// Prepares shuffled items, splits lists for the merge process, and sets counters
	function initSorter(sorter) {
		reset();

		state.title = sorter.title;
		state.sortingItems = shuffle(sorter.items);
		state.lists = [state.sortingItems.map((_, index) => index)];
		state.parents = [-1];

		for (let i = 0; i < state.lists.length; i++) {
			const list = state.lists[i];

			if (list.length < 2) continue;

			const middle = Math.ceil(list.length / 2);

			state.lists.push(list.slice(0, middle), list.slice(middle));
			state.totalSize += list.length;
			state.parents.push(i, i);
		}

		state.equals = Array(state.sortingItems.length).fill(-1);
		state.currentLeftList = state.lists.length - 2;
		state.currentRightList = state.lists.length - 1;
	}

	// Initializes a custom sorter using a user-provided title and items
	function initCustomSorter(title, items) {
		initSorter({
			id: "custom",
			title: title,
			items,
		});
	}

	// Handles the user's choice during a comparison
	// value < 0 -> left item wins
	// value > 0 -> right item wins
	// value === 0 -> both items are considered equal
	function choose(value) {
		if (state.finished) return;

		const leftList = state.lists[state.currentLeftList];
		const rightList = state.lists[state.currentRightList];

		if (value < 0) {
			state.results.push(leftList[state.leftIndex++]);
		} else if (value > 0) {
			state.results.push(rightList[state.rightIndex++]);
		} else {
			const left = leftList[state.leftIndex++];
			const right = rightList[state.rightIndex++];

			state.results.push(left, right);
			state.equals[left] = right;

			state.finishedSize++;
		}

		state.finishedSize++;

		mergeRemaining();

		state.question++;
	}

	// Completes a merge when one of the lists has no remaining items
	function mergeRemaining() {
		const left = state.lists[state.currentLeftList];
		const right = state.lists[state.currentRightList];

		while (state.leftIndex < left.length && state.rightIndex === right.length) {
			state.results.push(left[state.leftIndex++]);
			state.finishedSize++;
		}

		while (state.rightIndex < right.length && state.leftIndex === left.length) {
			state.results.push(right[state.rightIndex++]);
			state.finishedSize++;
		}

		if (state.leftIndex !== left.length || state.rightIndex !== right.length) return;

		const parent = state.parents[state.currentLeftList];

		state.lists[parent] = [...state.results];
		state.lists.splice(-2);

		state.currentLeftList -= 2;
		state.currentRightList -= 2;

		state.results = [];
		state.leftIndex = 0;
		state.rightIndex = 0;

		if (state.currentLeftList < 0) finish();
	}

	// Generates the final ranking after sorting is completed
	function finish() {
		state.finished = true;

		state.ranking = state.lists[0].map((item, index) => ({ position: index + 1, name: state.sortingItems[item] }));
	}

	// Calculates sorting progress percentage
	function progress() {
		return state.totalSize ? Math.floor((state.finishedSize * 100) / state.totalSize) : 0;
	}

	// Makes the state and these functions available to Vue components
	return {
		state,
		initSorter,
		initCustomSorter,
		choose,
		progress,
	};
}
