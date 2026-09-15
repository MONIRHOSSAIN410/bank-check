"use client";

import { useState } from "react";
import {
  CalibrationConfig,
  DateFormat,
  DigitsFieldConfig,
  TextFieldConfig,
} from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/types";
import { loadPresets, savePreset, deletePreset, PresetMap } from "@/lib/storage";

interface Props {
  config: CalibrationConfig;
  onChange: (config: CalibrationConfig) => void;
  showGuides: boolean;
  onToggleGuides: (v: boolean) => void;
}

function NumField({
  label,
  value,
  onChange,
  step = 0.5,
  min,
  suffix = "mm",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step={step}
          min={min}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <span className="text-[10px] text-slate-400 w-6">{suffix}</span>
      </div>
    </label>
  );
}

function TextFieldEditor({
  title,
  value,
  onChange,
  showWidth = true,
}: {
  title: string;
  value: TextFieldConfig;
  onChange: (v: TextFieldConfig) => void;
  showWidth?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" value={value.x} onChange={(x) => onChange({ ...value, x })} />
        <NumField label="Y" value={value.y} onChange={(y) => onChange({ ...value, y })} />
        <NumField
          label="Font size"
          value={value.fontSize}
          step={0.5}
          suffix="pt"
          onChange={(fontSize) => onChange({ ...value, fontSize })}
        />
        <NumField
          label="Letter spacing"
          value={value.letterSpacing}
          step={0.5}
          suffix="px"
          onChange={(letterSpacing) => onChange({ ...value, letterSpacing })}
        />
        {showWidth && (
          <NumField
            label="Max width"
            value={value.maxWidth}
            step={1}
            onChange={(maxWidth) => onChange({ ...value, maxWidth })}
          />
        )}
        <label className="flex flex-col gap-0.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Align</span>
          <select
            value={value.align}
            onChange={(e) => onChange({ ...value, align: e.target.value as TextFieldConfig["align"] })}
            className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function DigitsFieldEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: DigitsFieldConfig;
  onChange: (v: DigitsFieldConfig) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X (first box)" value={value.x} onChange={(x) => onChange({ ...value, x })} />
        <NumField label="Y" value={value.y} onChange={(y) => onChange({ ...value, y })} />
        <NumField
          label="Box pitch"
          value={value.pitch}
          step={0.1}
          onChange={(pitch) => onChange({ ...value, pitch })}
        />
        <NumField
          label="Font size"
          value={value.fontSize}
          step={0.5}
          suffix="pt"
          onChange={(fontSize) => onChange({ ...value, fontSize })}
        />
      </div>
    </div>
  );
}

export default function CalibrationPanel({ config, onChange, showGuides, onToggleGuides }: Props) {
  const [presets, setPresets] = useState<PresetMap>(() => loadPresets());
  const [presetName, setPresetName] = useState("");
  const [open, setOpen] = useState(false);

  function updateField<K extends keyof CalibrationConfig["fields"]>(
    key: K,
    value: CalibrationConfig["fields"][K]
  ) {
    onChange({ ...config, fields: { ...config.fields, [key]: value } });
  }

  function handleSavePreset() {
    const name = presetName.trim();
    if (!name) return;
    savePreset(name, config);
    setPresets(loadPresets());
    setPresetName("");
  }

  function handleLoadPreset(name: string) {
    const preset = presets[name];
    if (preset) onChange(preset);
  }

  function handleDeletePreset(name: string) {
    deletePreset(name);
    setPresets(loadPresets());
  }

  const presetNames = Object.keys(presets);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100"
      >
        <span>Calibration (নিজের check paper-এর সাথে মেলান)</span>
        <span className="text-slate-400 text-xs">{open ? "Hide ▲" : "Show ▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={(e) => onToggleGuides(e.target.checked)}
              className="rounded accent-accent-600"
            />
            Show alignment guide boxes on preview
          </label>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Check paper size
            </p>
            <div className="grid grid-cols-2 gap-2">
              <NumField
                label="Width"
                value={config.paper.widthMm}
                step={1}
                onChange={(widthMm) => onChange({ ...config, paper: { ...config.paper, widthMm } })}
              />
              <NumField
                label="Height"
                value={config.paper.heightMm}
                step={1}
                onChange={(heightMm) => onChange({ ...config, paper: { ...config.paper, heightMm } })}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Default 203.2mm × 92.9mm (8in × 3.66in) — typical Bangladeshi cheque leaf. Adjust to match yours.
            </p>
          </div>

          <TextFieldEditor
            title="Payee name"
            value={config.fields.payee}
            onChange={(v) => updateField("payee", v)}
          />

          <TextFieldEditor
            title="Amount in words"
            value={config.fields.amountWords}
            onChange={(v) => updateField("amountWords", v)}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Date</p>
              <div className="flex rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 text-[11px]">
                {(["boxed", "plain"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onChange({ ...config, dateMode: mode })}
                    className={`px-2 py-1 ${
                      config.dateMode === mode
                        ? "bg-accent-600 text-white"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {mode === "boxed" ? "Boxed digits" : "Plain text"}
                  </button>
                ))}
              </div>
            </div>

            {config.dateMode === "boxed" ? (
              <div className="space-y-2">
                <DigitsFieldEditor
                  title="Day boxes (DD)"
                  value={config.fields.dateDay}
                  onChange={(v) => updateField("dateDay", v)}
                />
                <DigitsFieldEditor
                  title="Month boxes (MM)"
                  value={config.fields.dateMonth}
                  onChange={(v) => updateField("dateMonth", v)}
                />
                <DigitsFieldEditor
                  title="Year boxes (YYYY)"
                  value={config.fields.dateYear}
                  onChange={(v) => updateField("dateYear", v)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col gap-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  Format
                  <select
                    value={config.dateFormat}
                    onChange={(e) => onChange({ ...config, dateFormat: e.target.value as DateFormat })}
                    className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs w-32"
                  >
                    <option value="DMY">DD/MM/YYYY</option>
                    <option value="MDY">MM/DD/YYYY</option>
                    <option value="YMD">YYYY-MM-DD</option>
                  </select>
                </label>
                <TextFieldEditor
                  title="Date text position"
                  value={config.fields.dateText}
                  onChange={(v) => updateField("dateText", v)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Amount (figures)</p>
              <div className="flex rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 text-[11px]">
                {(["boxed", "plain"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onChange({ ...config, amountMode: mode })}
                    className={`px-2 py-1 ${
                      config.amountMode === mode
                        ? "bg-accent-600 text-white"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {mode === "boxed" ? "Boxed digits" : "Plain text"}
                  </button>
                ))}
              </div>
            </div>

            {config.amountMode === "boxed" ? (
              <>
                <DigitsFieldEditor
                  title="Amount digit boxes (whole Taka only)"
                  value={config.fields.amountDigits}
                  onChange={(v) => updateField("amountDigits", v)}
                />
                <p className="text-[10px] text-slate-400">
                  Boxed mode fills whole-Taka digits left → right starting at X. Paisa/decimals aren't
                  boxed — switch to plain text if your cheque needs them.
                </p>
              </>
            ) : (
              <TextFieldEditor
                title="Amount text position"
                value={config.fields.amountText}
                onChange={(v) => updateField("amountText", v)}
              />
            )}
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Bank presets (save your calibration)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g. Sonali Bank"
                className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button
                type="button"
                onClick={handleSavePreset}
                className="rounded-md bg-accent-600 hover:bg-accent-700 text-white text-xs px-3 py-1.5"
              >
                Save
              </button>
            </div>
            {presetNames.length > 0 && (
              <ul className="space-y-1 pt-1">
                {presetNames.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800 rounded-md px-2 py-1"
                  >
                    <span className="text-slate-700 dark:text-slate-200">{name}</span>
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadPreset(name)}
                        className="text-accent-600 dark:text-accent-400 hover:underline"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePreset(name)}
                        className="text-rose-500 hover:underline"
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => onChange(DEFAULT_CONFIG)}
              className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
            >
              Reset to default layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
