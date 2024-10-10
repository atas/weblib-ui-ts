import * as React from 'react';

/** @deprecated Use functional components */
export default class ReactComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
	setStateAsync = async (newState: S) =>
		new Promise(resolve => this.setState(newState, resolve as any));

	mutate = (newState: Partial<S>) => this.setState({ ...this.state, ...newState });

	mutateAsync = async (newState: Partial<S>) =>
		new Promise(resolve => this.setState({ ...this.state, ...newState }, resolve as any));
}
