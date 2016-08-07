import * as Rx from 'rxjs';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ICounterState {
    count: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

export const CounterActions = {
    increment: new Rx.Subject<number>(),
    reset: new Rx.Subject<void>()
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const CounterReducer = Rx.Observable.merge(
    CounterActions.increment.map((n = 1) => (state: ICounterState): ICounterState => Object.assign({}, state, { count: state.count + n })),
    CounterActions.reset.map(() => (state: ICounterState): ICounterState => Object.assign({}, state, { count: 0 }))
);

// STORE
const initialState: ICounterState = { count: 0 };
export const CounterStore = new Rx.BehaviorSubject<ICounterState>(initialState);

CounterReducer.scan((state: ICounterState, r) => r(state), CounterStore.getValue()).subscribe(CounterStore);

// DEBUG
CounterStore.subscribe(console.log);