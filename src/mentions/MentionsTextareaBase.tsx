import React, { useEffect, useState } from 'react';
import {
	Mention,
	MentionItem,
	MentionsInput,
	MentionsInputProps,
	OnChangeHandlerFunc,
	SuggestionDataItem,
} from 'react-mentions';

interface MyMentionInputProps {
	mentionsFetchFn: (word: string, cb: (data: SuggestionDataItem[]) => void) => void;
}

type CombinedMentionsInputProps = MyMentionInputProps & Partial<MentionsInputProps>;

const MentionsTextareaBase: React.FC<CombinedMentionsInputProps> = ({
	mentionsFetchFn,
	onChange,
	...props
}) => {
	const [txt, setTxt] = useState<string | number | readonly string[]>(props.defaultValue || '');

	const handleChange: OnChangeHandlerFunc = (
		event: { target: { value: string } },
		newValue: string,
		newPlainTextValue: string,
		mentions: MentionItem[],
	) => {
		setTxt(newValue);
		onChange && onChange(event, newValue, newPlainTextValue, mentions);
	};

	useEffect(() => {
		setTxt(props.value || '');
	}, [props.value]);

	return (
		<MentionsInput
			{...props}
			style={{ maxHeight: 'calc(100vh - 400px)', ...defaultStyle }}
			a11ySuggestionsListLabel={'Suggested mentions'}
			allowSuggestionsAboveCursor
			className="mentions"
			value={txt + ''}
			onChange={handleChange}>
			<Mention data={mentionsFetchFn} trigger="@" className="mentions__mention" />
		</MentionsInput>
	);
};

const defaultStyle = {
	control: {
		fontWeight: 'normal',
	},
	highlighter: {
		overflow: 'hidden',
	},
	input: {
		margin: 0,
		overflow: 'auto',
	},
	'&multiLine': {
		control: {
			fontFamily: "'Roboto', sans-serif",
		},
		highlighter: {
			padding: 9,
		},
		input: {
			padding: 9,
			minHeight: 3,
			outline: 0,
			overflow: 'hidden',
		},
	},
	suggestions: {
		bottom: '0',
		top: 'unset',
		list: {
			backgroundColor: '#666',
			border: '1px solid rgba(0,0,0,0.15)',
			fontSize: 14,
		},
		item: {
			padding: '5px 15px',
			borderBottom: '1px solid rgba(0,0,0,0.15)',
			'&focused': {
				backgroundColor: '#999',
			},
		},
	},
};

export default MentionsTextareaBase;
