import { ChangeEvent, useState, FormEvent } from 'react';
import InputCheckbox from '@components/InputCheckbox';
import StrengthMeter, { StrengthLevels } from '@components/StrengthMeter';
import InputRange from '@components/InputRange';
import PasswordField from '@components/PasswordField';
import SubmitButton from '@components/SubmitButton';
import { ReactComponent as IconArrowRight } from '@assets/images/icon-arrow-right.svg';
import { randomNum, isNumInRange, ValidateShape } from '@/utility';
import { passwordStrength } from 'check-password-strength';

/* Types */
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

const CHAR_LENGTH_MIN = 0;
const CHAR_LENGTH_MAX = 20;

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

const symbols = ['!', '#', '$', '&', '*', '+', '>', '<', '?', '@', '^', '~'];

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

function isCheckboxOption(
  maybeOption: any
): maybeOption is keyof CheckboxOptions {
  if (
    maybeOption === 'includeUppercase' ||
    maybeOption === 'includeLowercase' ||
    maybeOption === 'includeSymbols' ||
    maybeOption === 'includeNumbers'
  ) {
    return true;
  }
  return false;
}

function App() {
  const [password, setPassword] = useState('');
  // const [options, setOptions] = useState<Options>(defaultOptions);
  const [options, setOptions] =
    useState<ValidateShape<typeof defaultOptions, Options>>(defaultOptions);
  const [currentStrength, setCurrentStrength] = useState<StrengthLevels>();
  const [error, setError] = useState<string>();
  const { charLength } = options;

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      return setError('No character types selected');
    if (selectedCharTypes.length > charLength)
      return setError('Character length not long enough');

    setError('');
    // Generate password from selected options
    const password = generatePassword(charLength, selectedCharTypes);
    setPassword(password);

    const newPasswordStrength = passwordStrength(password).id;
    if (!(newPasswordStrength in StrengthLevels)) {
      setError('Encountered an internal error');
      throw new Error(`Password strength not in StrengthLevels enum`);
    }
    setCurrentStrength(newPasswordStrength);
  };

  const createCheckboxes = () => {
    const checkboxOptions = Object.entries(options).filter(
      ([, optionValue]) => typeof optionValue === 'boolean'
    );

    return (
      <div className="space-y-4">
        {checkboxOptions.map(([optionName]) => {
          if (!isCheckboxOption(optionName)) return null;

          const label = checkboxLabels[optionName];
          const value = options[optionName];

          return (
            <InputCheckbox
              id={optionName}
              label={label}
              value={value}
              handleChange={handleOptionChange}
              key={optionName}
            />
          );
        })}
      </div>
    );
  };

  return (
    <main className="w-9/12 max-w-lg">
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <h1 className="text-center text-grey">Password Generator</h1>
        <PasswordField password={password} />
        <div className="space-y-6 bg-dark-grey p-4">
          <InputRange
            className="w-full"
            name="charLength"
            id="charLength"
            min={CHAR_LENGTH_MIN}
            max={CHAR_LENGTH_MAX}
            value={charLength}
            onChange={handleRangeChange}
            label="Character Length"
          />
          {createCheckboxes()}
          <StrengthMeter currentStrength={currentStrength} />
          {error ? <div className="text-orange">{error}</div> : null}
          <SubmitButton className="flex w-full items-center justify-center gap-6 ">
            Generate
            <IconArrowRight />
          </SubmitButton>
        </div>
      </form>
    </main>
  );
}

export default App;
