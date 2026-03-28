function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.toggle("closed");
}

/* ===== HEADER NAV INJECTION ===== */
function buildHeader() {
    let header = document.querySelector("header");
    if (!header) return;

    let menuBtn = header.querySelector(".menu-btn");
    let logo = header.querySelector(".logo");
    if (!menuBtn || !logo) return;

    let left = document.createElement("div");
    left.className = "header-left";
    left.appendChild(menuBtn.cloneNode(true));
    left.appendChild(logo.cloneNode(true));

    // Default nav (will be updated by auth.js once session is known)
    let nav = document.createElement("nav");
    nav.className = "header-nav";
    nav.innerHTML = `
        <button class="dark-mode-btn hide-mobile" onclick="toggleDarkMode()" title="Toggle dark mode">🌙</button>
        <a href="index.html" class="hide-mobile">Home</a>
        <a href="account.html#pricing" class="hide-mobile">Pricing</a>
        <a href="auth.html#login" class="nav-btn-signin">Sign In</a>
        <a href="auth.html#signup" class="nav-btn-signup">Sign Up</a>
    `;

    header.innerHTML = "";
    header.appendChild(left);
    header.appendChild(nav);

    header.querySelector(".menu-btn").addEventListener("click", toggleSidebar);
}

/* ===== FOOTER INJECTION ===== */
function buildFooter() {
    let existing = document.querySelector("footer.footer");
    if (!existing) return;

    existing.innerHTML = `
        <div class="footer-grid">
            <div class="footer-brand">
                <a href="index.html" class="logo-footer">Utility<span>Forge</span></a>
                <p>Free online tools for developers, writers, and professionals. All tools run in your browser — your data never leaves your device.</p>
            </div>
            <div class="footer-col">
                <h4>Text Tools</h4>
                <a href="tools.html#word-counter">Word Counter</a>
                <a href="tools.html#character-counter">Character Counter</a>
                <a href="tools.html#text-reverser">Text Reverser</a>
                <a href="tools.html#case-converter">Case Converter</a>
                <a href="tools.html#text-sorter">Text Sorter</a>
            </div>
            <div class="footer-col">
                <h4>Developer Tools</h4>
                <a href="tools.html#json-formatter">JSON Formatter</a>
                <a href="tools.html#jwt-decoder">JWT Decoder</a>
                <a href="tools.html#regex-tester">Regex Tester</a>
                <a href="tools.html#base64">Base64</a>
                <a href="tools.html#sha256-generator">SHA-256</a>
            </div>
            <div class="footer-col">
                <h4>Company</h4>
                <a href="info.html#about">About</a>
                <a href="account.html#pricing">Pricing</a>
                <a href="info.html#contact">Contact</a>
                <a href="info.html#privacy">Privacy Policy</a>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2026 UtilityForge. All rights reserved.</span>
            <div>
                <a href="info.html#privacy">Privacy Policy</a> &nbsp;·&nbsp;
                <a href="info.html#contact">Contact</a>
            </div>
        </div>
    `;
}

/* ===== ACTIVE SIDEBAR LINK ===== */
function highlightActivePage() {
    let current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar a").forEach(a => {
        if (a.getAttribute("href") === current) a.classList.add("active");
    });
}

function removeDuplicates() {
    let text = document.getElementById("input").value;
    if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;
    let lines = text.split("\n");
    let unique = [...new Set(lines)];
    document.getElementById("output").value = unique.join("\n");
}

function countWords() {
    let text = document.getElementById("textInput").value.trim();
    if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;
    let words = text.split(/\s+/).filter(word => word.length > 0);
    document.getElementById("result").innerText = "Words: " + words.length;
}

function toUpper() {
    let text = document.getElementById("caseInput").value;
    document.getElementById("caseOutput").value = text.toUpperCase();
}

function toLower() {
    let text = document.getElementById("caseInput").value;
    document.getElementById("caseOutput").value = text.toLowerCase();
}

function generatePassword() {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById("passwordOutput").value = password;
}

function encodeBase64() {
    let text = document.getElementById("baseInput").value;
    document.getElementById("baseOutput").value = btoa(text);
}

function decodeBase64() {
    let text = document.getElementById("baseInput").value;
    document.getElementById("baseOutput").value = atob(text);
}

// Initialise on page load
window.onload = function() {
    buildHeader();
    buildFooter();
    highlightActivePage();

    // Inject upgrade modal into every page
    if (typeof injectUpgradeModal === 'function') injectUpgradeModal();

    // Update header with auth state (auth.js)
    if (typeof updateHeaderAuthState === 'function') updateHeaderAuthState();

    // Restore dark mode if Pro user had it on
    if (typeof initDarkMode === 'function') initDarkMode();

    // Close sidebar on homepage
    let sidebar = document.getElementById("sidebar");
    if (sidebar) {
        let path = window.location.pathname;
        if (path.includes("index.html") || path === "/" || path.endsWith("/utilityforge/")) {
            sidebar.classList.add("closed");
        }
    }
};

function reverseText(){

let text = document.getElementById("reverseInput").value;

let reversed = text.split("").reverse().join("");

document.getElementById("reverseOutput").value = reversed;

}

function generateRandom(){

let min = parseInt(document.getElementById("min").value);

let max = parseInt(document.getElementById("max").value);

let random = Math.floor(Math.random()*(max-min+1))+min;

document.getElementById("randomResult").innerText = random;

}

function generateLorem(){

let text = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

document.getElementById("loremText").innerText = text;

}

function formatJSON(){

let input = document.getElementById("jsonInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', input.length)) return;

try{

let formatted = JSON.stringify(JSON.parse(input), null, 4);

document.getElementById("jsonOutput").value = formatted;

}

catch{

document.getElementById("jsonOutput").value = "Invalid JSON";

}

}
 function generateUUID(){

let uuid = crypto.randomUUID();

document.getElementById("uuidOutput").value = uuid;

}

function encodeURL(){

let text = document.getElementById("urlInput").value;

document.getElementById("urlOutput").value = encodeURIComponent(text);

}

function decodeURL(){

let text = document.getElementById("urlInput").value;

try{

document.getElementById("urlOutput").value = decodeURIComponent(text);

}

catch{

document.getElementById("urlOutput").value = "Invalid URL encoding";

}

}

function convertTimestamp(){

let ts = document.getElementById("timestampInput").value;

let date = new Date(ts * 1000);

document.getElementById("timestampResult").innerText =
date.toUTCString();

}

function sortText(){

let text = document.getElementById("sortInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

let lines = text.split("\n");

lines.sort();

document.getElementById("sortOutput").value = lines.join("\n");

}

function removeEmptyLines(){

let text = document.getElementById("emptyInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

let lines = text.split("\n");

let filtered = lines.filter(line => line.trim() !== "");

document.getElementById("emptyOutput").value = filtered.join("\n");

}
function generateString(){

let length = parseInt(document.getElementById("length").value);

if (typeof checkLimit === 'function' && !checkLimit('maxStringLen', length)) return;

let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let result = "";

for(let i=0;i<length;i++){

result += chars.charAt(Math.floor(Math.random()*chars.length));

}

document.getElementById("stringOutput").value = result;

}

function countChars(){

let text = document.getElementById("charInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

document.getElementById("charResult").innerText =
"Characters: " + text.length;

}

function generateColor(){

let color = "#"+Math.floor(Math.random()*16777215).toString(16);

document.getElementById("colorBox").style.background = color;

document.getElementById("colorCode").innerText = color;

}

function validateJSON(){

let text = document.getElementById("jsonValidateInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

try{

JSON.parse(text);

document.getElementById("jsonResult").innerText = "Valid JSON";

}

catch{

document.getElementById("jsonResult").innerText = "Invalid JSON";

}

}

function generateHex(){

let hex = Math.floor(Math.random()*16777215).toString(16);

document.getElementById("hexOutput").innerText = "#"+hex;

}
function invertCase(){

let text = document.getElementById("invertInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

let result = "";

for(let i=0;i<text.length;i++){

let char = text[i];

result += char === char.toUpperCase()
? char.toLowerCase()
: char.toUpperCase();

}

document.getElementById("invertOutput").value = result;

}

function generatePasswordList(){

let count = parseInt(document.getElementById("passCount").value);

if (typeof checkLimit === 'function' && !checkLimit('maxBulkItems', count)) return;

let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let output = "";

for(let i=0;i<count;i++){

let pass = "";

for(let j=0;j<12;j++){

pass += chars.charAt(Math.floor(Math.random()*chars.length));

}

output += pass + "\n";

}

document.getElementById("passListOutput").value = output;

if (typeof saveToHistory === 'function') saveToHistory('Password List', count + ' passwords', output);

}

function generateUUIDList(){

let count = parseInt(document.getElementById("uuidCount").value);

if (typeof checkLimit === 'function' && !checkLimit('maxBulkItems', count)) return;

let output = "";

for(let i=0;i<count;i++){

output += crypto.randomUUID() + "\n";

}

document.getElementById("uuidListOutput").value = output;

if (typeof saveToHistory === 'function') saveToHistory('UUID List', count + ' UUIDs', output);

}

function countLines(){

let text = document.getElementById("lineInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

let lines = text.split("\n");

document.getElementById("lineResult").innerText =
"Lines: " + lines.length;

}

function capitalizeText(){

let text = document.getElementById("capInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

let words = text.split(" ");

for(let i=0;i<words.length;i++){

words[i] =
words[i].charAt(0).toUpperCase() +
words[i].slice(1);

}

document.getElementById("capOutput").value =
words.join(" ");

}

function checkDuplicates(){

let text = document.getElementById("dupInput").value;

if (typeof checkLimit === 'function' && !checkLimit('maxChars', text.length)) return;

let lines = text.split("\n");

let set = new Set(lines);

let duplicates = lines.length - set.size;

document.getElementById("dupResult").innerText =
"Duplicate lines: " + duplicates;

}

function decodeJWT(){

let token = document.getElementById("jwtInput").value;

try{

let payload = token.split('.')[1];

let decoded = JSON.parse(atob(payload));

document.getElementById("jwtOutput").value =
JSON.stringify(decoded,null,4);

}

catch{

document.getElementById("jwtOutput").value =
"Invalid JWT";

}

}

function encodeB64URL(){

let text = document.getElementById("b64urlInput").value;

let encoded = btoa(text)
.replace(/\+/g,'-')
.replace(/\//g,'_')
.replace(/=+$/,'');

document.getElementById("b64urlOutput").value = encoded;

}

function md5(input) {
  function safeAdd(x, y) { let lsw=(x&0xFFFF)+(y&0xFFFF); let msw=(x>>16)+(y>>16)+(lsw>>16); return (msw<<16)|(lsw&0xFFFF); }
  function bitRotateLeft(num, cnt) { return (num<<cnt)|(num>>>(32-cnt)); }
  function md5cmn(q,a,b,x,s,t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b); }
  function md5ff(a,b,c,d,x,s,t) { return md5cmn((b&c)|((~b)&d),a,b,x,s,t); }
  function md5gg(a,b,c,d,x,s,t) { return md5cmn((b&d)|(c&(~d)),a,b,x,s,t); }
  function md5hh(a,b,c,d,x,s,t) { return md5cmn(b^c^d,a,b,x,s,t); }
  function md5ii(a,b,c,d,x,s,t) { return md5cmn(c^(b|(~d)),a,b,x,s,t); }
  function str2binl(str) {
    let bin=[];
    for(let i=0;i<str.length*8;i+=8) bin[i>>5]|=(str.charCodeAt(i/8)&0xFF)<<(i%32);
    return bin;
  }
  function binl2hex(binarray) {
    let hex="0123456789abcdef"; let str="";
    for(let i=0;i<binarray.length*4;i++) str+=hex.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+hex.charAt((binarray[i>>2]>>((i%4)*8))&0xF);
    return str;
  }
  function binlMD5(x, len) {
    x[len>>5]|=0x80<<(len%32); x[(((len+64)>>>9)<<4)+14]=len;
    let a=1732584193,b=-271733879,c=-1732584194,d=271733878;
    for(let i=0;i<x.length;i+=16) {
      let [oa,ob,oc,od]=[a,b,c,d];
      a=md5ff(a,b,c,d,x[i],7,-680876936); d=md5ff(d,a,b,c,x[i+1],12,-389564586); c=md5ff(c,d,a,b,x[i+2],17,606105819); b=md5ff(b,c,d,a,x[i+3],22,-1044525330);
      a=md5ff(a,b,c,d,x[i+4],7,-176418897); d=md5ff(d,a,b,c,x[i+5],12,1200080426); c=md5ff(c,d,a,b,x[i+6],17,-1473231341); b=md5ff(b,c,d,a,x[i+7],22,-45705983);
      a=md5ff(a,b,c,d,x[i+8],7,1770035416); d=md5ff(d,a,b,c,x[i+9],12,-1958414417); c=md5ff(c,d,a,b,x[i+10],17,-42063); b=md5ff(b,c,d,a,x[i+11],22,-1990404162);
      a=md5ff(a,b,c,d,x[i+12],7,1804603682); d=md5ff(d,a,b,c,x[i+13],12,-40341101); c=md5ff(c,d,a,b,x[i+14],17,-1502002290); b=md5ff(b,c,d,a,x[i+15],22,1236535329);
      a=md5gg(a,b,c,d,x[i+1],5,-165796510); d=md5gg(d,a,b,c,x[i+6],9,-1069501632); c=md5gg(c,d,a,b,x[i+11],14,643717713); b=md5gg(b,c,d,a,x[i],20,-373897302);
      a=md5gg(a,b,c,d,x[i+5],5,-701558691); d=md5gg(d,a,b,c,x[i+10],9,38016083); c=md5gg(c,d,a,b,x[i+15],14,-660478335); b=md5gg(b,c,d,a,x[i+4],20,-405537848);
      a=md5gg(a,b,c,d,x[i+9],5,568446438); d=md5gg(d,a,b,c,x[i+14],9,-1019803690); c=md5gg(c,d,a,b,x[i+3],14,-187363961); b=md5gg(b,c,d,a,x[i+8],20,1163531501);
      a=md5gg(a,b,c,d,x[i+13],5,-1444681467); d=md5gg(d,a,b,c,x[i+2],9,-51403784); c=md5gg(c,d,a,b,x[i+7],14,1735328473); b=md5gg(b,c,d,a,x[i+12],20,-1926607734);
      a=md5hh(a,b,c,d,x[i+5],4,-378558); d=md5hh(d,a,b,c,x[i+8],11,-2022574463); c=md5hh(c,d,a,b,x[i+11],16,1839030562); b=md5hh(b,c,d,a,x[i+14],23,-35309556);
      a=md5hh(a,b,c,d,x[i+1],4,-1530992060); d=md5hh(d,a,b,c,x[i+4],11,1272893353); c=md5hh(c,d,a,b,x[i+7],16,-155497632); b=md5hh(b,c,d,a,x[i+10],23,-1094730640);
      a=md5hh(a,b,c,d,x[i+13],4,681279174); d=md5hh(d,a,b,c,x[i],11,-358537222); c=md5hh(c,d,a,b,x[i+3],16,-722521979); b=md5hh(b,c,d,a,x[i+6],23,76029189);
      a=md5hh(a,b,c,d,x[i+9],4,-640364487); d=md5hh(d,a,b,c,x[i+12],11,-421815835); c=md5hh(c,d,a,b,x[i+15],16,530742520); b=md5hh(b,c,d,a,x[i+2],23,-995338651);
      a=md5ii(a,b,c,d,x[i],6,-198630844); d=md5ii(d,a,b,c,x[i+7],10,1126891415); c=md5ii(c,d,a,b,x[i+14],15,-1416354905); b=md5ii(b,c,d,a,x[i+5],21,-57434055);
      a=md5ii(a,b,c,d,x[i+12],6,1700485571); d=md5ii(d,a,b,c,x[i+3],10,-1894986606); c=md5ii(c,d,a,b,x[i+10],15,-1051523); b=md5ii(b,c,d,a,x[i+1],21,-2054922799);
      a=md5ii(a,b,c,d,x[i+8],6,1873313359); d=md5ii(d,a,b,c,x[i+15],10,-30611744); c=md5ii(c,d,a,b,x[i+6],15,-1560198380); b=md5ii(b,c,d,a,x[i+13],21,1309151649);
      a=md5ii(a,b,c,d,x[i+4],6,-145523070); d=md5ii(d,a,b,c,x[i+11],10,-1120210379); c=md5ii(c,d,a,b,x[i+2],15,718787259); b=md5ii(b,c,d,a,x[i+9],21,-343485551);
      a=safeAdd(a,oa); b=safeAdd(b,ob); c=safeAdd(c,oc); d=safeAdd(d,od);
    }
    return [a,b,c,d];
  }
  let bin = str2binl(input);
  return binl2hex(binlMD5(bin, input.length*8));
}

function generateMD5(){

let text = document.getElementById("md5Input").value;

document.getElementById("md5Output").innerText = md5(text);

}

async function generateSHA(){

let text = document.getElementById("shaInput").value;

let buffer = new TextEncoder().encode(text);

let hash = await crypto.subtle.digest("SHA-256", buffer);

let hex = Array.from(new Uint8Array(hash))
.map(b => b.toString(16).padStart(2,'0'))
.join('');

document.getElementById("shaOutput").innerText = hex;

}

function testRegex(){

let pattern = document.getElementById("regexPattern").value;

let text = document.getElementById("regexText").value;

try{

let regex = new RegExp(pattern);

let match = regex.test(text);

document.getElementById("regexResult").innerText =
match ? "Match found" : "No match";

}

catch{

document.getElementById("regexResult").innerText =
"Invalid regex";

}

}

function toggleCategory(element){

let items = element.nextElementSibling;

if(items.style.display === "block"){

items.style.display = "none";

}
else{

items.style.display = "block";

}

}