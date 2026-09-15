"use client";

import { amountToTakaWords, formatAmountSouthAsian } from "@/lib/numberToWords";
import { CheckData } from "@/lib/types";

interface Props {
  data: CheckData;
  onChange: (data: CheckData) => void;
  onPrint: () => void;
}

export default function CheckForm({ data, onChange, onPrint }: Props) {
  const numericAmount = parseFloat(data.amount);
  const hasAmount = data.amount.trim() !== "" && !isNaN(numericAmount);

  function update(partial: Partial<CheckData>) {
    onChange({ ...data, ...partial });
  }

  function handleAmountChange(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const next: CheckData = { ...data, amount: cleaned };
    if (data.amountWordsAuto) {
      const n = parseFloat(cleaned);
      next.amountWords = !isNaN(n) && cleaned.trim() !== "" ? amountToTakaWords(n) : "";
    }
    onChange(next);
  }

  function handleAmountWordsChange(value: string) {
    update({ amountWords: value, amountWordsAuto: false });
  }

  function resetAmountWordsToAuto() {
    const n = parseFloat(data.amount);
    update({
      amountWordsAuto: true,
      amountWords: !isNaN(n) && data.amount.trim() !== "" ? amountToTakaWords(n) : "",
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Payee name (কার নামে)
        </label>
        <input
          type="text"
          value={data.payee}
          onChange={(e) => update({ payee: e.target.value })}
          placeholder="e.g. Md. Rakibul Islam"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Date
        </label>
        <input
          type="date"
          value={data.date}
          onChange={(e) => update({ date: e.target.value })}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Amount (Taka)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            ৳
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={data.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>
        {hasAmount && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            = {formatAmountSouthAsian(numericAmount)} Taka
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Amount in words
          </label>
          {!data.amountWordsAuto && (
            <button
              type="button"
              onClick={resetAmountWordsToAuto}
              className="text-xs text-accent-600 dark:text-accent-400 hover:underline"
            >
              Auto-fill again
            </button>
          )}
        </div>
        <textarea
          value={data.amountWords}
          onChange={(e) => handleAmountWordsChange(e.target.value)}
          rows={2}
          placeholder="Auto-fills from amount — edit freely if it doesn't match your bank's wording"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 resize-none"
        />
      </div>

      <button
        type="button"
        onClick={onPrint}
        className="w-full rounded-lg bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-white font-medium py-2.5 text-sm transition-colors shadow-sm"
      >
        Print check
      </button>
    </div>
  );
}
