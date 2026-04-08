'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Repeat } from 'lucide-react';

type Props = {
  symbol: string;
  name: string;
  image: string;
  prices?: Record<string, number>;
};

const CoinConverter = ({ symbol, name, image, prices = {} }: Props) => {
  const currencyKeys = Object.keys(prices).filter(
    (key) => typeof prices[key] === 'number' && Number.isFinite(prices[key])
  );

  const [amount, setAmount] = useState(10);
  const [isCoinToCurrency, setIsCoinToCurrency] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currencyKeys.length && !currencyKeys.includes(selectedCurrency)) {
      setSelectedCurrency(currencyKeys[0]);
    }
  }, [currencyKeys, selectedCurrency]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPrice = prices[selectedCurrency] || 0;

  const convertedValue = useMemo(() => {
    if (!selectedPrice) return 0;
    return isCoinToCurrency ? amount * selectedPrice : amount / selectedPrice;
  }, [amount, selectedPrice, isCoinToCurrency]);

  const handleSwap = () => {
    setAmount(Number(convertedValue.toFixed(6)));
    setIsCoinToCurrency((prev) => !prev);
  };

  return (
    <div className="rounded-2xl bg-dark-500 p-5 space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-dark-400 px-4 py-4 gap-4">
        <input
          type="number"
          min="0"
          step="any"
          value={Number.isFinite(amount) ? amount : ''}
          onChange={(e) => {
            const value = e.target.value;

            if (value === '') {
              setAmount(0);
              return;
            }

            const parsed = Number(value);

            if (Number.isFinite(parsed) && parsed >= 0) {
              setAmount(parsed);
            }
          }}
          className="w-full bg-transparent text-lg font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <div className="flex items-center gap-2 shrink-0">
          <Image
            src={image}
            alt={name}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm font-medium uppercase">
            {isCoinToCurrency ? symbol : selectedCurrency}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap conversion direction"
          className="
      flex h-12 w-12 items-center justify-center
      rounded-full
      bg-dark-400
      text-purple-100/70
      transition-all duration-200
      hover:scale-105
      hover:bg-dark-500
      active:scale-95
    "
        >
          <Repeat size={22} strokeWidth={2} />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-dark-400 px-4 py-4 gap-4">
        <span className="text-lg font-medium truncate">
          {convertedValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </span>

        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium uppercase text-purple-100/70 transition-colors hover:bg-dark-500"
          >
            <span>{isCoinToCurrency ? selectedCurrency : symbol}</span>
            <span
              className={`text-xs transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 max-h-56 w-32 overflow-y-auto rounded-2xl border border-purple-100/10 bg-dark-500 p-2 shadow-lg shadow-black/30 custom-scrollbar">
              {currencyKeys.map((currency) => (
                <button
                  key={currency}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium uppercase transition-colors ${
                    selectedCurrency === currency
                      ? 'bg-dark-400 text-white'
                      : 'text-purple-100/70 hover:bg-dark-400 hover:text-white'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinConverter;
