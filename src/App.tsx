import {
  ChangeEvent,
  useState,
  useLayoutEffect,
  useRef,
  FormEvent,
  useEffect,
  MouseEvent,
} from 'react';
import InputCheckbox from './InputCheckbox';
import { randomNum, isNumInRange } from './utility';
import { ReactComponent as IconCopy } from './assets/images/icon-copy.svg';
import { ReactComponent as IconArrowRight } from './assets/images/icon-arrow-right.svg';

/* Types */
enum StrengthLevels {
  Empty,
  TooWeak,
  Weak,
  Medium,
  Strong,
}

type Options = {
  charLength: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

type CheckboxOptions = Omit<Options, 'charLength'>;

enum CharTypes {
  uppercase,
  lowercase,
  number,
  symbol,
}

const CHAR_LENGTH_MIN = 1;
const CHAR_LENGTH_MAX = 20;

const strengthLevelData = [
  {
    label: 'Empty',
    color: '',
  },
  {
    label: 'Too Weak!',
    color: 'text-red',
  },
  {
    label: 'Weak',
    color: 'text-orange',
  },
  {
    label: 'Medium',
    color: 'text-yellow',
  },
  {
    label: 'Strong',
    color: 'text-neon-green',
  },
];

// https://stackoverflow.com/questions/38034673/determine-the-number-of-enum-elements-typescript
// const strengthMaxLevel = Object.keys(Strengths).length / 2 - 2;
// const strengthLevels = generateArrayRange(0, strengthMaxLevel);

const checkboxLabels: Record<keyof CheckboxOptions, string> = {
  includeUppercase: 'Include Uppercase Letters',
  includeLowercase: 'Include Lowercase Letters',
  includeNumbers: 'Include Numbers',
  includeSymbols: 'Include Symbols',
};

const defaultOptions: Options = {
  charLength: 10,
  includeUppercase: false,
  includeLowercase: false,
  includeNumbers: false,
  includeSymbols: false,
};

const symbols = [
  '!',
  '"',
  "'",
  '#',
  '$',
  '&',
  '(',
  ')',
  '*',
  '+',
  '/',
  '>',
  '<',
  '?',
  '@',
  '^',
  '~',
];

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

const getRandomChar = (charTypes: CharTypes[]) => {
  const charType = charTypes[randomNum(0, charTypes.length - 1)];
  switch (charType) {
    case CharTypes.uppercase:
      return String.fromCharCode(randomNum(65, 90));
    case CharTypes.lowercase:
      return String.fromCharCode(randomNum(97, 122));
    case CharTypes.number:
      return String.fromCharCode(randomNum(48, 57));
    case CharTypes.symbol:
      return symbols[randomNum(0, symbols.length - 1)];
    default:
      throw new Error(
        'default case of switch statement was unexpectedly reached'
      );
  }
};

const getCharType = (char: string): CharTypes => {
  const charCode = char.charCodeAt(0);
  if (isNumInRange(charCode, 65, 90)) return CharTypes.uppercase;
  if (isNumInRange(charCode, 97, 122)) return CharTypes.lowercase;
  if (isNumInRange(charCode, 48, 57)) return CharTypes.number;
  if (symbols.includes(char)) return CharTypes.symbol;

  throw new Error(`"${char}" is not an expected character type.`);
};

const generatePassword = (
  charLength: number,
  charTypes: CharTypes[]
): string => {
  let password = '';

  const charTypesUsed = new Set<CharTypes>();
  while (charTypesUsed.size !== charTypes.length) {
    charTypesUsed.clear();
    password = '';

    for (let i = 0; i < charLength; i++) {
      password += getRandomChar(charTypes);
    }

    [...password].forEach((char) => {
      charTypesUsed.add(getCharType(char));
    });
  }

  return password;
};

const getSelectedCharTypes = (options: Options): CharTypes[] => {
  const checkedOptions = Object.entries(options)
    .filter(([, value]) => value === true)
    .map(([key]) => {
      switch (key) {
        case 'includeUppercase':
          return CharTypes.uppercase;
        case 'includeLowercase':
          return CharTypes.lowercase;
        case 'includeNumbers':
          return CharTypes.number;
        case 'includeSymbols':
          return CharTypes.symbol;
        default:
          throw new Error('Switch statement should not reach default case');
      }
    });

  return checkedOptions;
};

function App() {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<Options>(defaultOptions);
  const [copied, setCopied] = useState(false);
  const [currentStrength, setCurrentStrength] = useState<StrengthLevels>(
    StrengthLevels.Strong
  );
  const rangeEl = useRef<HTMLInputElement>(null);
  const { charLength } = options;

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
    setOptions({
      ...options,
      [e.currentTarget.name]: e.currentTarget.checked,
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { charLength } = options;
    const selectedCharTypes = getSelectedCharTypes(options);

    if (selectedCharTypes.length < 1)
      return console.log('No character types selected.');
    if (selectedCharTypes.length > charLength)
      return console.log('Character length not long enough.');

    // Generate password from selected options
    const password = generatePassword(charLength, selectedCharTypes);
    setPassword(password);
  };

  const handlePasswordClick = () => {
    console.log(password);
    if (password.length < 1) return;

    setCopied(true);
  };

  const createInputCheckbox = (id: keyof CheckboxOptions) => {
    const label = checkboxLabels[id];
    const value = options[id];

    return (
      <InputCheckbox
        id={id}
        label={label}
        value={value}
        handleChange={handleOptionChange}
      />
    );
  };

  return (
    <main className="w-9/12 max-w-lg">
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <h1 className="text-center text-grey">Password Generator</h1>
        <div
          className="group flex cursor-pointer items-center gap-2 bg-dark-grey p-4 font-bold"
          aria-label="Password field. Click or press enter to copy the password to your clipboard."
          tabIndex={0}
          onClick={handlePasswordClick}
        >
          <input
            type="text"
            name="password"
            placeholder="P4$5W0rD!"
            value={password}
            readOnly
            className="ligatures-none w-full cursor-pointer select-none bg-transparent text-lg leading-none placeholder:opacity-25"
            onFocus={(e) => e.currentTarget.blur()}
          />
          <span
            className={`shrink-0 uppercase text-neon-green group-hover:text-almost-white ${
              copied ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Copied
          </span>
          <IconCopy className="shrink-0 text-neon-green group-hover:text-almost-white" />
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
          <div className="space-y-4">
            {createInputCheckbox('includeUppercase')}
            {createInputCheckbox('includeLowercase')}
            {createInputCheckbox('includeNumbers')}
            {createInputCheckbox('includeSymbols')}
          </div>
          <div className="item-stretch flex justify-between bg-very-dark-grey p-6">
            <div className="font-bold uppercase text-grey">Strength</div>
            <div
              className={`flex gap-1.5 ${strengthLevelData[currentStrength].color} items-stretch`}
            >
              {currentStrength > 0 ? (
                <span className="mr-1 font-bold uppercase text-almost-white">
                  {strengthLevelData[currentStrength].label}
                </span>
              ) : null}
              {strengthLevelData.map((_, strengthLevel) => {
                if (strengthLevel === 0) return null;

                if (strengthLevel > currentStrength)
                  return (
                    <div
                      className="border-1 min-h-4 w-2 border border-solid border-almost-white bg-transparent"
                      key={strengthLevel}
                    />
                  );

                return (
                  <div
                    className="border-1 min-h-4 w-2 border border-solid border-current bg-current"
                    key={strengthLevel}
                  />
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-6 border border-neon-green bg-neon-green p-4 uppercase text-dark-grey hover:bg-transparent hover:text-neon-green"
          >
            Generate
            <IconArrowRight />
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
