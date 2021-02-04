/* eslint-disable import/no-commonjs */
export default {
    namespace: 'home',

    state: {

    },

    effects: {

    },

    reducers: {
        save(state, {payload}) {
        return {...state, ...payload};
        }
    }
}