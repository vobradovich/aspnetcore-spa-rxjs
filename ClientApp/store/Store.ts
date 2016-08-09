import * as Rx from 'rxjs';
import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';


// The top-level state object interface
export interface IApplicationState {
    counter: Counter.ICounterState,
    weatherForecasts: WeatherForecasts.WeatherForecastsState
}

const initialState: IApplicationState = { counter: { count: 0 }, weatherForecasts: { isLoading: false, startDateIndex: 0, forecasts: [] } }

// STORE The top-level state object 
export const Store = new Rx.BehaviorSubject<IApplicationState>(initialState);

const scopedReducers = {
    counter: Counter.CounterReducer,
    weatherForecasts: WeatherForecasts.CounterReducer
}

const reducers = Object.keys(scopedReducers)
    .filter(key => scopedReducers[key] instanceof Rx.Observable && typeof Store.getValue()[key] !== "undefined")
    .map(key => scopedReducers[key].map(reducer => (state: IApplicationState): IApplicationState => (Object.assign({}, state, { [key]: reducer(state[key]) } ))));

Rx.Observable.merge(...reducers)
    .scan((state: IApplicationState, reducer) => reducer(state), Store.getValue())
    .subscribe(Store);

// DEBUG
Store.subscribe(console.log);