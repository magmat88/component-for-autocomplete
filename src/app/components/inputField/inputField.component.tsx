import React, { useRef, useState } from 'react';
import { EVENT_CODE_ARROW_DOWN_KEY, EVENT_CODE_ENTER_KEY } from '../../utils/consts';
import { filterSuggestions } from '../../utils/utils';
import { Tag } from '../tag/tag.component';
import { Suggestions } from '../suggestions/suggestions.component';
import './inputField.component.scss';

interface InputFieldProps {
    placeholder: string;
    predefinedList: Array<string>;
}

export function InputField({
    placeholder,
    predefinedList
}: InputFieldProps): JSX.Element {
    const [userInput, setUserInput] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Array<string>>([]);
    const [tags, setTags] = useState<Array<string>>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const suggestionsRef = useRef<Array<HTMLLIElement>>([]);

    function onChangeUserInput(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        setUserInput(event.target.value);
        const filteredSuggestions = filterSuggestions(
            event.target.value,
            predefinedList
        );
        setSuggestions(filteredSuggestions);
    }

    function onClickHandler(tag: string): void {
        const indexToRemove = tags.indexOf(tag);
        tags.splice(indexToRemove, 1);
        setTags([...tags]);
    }

    function onKeyDownInputHandler(
        event: React.KeyboardEvent<HTMLInputElement>
    ): void {
        if (event.code === EVENT_CODE_ARROW_DOWN_KEY) {
            const firstSuggestionRef: HTMLElement = suggestionsRef.current[0];
            if (firstSuggestionRef) {
                firstSuggestionRef.focus();
            }
        }

        if (event.code === EVENT_CODE_ENTER_KEY) {
            if (tags.indexOf((event.target as HTMLInputElement).value) === -1) {
                setTags([...tags, (event.target as HTMLInputElement).value]);
            }
            setUserInput('');
            setSuggestions([]);
        }
    }

    function onSelectSuggestionHandler() {
        setSuggestions([]);
        setUserInput('');
        inputRef.current?.focus();
    }

    return (
        <div>
            <div className="input-field">
                <div className="input-with-tags">
                    <div className="tags">
                        {tags.map((tag) => (
                            <Tag
                                key={`tag-${tag}`}
                                onClickHandler={() => onClickHandler(tag)}
                                tagName={tag}
                            />
                        ))}
                    </div>
                    <input
                        onChange={onChangeUserInput}
                        onKeyDown={onKeyDownInputHandler}
                        placeholder={placeholder}
                        ref={(element) => (inputRef.current = element)}
                        tabIndex={0}
                        type="text"
                        value={userInput}
                    />
                </div>

                <Suggestions
                    inputReference={inputRef}
                    onSelectSuggestion={onSelectSuggestionHandler}
                    onSetTags={setTags}
                    suggestions={suggestions}
                    suggestionsReference={suggestionsRef}
                    tags={tags}
                />
            </div>
        </div>
    );
}
