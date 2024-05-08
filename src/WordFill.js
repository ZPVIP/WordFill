import React, { useState, useEffect, createRef } from 'react';
import all_words from './words.json';

function WordFill() {
    const [word, setWord] = useState({ incomplete_word: '', complete_word: '', context: '' });
    const [wrong, setWrong] = useState('');
    const [completeWord, setCompleteWord] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [playSound, setPlaySound] = useState(true);
    const [inputs, setInputs] = useState([]);
    const [currentInputIndex, setCurrentInputIndex] = useState(0);
    const inputRefs = inputs.map(() => createRef());

    const [isRandom, setIsRandom] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const words = all_words.words;
    const audioTyping = new Audio('/sounds/typing.mp3');
    const audioRight = new Audio('/sounds/right.mp3');
    const audioError = new Audio('/sounds/error.mp3');

    useEffect(() => {
        fetchWord();
    }, []);

    const fetchWord = () => {
        try {
            let data;
            if (isRandom) {
                data = words[Math.floor(Math.random() * words.length)];
            } else {
                data = words[currentIndex % words.length];
                setCurrentIndex(currentIndex + 1);
            }

            setWord(data);
            setInputs(new Array(data.complete_word.length - data.incomplete_word.length).fill(''));
            setShowHint(false);
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
            if (newInputs.join('').toLowerCase() === word.complete_word.slice(word.incomplete_word.length).toLowerCase()) {
                playSound && audioRight.play();
                fetchWord();
                setWrong('');
                setCompleteWord('');
                inputRefs[0].current.focus();
            } else {
                playSound && audioError.play();
                setInputs(new Array(word.complete_word.length - word.incomplete_word.length).fill(''));
                inputRefs[0].current.focus();
                // 在input 后面加上一个红色的 x, 表示答案错误
                setWrong('x');
            }
        } else if (e.target.value !== '') {
            playSound && audioTyping.play();
            setCurrentInputIndex(index + 1);
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'h') {
            setShowHint(!showHint);
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

    const toggleHint = () => {
        setShowHint(!showHint);
    };

    const toggleSound = () => {
        setPlaySound(!playSound);
    };

    return (
        <div>
            <div style={{position: 'absolute', top: '18px', right: '50px'}}>
                <button onClick={toggleHint} style={{marginRight: '10px'}}>
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button onClick={toggleSound} style={{marginRight: '10px'}}>
                    {playSound ? 'Mute Sound' : 'Play Sound'}
                </button>
                <input type="checkbox" checked={isRandom} onChange={() => setIsRandom(!isRandom)}/> Random
                <a href="https://github.com/ZPVIP/WordFill" target="_blank" rel="noopener noreferrer"
                   className="github header-github-link" aria-label="GitHub repository"></a>
            </div>
            <div style={{
                width: '98%',
                textAlign: 'center',
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
            <div className="typingInput" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row' }}>
                    <span>{word.context.split('@@')[0]} &nbsp;</span>
                    <span>{word.incomplete_word}</span>
                    {inputs.map((value, index) => (
                        <input
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={handleKeyDown}
                            style={{width: '0.9em', height: '1.2em', textAlign: 'center', fontSize: '1em', margin: '0.08em', outline: 'none'}}
                        />
                    ))}
                    <span>&nbsp;{word.context.split('@@')[1]}</span>
                    <span style={{color: 'red', padding: '0 0 0 20px'}}>{wrong}</span>
                </div>
                {showHint && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                        <span>{word.complete_word}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WordFill;

