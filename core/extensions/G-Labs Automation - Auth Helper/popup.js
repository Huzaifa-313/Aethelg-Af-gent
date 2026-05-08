# AETHELGARD MERGED FILE
# Origin Repository: G-Labs-Automation-v2.0.9-win
# Original Path: extensions\G-Labs Automation - Auth Helper\popup.js
# Merge Date: 2026-05-07T19:25:23.037462
# ---


const _P = 18923;
const _B = `http://127.0.0.1:${_P}`;
const _U = "https://labs.google/fx/tools/flow";

const dB = document.getElementById("dotBridge");
const vB = document.getElementById("valBridge");
const dT = document.getElementById("dotTab");
const vT = document.getElementById("valTab");
const dL = document.getElementById("dotLogin");
const vL = document.getElementById("valLogin");
const dR = document.getElementById("dotRecaptcha");
const vR = document.getElementById("valRecaptcha");
const bTest = document.getElementById("btnTest");
const bVerify = document.getElementById("btnTestCaptcha");
const bRefresh = document.getElementById("btnRefresh");
const bOpen = document.getElementById("btnOpenTab");
const rBox = document.getElementById("resultBox");
const toggleAR = document.getElementById("toggleAutoRefresh");
const statTokens = document.getElementById("statTokens");
const statStatus = document.getElementById("statStatus");
const statLast = document.getElementById("statLast");

let _tabId = null;

function init() {
    try {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(["autoRefresh"], (s) => {
                if (chrome.runtime.lastError) return;
                toggleAR.checked = s.autoRefresh !== false;
            });
        }
    } catch (e) { /* storage permission not active */ }

    loadStats();

    checkService().catch(() => { });
    checkSession().catch(() => { });

    setInterval(() => {
        checkService().catch(() => { });
        loadStats();
    }, 3000);
}

function loadStats() {
    try {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(["tokenCount", "lastSuccess"], (data) => {
                if (chrome.runtime.lastError) return;
                statTokens.textContent = data.tokenCount || 0;
                statLast.textContent = data.lastSuccess ? formatTime(data.lastSuccess) : "—";
            });
        }
    } catch (e) { /* storage not available */ }

    try {
        chrome.runtime.sendMessage({ type: "GET_STATS" }, (r) => {
            if (chrome.runtime.lastError) return;
            if (r) {
                statTokens.textContent = r.tokenCount || 0;
                statStatus.textContent = r.connected ? "🟢" : "🔴";
                statStatus.style.color = r.connected ? "#22c55e" : "#ef4444";
                if (r.lastSuccess) statLast.textContent = formatTime(r.lastSuccess);
            }
        });
    } catch (e) { /* SW not available */ }
}

function formatTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function checkAll() {
    await Promise.all([checkService(), checkSession()]);
    loadStats();
}

async function checkService() {
    try {
        const r = await fetch(`${_B}/captcha/health`, { signal: AbortSignal.timeout(3000) });
        if (r.ok) { dot(dB, "ok"); vB.textContent = "Connected"; }
        else { dot(dB, "err"); vB.textContent = `Error (${r.status})`; }
    } catch (e) {
        dot(dB, "err"); vB.textContent = "Not running";
    }
}

async function checkSession() {
    try {
        const tabs = await chrome.tabs.query({});
        const ft = tabs.filter(
            (t) => t.url && t.url.includes("labs.google")
        );
        if (ft.length > 0) {
            _tabId = ft[0].id;
            dot(dT, "ok"); vT.textContent = `Active (${ft.length})`;
            await checkAccount();
            await checkVerification(_tabId);
        } else {
            _tabId = null;
            dot(dT, "warn"); vT.textContent = "No session";
            dot(dL, "warn"); vL.textContent = "—";
            dot(dR, "warn"); vR.textContent = "—";
        }
    } catch (e) {
        dot(dT, "err"); vT.textContent = "Error";
    }
}

async function checkAccount() {
    try {
        const c = await chrome.cookies.getAll({ domain: ".google.com" });
        const ok = c.some(
            (c) => c.name === "SID" || c.name === "__Secure-3PSID" || c.name === "SAPISID"
        );
        dot(dL, ok ? "ok" : "err");
        vL.textContent = ok ? "Authenticated" : "Not signed in";
    } catch (e) {
        dot(dL, "warn"); vL.textContent = "Unknown";
    }
}

async function checkVerification(tabId) {
    try {
        const r = await Promise.race([
            chrome.runtime.sendMessage({ type: "CHECK_V", tabId }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
        ]);
        if (r && r.available) {
            dot(dR, "ok");
            vR.textContent = "Ready";
        } else {
            dot(dR, "warn");
            vR.textContent = r?.error || "Not ready";
        }
    } catch (e) {
        dot(dR, "warn"); vR.textContent = "Checking…";
    }
}

function dot(el, s) {
    el.className = "status-dot";
    if (s === "ok") el.classList.add("dot-ok");
    else if (s === "warn") el.classList.add("dot-warn");
    else if (s === "err") el.classList.add("dot-err");
    else el.classList.add("dot-loading");
}

function showResult(text, type) {
    rBox.textContent = text;
    rBox.className = "result-box show " + type;
}

bTest.addEventListener("click", async () => {
    bTest.disabled = true;
    bTest.textContent = "⏳ ...";
    dot(dB, "loading"); dot(dT, "loading");
    dot(dL, "loading"); dot(dR, "loading");
    vB.textContent = "..."; vT.textContent = "...";
    vL.textContent = "..."; vR.textContent = "...";
    await checkAll();
    bTest.disabled = false;
    bTest.textContent = "🔍 Check";
});

bVerify.addEventListener("click", async () => {
    bVerify.disabled = true;
    bVerify.textContent = "⏳ ...";
    rBox.className = "result-box";

    try {
        let sk = "", act = "";
        try {
            const r = await fetch(`${_B}/captcha/config`, { signal: AbortSignal.timeout(3000) });
            if (r.ok) {
                const cfg = await r.json();
                sk = cfg.recaptcha_ent_key || cfg.site_key || "";
                act = cfg.recaptcha_action || "";
            }
        } catch (e) { }

        const result = await chrome.runtime.sendMessage({
            type: "TEST_V", site_key: sk, action: act,
        });

        if (result && result.token) {
            showResult(`✅ Verified (${result.token.length} chars)`, "success");
            loadStats();
        } else {
            showResult(`❌ ${result ? result.error || "Failed" : "No response"}`, "error");
        }
    } catch (e) {
        showResult(`❌ ${e.message}`, "error");
    } finally {
        bVerify.disabled = false;
        bVerify.textContent = "⚡ Verify";
    }
});

bRefresh.addEventListener("click", async () => {
    bRefresh.disabled = true;
    bRefresh.textContent = "⏳ ...";

    try {
        const tabs = await chrome.tabs.query({});
        const ft = tabs.filter(t => t.url && t.url.includes("labs.google"));
        if (ft.length > 0) {
            const AUTH_PREFIXES = ["__Secure-", "SID", "SSID", "HSID", "LSID", "APISID", "SAPISID", "NID"];
            let cleared = 0;
            try {
                const cookies = await chrome.cookies.getAll({ domain: "labs.google" });
                for (const c of cookies) {
                    if (AUTH_PREFIXES.some(p => c.name.startsWith(p))) continue;
                    const url = `https://${c.domain.replace(/^\./, "")}${c.path}`;
                    await chrome.cookies.remove({ url, name: c.name });
                    cleared++;
                }
            } catch (e) { }

            await chrome.tabs.reload(ft[0].id);
            showResult(`✅ Cleared ${cleared} cookies & refreshed`, "success");
            setTimeout(async () => {
                await checkAll();
                bRefresh.disabled = false;
                bRefresh.textContent = "🔄 Refresh";
            }, 3000);
        } else {
            showResult("❌ No Labs tab open", "error");
            bRefresh.disabled = false;
            bRefresh.textContent = "🔄 Refresh";
        }
    } catch (e) {
        showResult(`❌ ${e.message}`, "error");
        bRefresh.disabled = false;
        bRefresh.textContent = "🔄 Refresh";
    }
});

bOpen.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({});
    const ft = tabs.filter(
        (t) => t.url && t.url.includes("labs.google") && t.url.includes("tools/flow")
    );
    if (ft.length > 0) {
        chrome.tabs.update(ft[0].id, { active: true });
        chrome.windows.update(ft[0].windowId, { focused: true });
    } else {
        chrome.tabs.create({ url: _U });
    }
});

toggleAR.addEventListener("change", () => {
    try {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ autoRefresh: toggleAR.checked });
        }
    } catch (e) { /* storage not available */ }
});

init();
