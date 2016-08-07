import * as Rx from 'rxjs';
import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';

// The top-level state object
export interface IApplicationState {
    counter: Counter.ICounterState,
    weatherForecasts: WeatherForecasts.WeatherForecastsState
}

const initialState: IApplicationState = { counter: { count: 0 }, weatherForecasts: { isLoading: false, startDateIndex: 0, forecasts: [], params: { startDateIndex: "0" } } }
export const Store = new Rx.BehaviorSubject<IApplicationState>(initialState);

const reducers = Rx.Observable.merge(
    Counter.CounterReducer.map(reducer => (state: IApplicationState): IApplicationState => (Object.assign({}, state, { counter: reducer(state.counter) }))),
    WeatherForecasts.CounterReducer.map(reducer => (state: IApplicationState): IApplicationState => (Object.assign({}, state, { weatherForecasts: reducer(state.weatherForecasts) })))
);

reducers
    .scan((state: IApplicationState, r) => r(state), Store.getValue())
    .subscribe(Store);

Store.subscribe(console.log);