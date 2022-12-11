import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as IconCopy } from '@assets/images/icon-copy.svg';
import { debounce } from '@/utility';

const isOverflowingX = ({ clientWidth, scrollWidth }: HTMLElement) =>
  scrollWidth > clientWidth;

function fitTextToWidth(el: HTMLElement) {
  el.style.fontSize = '';
  if (!isOverflowingX(el)) return (el.style.fontSize = '');

  let fontSize = parseFloat(
    window.getComputedStyle(el).getPropertyValue('font-size')
  );
  while (isOverflowingX(el)) {
    fontSize -= 1;
    el.style.fontSize = `${fontSize}px`;
  }
}

const resizeObserver = new ResizeObserver(
  debounce((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      console.log('debounced');
      if (entry.target instanceof HTMLElement) fitTextToWidth(entry.target);
    }
  }, 250)
);

export default function PasswordField({ password }: { password: string }) {
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current !== null) resizeObserver.observe(input.current);
  }, []);

  useEffect(() => {
    setCopied(false);
  }, [password]);

  useLayoutEffect(() => {
    if (input.current !== null) {
      fitTextToWidth(input.current);
    }
  }, [password]);

  const handlePasswordClick = () => {
    if (password.length < 1) return;

    navigator.clipboard
      .writeText(password)
      .then(() => {
        console.log('Copied');
        setCopied(true);
      })
      .catch(() => console.log('Failed to copy'));
  };

  return (
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
        tabIndex={-1}
        ref={input}
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
  );
}
