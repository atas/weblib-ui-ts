import React, { useState } from 'react';

interface IRadioListProps {
	children?: React.ReactElement<typeof RadioItem>[];
	onChange: (value: string) => void;
	title?: string;
}

export function RadioList(props: IRadioListProps) {
	const [selectedValue, setSelectedValue] = useState('');

	const select = (value: string) => {
		props.onChange(value);
		setSelectedValue(value);
	};

	return (
		<div className="radioList">
			<div className="radioListTitle">{props.title}</div>
			{(props.children || []).map(child => child)}
		</div>
	);
}

interface IRadioItemProps {
	selectedValue?: string;
	value: string;
	text: string;
	onSelect: (value: string) => void;
}

export function RadioItem(props: IRadioItemProps) {
	return (
		<div
			key={props.value}
			className={
				'radioItemWrapper ' + (props.selectedValue === props.value ? 'selected' : '')
			}
			onClick={() => props.onSelect(props.value)}>
			<div className="radioItem">{props.text}</div>
		</div>
	);
}
