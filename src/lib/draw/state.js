import { repetitions } from "$lib/stores/rectangles"
import { mod } from '$lib/math/number';

export const state = {
    lop: 0.0,
    rop: 0.0,

    imageIndices: [],
    currentIdx: 0,
    imageT: 0.0
}

export const cycleImageIdx = () => {
    state.imageT = mod(state.imageT + 1, repetitions)
}