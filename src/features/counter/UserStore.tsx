import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { AppThunk, RootState } from '../../app/store';
import User from '../../Models/User';

interface UserState {
    user: User | undefined;
}

const initialState: UserState = {
    user: undefined,
};

export const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = undefined;
        },
    },
});

export const { setUser, clearUser } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => (dispatch) => {
//     setTimeout(() => {
//         dispatch(incrementByAmount(amount));
//     }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState): number => state.counter.value;

export default slice.reducer;
