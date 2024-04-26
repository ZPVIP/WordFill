import React, { useState, useEffect, createRef } from 'react';
import words from './words.json';

function WordFill() {
    const [word, setWord] = useState({ incomplete_word: '', complete_word: '' });
    const [wrong, setWrong] = useState('');
    const [completeWord, setCompleteWord] = useState('');
    const [inputs, setInputs] = useState([]);
    const [currentInputIndex, setCurrentInputIndex] = useState(0);
    const inputRefs = inputs.map(() => createRef());

    const [isRandom, setIsRandom] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {
        fetchWord();
    }, []);

    const fetchWord = () => {
        try {
            const keys = Object.keys(words);
            let key;
            if (isRandom) {
                key = keys[Math.floor(Math.random() * keys.length)];
            } else {
                key = keys[currentIndex % keys.length];
                setCurrentIndex(currentIndex + 1);
            }
            const data = { incomplete_word: key, complete_word: words[key] };
            setWord(data);
            setInputs(new Array(data.complete_word.length - data.incomplete_word.length).fill(''));
            setCurrentInputIndex(0);
        } catch (error) {
            console.error('Failed to fetch word:', error);
        }
    };


    const handleInputChange = (e, index) => {
        const newInputs = [...inputs];
        newInputs[index] = e.target.value;
        setInputs(newInputs);
        console.log('Input:', newInputs.join(''));
        console.log('expected:', word.complete_word.slice(word.incomplete_word.length));
        // If the cursor is at the last input,
        // and if the answer is correct, fetch a new word, and focus on the first input, else clear all the inputs, and focus on the first input
        // If the cursor is not at the last input, focus on the next input
        if (index === inputs.length - 1) {
            if (newInputs.join('') === word.complete_word.slice(word.incomplete_word.length)) {
                fetchWord();
                setWrong('');
                setCompleteWord('');
                inputRefs[0].current.focus();
            } else {
                setInputs(new Array(word.complete_word.length - word.incomplete_word.length).fill(''));
                inputRefs[0].current.focus();
                // 在input 后面加上一个红色的 x, 表示答案错误
                setWrong('x');
            }
        } else if (e.target.value !== '') {
            setCurrentInputIndex(index + 1);
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'a') {
            setCompleteWord(word.complete_word);
        }
        // If the user press backspace, delete current input and focus on the previous input
        if (e.key === 'Backspace') {
            console.log('backspace');
            console.log('currentInputIndex:', currentInputIndex);
            const prevInputIndex = currentInputIndex - 1;
            if (prevInputIndex >= 0) {
                setCurrentInputIndex(prevInputIndex);
                inputRefs[prevInputIndex].current.focus();
            }
        }
    };

    return (
        <div>
        <div style={{position: 'absolute', top: '10px', right: '10px'}}>
            <input
            type="checkbox"
            checked={isRandom}
            onChange={() => setIsRandom(!isRandom)}
        /> Random
        </div>
        <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ display: 'flex', fontSize: '5em', justifyContent: 'center', alignItems: 'center' }}>
                <span>{word.incomplete_word}</span>
                    {inputs.map((value, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={handleKeyDown}
                            style={{width: '60px', height: '80px', textAlign: 'center', fontSize: '1em', margin: '0 5px', border: '1px solid #000'}}
                        />
                    ))}
                <span style={{color: 'red', padding: '0 0 0 20px'}}>{wrong}</span>
            </div>
            <div>&nbsp;</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span>{completeWord}</span>
            </div>
        </div>
        </div>
    );
}

export default WordFill;

