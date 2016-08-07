import * as React from 'react';
import { ICounterState, CounterActions } from '../store/Counter';
import { Store } from '../store/Store';
import connect from './connect';

class Counter extends React.Component<ICounterState, any> {
    public render() {
        return <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p>Current count: <strong>{ this.props.count }</strong></p>

            <button onClick={ () => { CounterActions.increment.next() } }>Increment</button>
            <button onClick={ () => { CounterActions.increment.next(-1) } }>Decrement</button>
            <button onClick={ () => { CounterActions.reset.next() } }>Reset</button>
        </div>;
    }
}

export default connect(Store.map(s => s.counter))(Counter);
