import { ChangeEvent, useState, useLayoutEffect, useRef } from 'react';
import InputCheckbox from './InputCheckbox';
import iconCopy from './assets/images/icon-copy.svg';

const CHAR_LENGTH_MIN = 1;
const CHAR_LENGTH_MAX = 20;

/**
 * Unpleasant, but needed to style the progress part of a ranged input on
 * Chrome, Safari, Opera, and Edge
 * See https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider
 */
function drawRangeBackground(rangeEl: HTMLInputElement) {
  const [value, min, max] = [rangeEl.value, rangeEl.min, rangeEl.max].map(
    Number
  ); // Cast to numbers

  const gradientProgressStop = ((value - min) / (max - min)) * 100;
  const newBackground = `linear-gradient(to right, hsl(var(--neon-green)) 0%, hsl(var(--neon-green)) ${gradientProgressStop}%, hsl(var(--very-dark-grey)) ${gradientProgressStop}%, hsl(var(--very-dark-grey)) 100%`;
  rangeEl.style.background = newBackground;
}

type Options = {
  charLength: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

const defaultOptions: Options = {
  charLength: 10,
  includeUppercase: false,
  includeLowercase: false,
  includeNumbers: false,
  includeSymbols: false,
};

type CheckboxOptions = Omit<Options, 'charLength'>;

function App() {
  const [password, setPassword] = useState('a2Vsj@)3n');
  const [options, setOptions] = useState<Options>(defaultOptions);
  const rangeEl = useRef<HTMLInputElement>(null);
  const {
    charLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  } = options;

  useLayoutEffect(() => {
    if (rangeEl.current !== null) {
      drawRangeBackground(rangeEl.current);
    }
  }, []);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    drawRangeBackground(e.currentTarget);
    setOptions({ ...options, charLength: Number(e.currentTarget.value) });
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);
    setOptions({
      ...options,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  //

  return (
    <main className="w-9/12 max-w-lg">
      <form className="flex flex-col gap-4 border-2">
        <h1 className="text-center text-grey">Password Generator</h1>
        <div className="relative bg-dark-grey font-bold">
          <input
            type="text"
            name="password"
            value={password}
            readOnly
            className="w-full cursor-pointer bg-transparent p-4 text-lg leading-none"
            onClick={() => console.log('clicked')}
          />
          <img
            src={iconCopy}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
        <div className="space-y-6 bg-dark-grey p-4">
          <div className="flex justify-between">
            <label htmlFor="charLength">Character Length</label>
            <div className="text-lg text-neon-green">{charLength}</div>
          </div>
          <input
            type="range"
            className="input-range w-full"
            name="charLength"
            id="charLength"
            step="1"
            ref={rangeEl}
            min={CHAR_LENGTH_MIN}
            max={CHAR_LENGTH_MAX}
            value={charLength}
            onChange={handleRangeChange}
          />
        </div>
        <div className="space-y-2">
          <InputCheckbox<'includeUppercase', Options>
            id="includeUppercase"
            value={includeUppercase}
            label="Include Uppercase Letters"
            handleChange={handleOptionChange}
          />
          <InputCheckbox
            id="includeLowercase"
            value={includeLowercase}
            label="Include Lowercase Letters"
            handleChange={handleOptionChange}
          />
          <InputCheckbox
            id="includeNumbers"
            value={includeNumbers}
            label="Include Numbers"
            handleChange={handleOptionChange}
          />
          <InputCheckbox
            id="includeSymbols"
            value={includeSymbols}
            label="Include Symbols"
            handleChange={handleOptionChange}
          />
        </div>
      </form>
    </main>
  );
}

export default App;
