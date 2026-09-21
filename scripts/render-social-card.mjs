import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const destination = 'public/assets/images/social-card.jpg';
await mkdir('public/assets/images', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html>
<html lang="en"><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{width:1200px;height:630px;margin:0;background:#111213;color:#f1eee6;font-family:Arial,Helvetica,sans-serif}
body{position:relative;overflow:hidden;background:radial-gradient(ellipse at 82% 48%,rgba(211,173,115,.17),transparent 36%),linear-gradient(110deg,#111213 0%,#111213 57%,#171818 100%)}
.grain{position:absolute;inset:0;opacity:.17;background-image:linear-gradient(90deg,transparent 49.9%,rgba(255,255,255,.04) 50%,transparent 50.1%),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 100%,100% 72px}
.shell{position:absolute;inset:52px 68px;display:flex;flex-direction:column;justify-content:space-between}.top,.bottom{display:flex;align-items:center;justify-content:space-between;font:12px/1.2 'Courier New',monospace;letter-spacing:.17em;text-transform:uppercase;color:#b2ada2}.brand{display:flex;align-items:center;gap:15px;color:#f1eee6}.mark{display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(241,238,230,.5);font-size:15px;letter-spacing:-.08em}.title{margin:0;font-size:86px;font-weight:500;line-height:.95;letter-spacing:-.075em}.title span{color:#d3ad73}.summary{max-width:620px;margin:27px 0 0;color:#d0ccc2;font-size:27px;line-height:1.25;letter-spacing:-.035em}.rule{width:100%;height:1px;background:linear-gradient(90deg,#d3ad73,rgba(211,173,115,.24) 48%,transparent)}
.orb{position:absolute;right:118px;top:120px;width:344px;height:344px;border:1px solid rgba(211,173,115,.38);border-radius:50%;transform:rotate(-18deg) skewX(-17deg)}.orb:before,.orb:after{position:absolute;inset:40px;border:1px solid rgba(241,238,230,.16);border-radius:50%;content:''}.orb:after{inset:102px;border-color:rgba(211,173,115,.44);background:radial-gradient(circle,rgba(211,173,115,.18),transparent 72%)}
</style><body><div class="grain"></div><div class="orb"></div><main class="shell"><div class="top"><div class="brand"><span class="mark">AS</span><span>Independent / India</span></div><span>Portfolio / 2026</span></div><div><h1 class="title">Aman Sharma<span>.</span></h1><p class="summary">I build useful digital products<br>and connect teams with technical talent.</p></div><div class="rule"></div><div class="bottom"><span>Android · Web · AI</span><span>Product development / Talent acquisition</span></div></main></body></html>`, { waitUntil: 'load' });
await page.screenshot({ path: destination, type: 'jpeg', quality: 91 });
await browser.close();
console.log(`Rendered ${destination} at 1200×630 (JPEG quality 91).`);
