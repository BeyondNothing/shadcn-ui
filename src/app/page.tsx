"use client";

import { useMemo, useState } from "react";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/|";

function generatePassword(length: number, charPool: string) {
  if (!charPool || length <= 0) return "";

  const randomBytes = new Uint32Array(length);
  crypto.getRandomValues(randomBytes);

  let result = "";
  for (let i = 0; i < length; i += 1) {
    const index = randomBytes[i] % charPool.length;
    result += charPool[index];
  }
  return result;
}

export default function Home() {
  const [length, setLength] = useState(16);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const charPool = useMemo(() => {
    let pool = "";
    if (useLowercase) pool += LOWERCASE;
    if (useUppercase) pool += UPPERCASE;
    if (useNumbers) pool += NUMBERS;
    if (useSymbols) pool += SYMBOLS;
    return pool;
  }, [useLowercase, useUppercase, useNumbers, useSymbols]);

  const canGenerate = charPool.length > 0;

  function handleGenerate() {
    setCopied(false);
    setPassword(generatePassword(length, charPool));
  }

  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">密码生成器</h1>
        <p className="text-slate-400 mb-6">自定义规则，一键生成强密码</p>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 mb-6">
          <div className="text-sm text-slate-400 mb-2">生成结果</div>
          <div className="font-mono text-lg break-all min-h-8">
            {password || "点击下方按钮生成密码"}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex justify-between text-sm mb-2">
            <span>密码长度</span>
            <span className="text-cyan-400">{length}</span>
          </label>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={(event) => setUseLowercase(event.target.checked)}
              className="accent-cyan-500"
            />
            小写字母
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(event) => setUseUppercase(event.target.checked)}
              className="accent-cyan-500"
            />
            大写字母
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(event) => setUseNumbers(event.target.checked)}
              className="accent-cyan-500"
            />
            数字
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(event) => setUseSymbols(event.target.checked)}
              className="accent-cyan-500"
            />
            特殊符号
          </label>
        </div>

        {!canGenerate && (
          <p className="text-amber-400 text-sm mb-4">请至少选择一种字符类型</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex-1 rounded-lg bg-cyan-500 text-slate-950 font-semibold py-2.5 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            生成密码
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!password}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </section>
    </main>
  );
}
