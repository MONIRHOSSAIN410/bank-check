// All position units are millimetres (mm), measured from the top-left
// corner of the check leaf as it sits in the printer feed. That corner
// is the reference point users calibrate against with a ruler on a
// printed test page.

export interface CheckData {
  payee: string;
  date: string; // ISO yyyy-mm-dd, from <input type="date">
  amount: string; // raw numeric string, e.g. "12500.50"
  amountWords: string;
  amountWordsAuto: boolean; // true while amountWords is auto-derived from amount
}

export const DEFAULT_CHECK_DATA: CheckData = {
  payee: "",
  date: "",
  amount: "",
  amountWords: "",
  amountWordsAuto: true,
};

export interface TextFieldConfig {
  type: "text";
  x: number;
  y: number;
  fontSize: number; // pt
  letterSpacing: number; // px, can be 0
  maxWidth: number; // mm, for wrapping (amount in words) or clipping
  align: "left" | "right" | "center";
}

export interface DigitsFieldConfig {
  type: "digits";
  x: number;
  y: number;
  fontSize: number; // pt
  pitch: number; // mm between the start of each digit/box
}

export type DateMode = "boxed" | "plain";
export type AmountMode = "boxed" | "plain";
export type DateFormat = "DMY" | "MDY" | "YMD";

export interface PaperSize {
  widthMm: number;
  heightMm: number;
}

export interface CalibrationConfig {
  paper: PaperSize;
  dateMode: DateMode;
  amountMode: AmountMode;
  dateFormat: DateFormat;
  fields: {
    payee: TextFieldConfig;
    amountWords: TextFieldConfig;
    dateText: TextFieldConfig;
    dateDay: DigitsFieldConfig;
    dateMonth: DigitsFieldConfig;
    dateYear: DigitsFieldConfig;
    amountText: TextFieldConfig;
    amountDigits: DigitsFieldConfig;
  };
}

// Standard Bangladeshi bank cheque leaf is close to 8in x 3.5-3.7in.
// Positions below are a reasonable generic starting point (MICR cheques
// typically place the date top-right, payee mid-left, amount box
// mid-right, amount-in-words along a ruled line above it). They are
// meant to be nudged by the user to match their own bank's layout.
export const DEFAULT_CONFIG: CalibrationConfig = {
  paper: { widthMm: 203.2, heightMm: 92.9 }, // 8in x 3.66in
  dateMode: "boxed",
  amountMode: "boxed",
  dateFormat: "DMY",
  fields: {
    payee: {
      type: "text",
      x: 18,
      y: 30,
      fontSize: 13,
      letterSpacing: 0,
      maxWidth: 130,
      align: "left",
    },
    amountWords: {
      type: "text",
      x: 18,
      y: 42,
      fontSize: 11,
      letterSpacing: 0,
      maxWidth: 150,
      align: "left",
    },
    dateText: {
      type: "text",
      x: 155,
      y: 12,
      fontSize: 12,
      letterSpacing: 1,
      maxWidth: 45,
      align: "left",
    },
    dateDay: { type: "digits", x: 150, y: 12, fontSize: 12, pitch: 5.2 },
    dateMonth: { type: "digits", x: 163, y: 12, fontSize: 12, pitch: 5.2 },
    dateYear: { type: "digits", x: 176, y: 12, fontSize: 12, pitch: 5.2 },
    amountText: {
      type: "text",
      x: 150,
      y: 30,
      fontSize: 13,
      letterSpacing: 0,
      maxWidth: 45,
      align: "right",
    },
    amountDigits: { type: "digits", x: 138, y: 30, fontSize: 13, pitch: 6.5 },
  },
};
