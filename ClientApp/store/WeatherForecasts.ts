import * as Rx from 'rxjs';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.


export interface IWeatherForecastsState {
    isLoading: boolean;
    startDateIndex: number;
    forecasts: IWeatherForecast[];
    params: IRouteParams;
}

export interface IWeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

interface IRouteParams {
    startDateIndex: string;
}

export const WeatherForecastActions = {
    request: new Rx.Subject<number>(),
    receive: new Rx.Subject<number>()
};

// export const CounterReducer = Rx.Observable.merge(
//     WeatherForecastActions.request.zip(
//         WeatherForecastActions.request.switchMap((startDateIndex) => {
//             let fetchTask = fetch(`/api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`)
//             return Rx.Observable.fromPromise<Response>(fetchTask).catch(e => Rx.Observable.empty());
//         }).switchMap((response: Response) => Rx.Observable.fromPromise(response.json())),
//         (startDateIndex, data) => ({ startDateIndex: startDateIndex, forecasts: data })
//     ).map((data) => (state: WeatherForecastsState): WeatherForecastsState => {
//          return state.startDateIndex === data.startDateIndex ? state : Object.assign({}, state, data);
//     })
// );

export const WeatherForecastsReducer = Rx.Observable.merge(
    WeatherForecastActions.request
        .do(WeatherForecastActions.receive)
        .map((startDateIndex) => (state: IWeatherForecastsState): IWeatherForecastsState => (Object.assign({}, state, { startDateIndex: startDateIndex, isLoading: true }))),

    WeatherForecastActions.receive
        .switchMap((startDateIndex) => {
            //return Rx.Observable.ajax(`/api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`);
            let fetchTask = fetch(`/api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`)
            return Rx.Observable.fromPromise<Response>(fetchTask).catch(e => Rx.Observable.empty());
        })
        //.map((response: Rx.AjaxResponse) => response.response)
        .switchMap((response: Response) => Rx.Observable.fromPromise(response.json()))
        .map((data) => (state: IWeatherForecastsState): IWeatherForecastsState => (Object.assign({}, state, { forecasts: data, isLoading: false })))
);

// STORE
const initialState: IWeatherForecastsState = { isLoading: false, startDateIndex: 0, forecasts: [], params: { startDateIndex: "0" } };
export const WeatherForecastsStore = new Rx.BehaviorSubject<IWeatherForecastsState>(initialState);

WeatherForecastsReducer.scan((state: IWeatherForecastsState, r) => r(state), WeatherForecastsStore.getValue()).subscribe(WeatherForecastsStore);

// DEBUG
WeatherForecastsStore.subscribe(console.log);