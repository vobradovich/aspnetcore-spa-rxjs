import * as React from 'react';
import { ICounterState, CounterActions, CounterStore } from '../store/Counter';
import connect from './connect';

interface ICounterProps extends ICounterState {
    increment: (value?: number) => void;
    reset: () => void;
}

const Counter = (props: ICounterProps) => (
    <div>
        <h1>Counter</h1>

        <p>This is a simple example of a React component.</p>

        <p>Current count: <strong>{ props.count }</strong></p>

        <button onClick={ () => { props.increment() } }>Increment</button>
        <button onClick={ () => { props.increment(-1) } }>Decrement</button>
        <button onClick={ () => { props.reset() } }>Reset</button>
    </div>
);

export default connect(CounterStore, CounterActions)(Counter);
