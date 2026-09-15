# Bank Check Printer

একটা Next.js + Tailwind CSS app যা দিয়ে আপনি ব্যাংক চেকের **payee name, date, amount (figures ও words)** ঠিক জায়গায় বসিয়ে সরাসরি প্রি-প্রিন্টেড চেক পাতায় প্রিন্ট করতে পারবেন — যেমন আপনি প্রিন্টারে চেকের কাগজ খাওয়াবেন, ঠিক সেভাবে।

## চালানোর নিয়ম (Getting started)

```bash
npm install
npm run dev
```

তারপর browser-এ **http://localhost:3000** খুলুন। Production build/export করতে:

```bash
npm run build
npm start
```

> এই sandbox environment-এ npm registry access করা যায়নি (organization network policy ব্লক করেছে), তাই `npm install` এখানে চালিয়ে verify করা সম্ভব হয়নি। কোডটা manually review করা হয়েছে, number-to-words logic আলাদাভাবে চালিয়ে সঠিকতা যাচাই করা হয়েছে, আর TypeScript syntax check করা হয়েছে কোনো error ছাড়াই — কিন্তু আপনার নিজের মেশিনে প্রথমবার `npm install && npm run dev` চালিয়ে নিশ্চিত হয়ে নিন।

## যা যা আছে

- **Check details form** — Payee name, Date, Amount (সংখ্যায়), এবং Amount in words (amount লিখলেই words auto-fill হয়ে যায়, চাইলে হাতে বদলেও নিতে পারবেন)।
- **Live preview** — চেকের exact size অনুযায়ী (mm-এ) একটা preview, স্ক্রিনে fit করার জন্য auto-scaled।
- **Calibration panel** — প্রতিটা field-এর (payee, amount in words, date, amount) X/Y position, font size, letter spacing ইত্যাদি চাইলে বদলাতে পারবেন। Date আর Amount আলাদাভাবে **"Boxed digits"** (অনেক ব্যাংকের চেকে থাকা আলাদা আলাদা বক্সে digit বসে) অথবা **"Plain text"** (একটানা লেখা) mode-এ রাখা যায়।
- **Presets** — একবার calibrate করে নাম দিয়ে save করে রাখুন (যেমন "Sonali Bank", "DBBL"), পরে এক ক্লিকে load করতে পারবেন। শেষ ব্যবহৃত configuration নিজে থেকেই browser-এ (localStorage) save থাকে।
- **Dynamic accent color + light/dark theme** — উপরে ডান দিকে রঙ বদলানো আর thema toggle করার অপশন আছে, responsive layout (মোবাইল থেকে ডেস্কটপ সব সাইজে কাজ করবে)।
- **Print** — "Print check" বাটনে ক্লিক করলে browser-এর print dialog আসবে; page size স্বয়ংক্রিয়ভাবে আপনার সেট করা চেকের মাপ অনুযায়ী বসানো থাকে (margin 0), যাতে যা দেখছেন ঠিক তাই ছাপা হয়।

## কীভাবে accurate করে ক্যালিব্রেট করবেন

যেহেতু প্রতিটা ব্যাংকের চেক লে-আউট আলাদা, শুরুতে default position গুলো একটা generic আন্দাজ (standard ৮ ইঞ্চি x ৩.৬৬ ইঞ্চি চেক লিফ ধরে)। সঠিক position বের করতে:

1. প্রথমে সাদা কাগজে (আসল চেকের বদলে) একবার প্রিন্ট করুন, **"Show alignment guide boxes"** অপশন চালু রেখে।
2. প্রিন্ট করা কাগজটা আসল চেকের উপর আলোর দিকে ধরে (বা জানালার কাচে) মিলিয়ে দেখুন — date, amount, payee কোন দিকে/কতটুকু সরে আছে।
3. Calibration panel-এ সেই field-এর X/Y (mm) বাড়ান-কমান — ডানে সরাতে X বাড়ান, নিচে সরাতে Y বাড়ান।
4. আবার সাদা কাগজে প্রিন্ট করে মিলিয়ে দেখুন, না মেলা পর্যন্ত ধাপে ধাপে ঠিক করুন।
5. একদম মিলে গেলে আসল চেকের কাগজ প্রিন্টারে দিয়ে ছাপান, আর নিচে preset নাম দিয়ে **Save** করে রাখুন — পরের বার আর ক্যালিব্রেট করা লাগবে না।

Boxed-digit চেকে (যেখানে প্রতিটা সংখ্যার আলাদা ঘর থাকে) শুধু প্রথম ঘরের X/Y আর দুই ঘরের মাঝের দূরত্ব (**pitch**) সেট করলেই বাকি সংখ্যাগুলো নিজে থেকে সঠিক ঘরে বসে যাবে।

## Tech

Next.js 14 (App Router) + TypeScript + Tailwind CSS, পুরোপুরি client-side (কোনো backend/database নেই), সব state browser-এর localStorage-এ থাকে।
