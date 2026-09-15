"use client";

import { useEffect, useRef, useState } from "react";
import { CalibrationConfig, DigitsFieldConfig, TextFieldConfig } from "@/lib/types";
import { CheckData } from "@/lib/types";
import { formatAmountSouthAsian } from "@/lib/numberToWords";

const PX_PER_MM = 96 / 25.4;

interface Props {
  config: CalibrationConfig;
  data: CheckData;
  showGuides: boolean;
  /** Renders at true scale (1) with no responsive fit-to-container sizing,
   *  for the hidden print-only copy that actually reaches the printer. */
  forPrint?: boolean;
}

function formatDate(iso: string, format: CalibrationConfig["dateFormat"]) {
  if (!iso) return { day: "", month: "", year: "", text: "" };
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return { day: "", month: "", year: "", text: "" };
  const text =
    format === "DMY" ? `${d}/${m}/${y}` : format === "MDY" ? `${m}/${d}/${y}` : `${y}-${m}-${d}`;
  return { day: d, month: m, year: y, text };
}

function TextField({
  config,
  value,
  wrap = false,
}: {
  config: TextFieldConfig;
  value: string;
  wrap?: boolean;
}) {
  if (!value) return null;
  return (
    <div
      className={`check-field ${wrap ? "check-field-wrap" : ""}`}
      style={{
        left: `${config.x}mm`,
        top: `${config.y}mm`,
        fontSize: `${config.fontSize}pt`,
        letterSpacing: config.letterSpacing ? `${config.letterSpacing}px` : undefined,
        width: `${config.maxWidth}mm`,
        textAlign: config.align,
        whiteSpace: wrap ? "pre-wrap" : "nowrap",
        overflow: wrap ? "visible" : "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {value}
    </div>
  );
}

function DigitBoxes({ config, value }: { config: DigitsFieldConfig; value: string }) {
  if (!value) return null;
  return (
    <>
      {value.split("").map((ch, i) => (
        <div
          key={i}
          className="digit-box"
          style={{
            left: `${config.x + i * config.pitch}mm`,
            top: `${config.y}mm`,
            fontSize: `${config.fontSize}pt`,
          }}
        >
          {ch}
        </div>
      ))}
    </>
  );
}

function GuideBox({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}) {
  return (
    <div
      className="absolute border border-dashed border-accent-400/70 pointer-events-none"
      style={{ left: `${x}mm`, top: `${y}mm`, width: `${w}mm`, height: `${h}mm` }}
    >
      <span
        className="absolute -top-4 left-0 text-[8px] uppercase tracking-wide text-accent-600 bg-white/80 dark:bg-slate-900/80 px-0.5 whitespace-nowrap"
        style={{ fontSize: "7px" }}
      >
        {label}
      </span>
    </div>
  );
}

function CheckFields({
  config,
  data,
  showGuides,
}: {
  config: CalibrationConfig;
  data: CheckData;
  showGuides: boolean;
}) {
  const { day, month, year, text: dateText } = formatDate(data.date, config.dateFormat);
  const numericAmount = parseFloat(data.amount);
  const hasAmount = data.amount.trim() !== "" && !isNaN(numericAmount);
  const amountDigitsValue = hasAmount ? String(Math.floor(numericAmount)) : "";
  const amountTextValue = hasAmount ? formatAmountSouthAsian(numericAmount) : "";

  return (
    <>
      {showGuides && (
        <>
          <GuideBox
            x={config.fields.payee.x}
            y={config.fields.payee.y - 4}
            w={config.fields.payee.maxWidth}
            h={6}
            label="Payee"
          />
          <GuideBox
            x={config.fields.amountWords.x}
            y={config.fields.amountWords.y - 4}
            w={config.fields.amountWords.maxWidth}
            h={10}
            label="Amount in words"
          />
          <GuideBox
            x={
              config.dateMode === "boxed"
                ? Math.min(config.fields.dateDay.x, config.fields.dateMonth.x, config.fields.dateYear.x)
                : config.fields.dateText.x
            }
            y={(config.dateMode === "boxed" ? config.fields.dateDay.y : config.fields.dateText.y) - 4}
            w={
              config.dateMode === "boxed"
                ? config.fields.dateYear.x +
                  config.fields.dateYear.pitch * 4 -
                  Math.min(config.fields.dateDay.x, config.fields.dateMonth.x, config.fields.dateYear.x)
                : config.fields.dateText.maxWidth
            }
            h={6}
            label="Date"
          />
          <GuideBox
            x={config.amountMode === "boxed" ? config.fields.amountDigits.x : config.fields.amountText.x}
            y={(config.amountMode === "boxed" ? config.fields.amountDigits.y : config.fields.amountText.y) - 4}
            w={
              config.amountMode === "boxed"
                ? config.fields.amountDigits.pitch * 9
                : config.fields.amountText.maxWidth
            }
            h={6}
            label="Amount"
          />
        </>
      )}

      <TextField config={config.fields.payee} value={data.payee} />
      <TextField config={config.fields.amountWords} value={data.amountWords} wrap />

      {config.dateMode === "boxed" ? (
        <>
          <DigitBoxes config={config.fields.dateDay} value={day} />
          <DigitBoxes config={config.fields.dateMonth} value={month} />
          <DigitBoxes config={config.fields.dateYear} value={year} />
        </>
      ) : (
        <TextField config={config.fields.dateText} value={dateText} />
      )}

      {config.amountMode === "boxed" ? (
        <DigitBoxes config={config.fields.amountDigits} value={amountDigitsValue} />
      ) : (
        <TextField config={config.fields.amountText} value={amountTextValue} />
      )}
    </>
  );
}

export default function CheckPreview({ config, data, showGuides, forPrint = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (forPrint) return;
    const el = containerRef.current;
    if (!el) return;
    const naturalWidthPx = config.paper.widthMm * PX_PER_MM;

    const update = () => {
      const available = el.clientWidth;
      if (!available) return;
      const next = Math.min(available / naturalWidthPx, 2.2);
      setScale(Math.max(next, 0.25));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [config.paper.widthMm, forPrint]);

  const effectiveScale = forPrint ? 1 : scale;
  const scaledHeight = config.paper.heightMm * PX_PER_MM * effectiveScale;

  const canvas = (
    <div
      className={`print-area check-canvas origin-top-left ${
        forPrint ? "" : "shadow-md ring-1 ring-slate-200 dark:ring-slate-700 rounded-md"
      }`}
      style={{
        width: `${config.paper.widthMm}mm`,
        height: `${config.paper.heightMm}mm`,
        transform: `scale(${effectiveScale})`,
      }}
    >
      <CheckFields config={config} data={data} showGuides={showGuides} />
    </div>
  );

  if (forPrint) {
    return <div className="print-wrapper">{canvas}</div>;
  }

  return (
    <div ref={containerRef} className="print-wrapper w-full">
      <div style={{ height: `${scaledHeight}px` }} className="relative">
        {canvas}
      </div>
    </div>
  );
}
