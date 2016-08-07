import * as Rx from 'rxjs';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.


export interface WeatherForecastsState {
    isLoading: boolean;
    startDateIndex: number;
    forecasts: WeatherForecast[];
    params: RouteParams;
}

export interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

interface RouteParams {
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

export const CounterReducer = Rx.Observable.merge(
    WeatherForecastActions.request
        .do(WeatherForecastActions.receive)
        .map((startDateIndex) => (state: WeatherForecastsState): WeatherForecastsState => (Object.assign({}, state, { startDateIndex: startDateIndex, isLoading: true }))),

    WeatherForecastActions.receive
        .switchMap((startDateIndex) => {
            //return Rx.Observable.ajax(`/api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`);
            let fetchTask = fetch(`/api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`)
            return Rx.Observable.fromPromise<Response>(fetchTask).catch(e => Rx.Observable.empty());
        })
        //.map((response: Rx.AjaxResponse) => response.response)
        .switchMap((response: Response) => Rx.Observable.fromPromise(response.json()))
        .map((data) => (state: WeatherForecastsState): WeatherForecastsState => (Object.assign({}, state, { forecasts: data, isLoading: false })))
);