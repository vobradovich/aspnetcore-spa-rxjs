import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Rx from 'rxjs';

function connect(observable: Rx.Observable<Object>) {
    return function wrap(WrappedComponent: any, receiveProps: Function = null) {
        return class Connect extends React.Component<any, Object> {
            private subscription;

            componentWillMount() {
                this.subscription = observable.subscribe(this.setState.bind(this));
                receiveProps ? receiveProps(this.props) : null;
            }

            componentWillReceiveProps(nextProps) {
                receiveProps ? receiveProps(nextProps) : null;
            }

            componentWillUnmount() {
                this.subscription.unsubscribe();
            }

            render() {
                return (
                    <WrappedComponent {...this.state} {...this.props} />
                );
            }
        };
    }
}

export default connect;