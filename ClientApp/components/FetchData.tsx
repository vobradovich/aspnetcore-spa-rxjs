import * as React from 'react';
import { Link } from 'react-router';
import { Store } from '../store/Store';
import connect from './connect';
import { WeatherForecast, WeatherForecastsState, WeatherForecastActions } from '../store/WeatherForecasts';

interface IWeatherForecastsProps extends WeatherForecastsState {
    params: IRouteParams;
}

interface IRouteParams {
    startDateIndex?: string;
}

class FetchData extends React.Component<WeatherForecastsState, void> {
    public render() {
        return <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            { this.renderForecastsTable() }
            { this.renderPagination() }
        </div>;
    }

    private renderForecastsTable() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp.(C) </th>
                    <th>Temp.(F) </th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {this.props.forecasts.map(forecast =>
                    <tr key={ forecast.dateFormatted }>
                        <td>{ forecast.dateFormatted }</td>
                        <td>{ forecast.temperatureC }</td>
                        <td>{ forecast.temperatureF }</td>
                        <td>{ forecast.summary }</td>
                    </tr>
                ) }
            </tbody>
        </table>;
    }

    private renderPagination() {
        let prevStartDateIndex = this.props.startDateIndex - 5;
        let nextStartDateIndex = this.props.startDateIndex + 5;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={ `/fetchdata/${prevStartDateIndex}` }>Previous</Link>
            <Link className='btn btn-default pull-right' to={ `/fetchdata/${nextStartDateIndex}` }>Next</Link>
            { this.props.isLoading ? <span>Loading...</span> : []}
        </p>;
    }
}

export default connect(Store.map(s => s.weatherForecasts), null, (props: IWeatherForecastsProps) => {
    let startDateIndex = parseInt(props.params.startDateIndex) || 0;
    if (startDateIndex !== props.startDateIndex) {
        WeatherForecastActions.request.next(startDateIndex);
    }
})(FetchData);
