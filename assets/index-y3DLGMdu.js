(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();class z{static async hashPassword(e){const t=new TextEncoder().encode(e+"salt_cloud_notes_2026"),i=await crypto.subtle.digest("SHA-512",t);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveKey(e,o){const t=new TextEncoder,i=await crypto.subtle.importKey("raw",t.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode(o),iterations:25e4,hash:"SHA-512"},i,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,o){try{const t=crypto.getRandomValues(new Uint8Array(16)),i=crypto.getRandomValues(new Uint8Array(12)),a=await this.deriveKey(o,this.bufToHex(t)),r=new TextEncoder,s=await crypto.subtle.encrypt({name:"AES-GCM",iv:i},a,r.encode(typeof e=="string"?e:JSON.stringify(e)));return{payload:this.bufToHex(new Uint8Array(s)),iv:this.bufToHex(i),salt:this.bufToHex(t)}}catch(t){throw console.error("Encryption failed",t),t}}static async decrypt(e,o){try{const{payload:t,iv:i,salt:a}=e,r=await this.deriveKey(o,a),s=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.hexToBuf(i)},r,this.hexToBuf(t)),d=new TextDecoder().decode(s);try{return JSON.parse(d)}catch{return d}}catch(t){throw console.error("Decryption failed. Wrong password?",t),t}}static bufToHex(e){return Array.from(new Uint8Array(e)).map(o=>o.toString(16).padStart(2,"0")).join("")}static hexToBuf(e){return new Uint8Array(e.match(/.{1,2}/g).map(o=>parseInt(o,16)))}}const p={notes:[],categories:[],settings:{theme:"dark",drivePath:"CloudNotes_Backup",algo:"aes-256-gcm"},currentView:"all",editingNoteId:null,unlockedNotes:new Set,unlockedCategories:new Set,gapiLoaded:!1,tokenClient:null};async function X(){const n=sessionStorage.getItem("cn_pass_plain_v3")||localStorage.getItem("cn_pass_plain_v3");if(n){const e=await z.encrypt(p.notes,n),o=await z.encrypt(p.categories,n);localStorage.setItem("cn_notes_v3_enc",JSON.stringify(e)),localStorage.setItem("cn_categories_v3_enc",JSON.stringify(o)),localStorage.removeItem("cn_notes_v3"),localStorage.removeItem("cn_categories_v3")}localStorage.setItem("cn_settings_v3",JSON.stringify(p.settings))}async function Yt(n){try{const e=localStorage.getItem("cn_notes_v3_enc"),o=localStorage.getItem("cn_categories_v3_enc");if(e)p.notes=await z.decrypt(JSON.parse(e),n);else{const t=localStorage.getItem("cn_notes_v3");t&&(p.notes=JSON.parse(t))}if(o)p.categories=await z.decrypt(JSON.parse(o),n);else{const t=localStorage.getItem("cn_categories_v3");t&&(p.categories=JSON.parse(t))}}catch(e){throw console.error("Failed to load encrypted data",e),e}}function gn(){const n=localStorage.getItem("cn_settings_v3");n&&(p.settings={...p.settings,...JSON.parse(n)})}const mn="v3.2.9",Me=[{id:"default",light:"#ffffff",dark:"#09090b"},{id:"red",light:"#fef2f2",dark:"#450a0a"},{id:"orange",light:"#fff7ed",dark:"#431407"},{id:"yellow",light:"#fefce8",dark:"#422006"},{id:"green",light:"#f0fdf4",dark:"#064e3b"},{id:"teal",light:"#f0fdfa",dark:"#134e4a"},{id:"blue",light:"#eff6ff",dark:"#1e3a8a"},{id:"darkblue",light:"#eef2ff",dark:"#1e1b4b"},{id:"purple",light:"#faf5ff",dark:"#3b0764"},{id:"pink",light:"#fdf2f8",dark:"#500724"},{id:"brown",light:"#fffaf5",dark:"#2d1a10"},{id:"gray",light:"#f8fafc",dark:"#0f172a"}],Xt=["#ffffff","#f28b82","#fbbc04","#fff475","#ccff90","#a7ffeb","#cbf0f8","#aecbfa","#d7aefb","#fdcfe8","#e6c9a8","#e8eaed","#1e293b","#450a0a","#422006","#064e3b","#134e4a","#1e3a8a","#1e1b4b","#4c1d95","#500724","#27272a","#09090b","#000000"],hn=["😊","😂","🥰","😎","🤔","😴","🔥","✨","🚀","🎉","❤️","👍","💡","📅","✅","❌","🔒","🔑","📌","🎨","📁","🏠","🌟","🌍","💻","📱","🍎","🍕","🍺","🌈","☀️","🌙","⚡","💎","🎁","🎈","🎵","📷","🔍","🛸","👾","🤖","👻","🦄","🐾","🏀","⚽","🚗","✈️","🕹️","🎮","🎲","🧩","🎭","🎬","🎤","🎧","🎹","🎸","🎻","🎺","🎷","🥁","🏹","🎣","🚵","🧗","🧘","🛁","🛌","🗝️","🛡️","⚔️","🗺️","🕯️","⌛","⚖️","⚙️","⚒️","🛠️","⛏️","⛓️","🔭","🔬","💊","💉","🧬","🩸","🧪","🌡️","🧴","🧹","🧺","🧼","🧽","🪣","🪒","🧻","🛀","🚿","🚽"];function D(n,e=3e3){const o=document.getElementById("toast");o&&(o.querySelector("div").innerText=n,o.classList.add("show"),setTimeout(()=>o.classList.remove("show"),e))}function He(n,e,o=!0){return new Promise(t=>{const i=document.getElementById("prompt-modal"),a=document.getElementById("prompt-input");if(!i||!a)return t(null);document.getElementById("prompt-title").innerText=n,document.getElementById("prompt-desc").innerText=e,a.type=o?"password":"text",a.value="",i.classList.remove("hidden"),ee(),a.focus();const r=()=>{i.classList.add("hidden"),window.removeEventListener("keydown",s)},s=f=>{f.key==="Enter"&&l(),f.key==="Escape"&&d()};window.addEventListener("keydown",s);const l=()=>{const f=a.value;r(),t(f)},d=()=>{r(),t(null)};document.getElementById("prompt-confirm").onclick=l,document.getElementById("prompt-cancel").onclick=d})}function vn(n){if(!n)return!0;const e=n.replace("#",""),o=parseInt(e.substr(0,2),16),t=parseInt(e.substr(2,2),16),i=parseInt(e.substr(4,2),16);return isNaN(o)||isNaN(t)||isNaN(i)?!0:(o*299+t*587+i*114)/1e3<128}function ee(){typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}class bn{constructor(e="chunk_",o="database/notes"){this.basePath=o,this.dbPrefix=e,this.chunkSizeLimit=100*1024}async getOrCreateFolder(e){const o=e.split("/").filter(i=>i);let t="root";for(const i of o){const a=`name = '${i}' and mimeType = 'application/vnd.google-apps.folder' and '${t}' in parents and trashed = false`,s=(await gapi.client.drive.files.list({q:a,fields:"files(id, name)"})).result.files;if(s.length>0)t=s[0].id;else{const l={name:i,mimeType:"application/vnd.google-apps.folder",parents:[t]};t=(await gapi.client.drive.files.create({resource:l,fields:"id"})).result.id}}return t}async saveChunks(e,o){const t=JSON.stringify(e),i=[];for(let a=0;a<t.length;a+=this.chunkSizeLimit)i.push(t.substring(a,a+this.chunkSizeLimit));for(let a=0;a<i.length;a++){const r=`${this.dbPrefix}${a}.json`;await this.uploadFile(r,i[a],o)}return i.length}async uploadFile(e,o,t){const i=`name = '${e}' and '${t}' in parents and trashed = false`,r=(await gapi.client.drive.files.list({q:i,fields:"files(id)"})).result.files,s=r.length>0?r[0].id:null,l={name:e,parents:s?[]:[t]},d=new Blob([o],{type:"application/json"}),f=gapi.auth.getToken().access_token,c=s?"PATCH":"POST",h=s?`https://www.googleapis.com/upload/drive/v3/files/${s}?uploadType=media`:"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";if(s)await fetch(h,{method:c,headers:{Authorization:`Bearer ${f}`},body:d});else{const b=new FormData;b.append("metadata",new Blob([JSON.stringify(l)],{type:"application/json"})),b.append("file",d),await fetch(h,{method:c,headers:{Authorization:`Bearer ${f}`},body:b})}}async loadChunks(e){const o=`name contains '${this.dbPrefix}' and '${e}' in parents and trashed = false`,i=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)",orderBy:"name"})).result.files;let a="";for(const r of i){const s=await gapi.client.drive.files.get({fileId:r.id,alt:"media"});a+=typeof s.result=="string"?s.result:JSON.stringify(s.result)}return a?JSON.parse(a):null}}function yn(){return`
    <div id="auth-shield" class="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-300">
        <div class="w-full max-w-sm p-8 space-y-6 bg-card border rounded-lg shadow-lg">
            <div class="text-center space-y-2">
                <div class="mx-auto w-10 h-10 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                    <i data-lucide="lock" class="w-5 h-5"></i>
                </div>
                <h1 class="text-2xl font-semibold tracking-tight" id="auth-title">Bóveda Protegida</h1>
                <p class="text-sm text-muted-foreground" id="auth-desc">Ingresa tu contraseña maestra para continuar</p>
            </div>
            <div class="space-y-4">
                <div class="relative">
                    <input type="password" id="master-password" placeholder="Tu contraseña" class="text-center tracking-widest pr-10">
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground toggle-pass" data-target="master-password">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="relative hidden" id="confirm-password-wrapper">
                    <input type="password" id="confirm-password" placeholder="Repite la contraseña" class="text-center tracking-widest pr-10">
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground toggle-pass" data-target="confirm-password">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="flex items-center gap-2 px-1">
                    <input type="checkbox" id="remember-me" class="w-4 h-4 rounded border-gray-300" checked>
                    <label for="remember-me" class="text-xs text-muted-foreground cursor-pointer select-none">Recordar en este dispositivo</label>
                </div>
                <button id="auth-submit" class="btn-shad btn-shad-primary w-full">Desbloquear</button>
            </div>
        </div>
    </div>`}async function wn(n){const e=document.getElementById("auth-shield"),o=!localStorage.getItem("cn_master_hash_v3"),t=localStorage.getItem("cn_pass_plain_v3"),i=sessionStorage.getItem("cn_pass_plain_v3"),a=t||i;o?xn():a?await z.hashPassword(a)===localStorage.getItem("cn_master_hash_v3")?(e.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>e.style.display="none",300),document.getElementById("app").classList.remove("opacity-0"),await Yt(a),n()):(localStorage.removeItem("cn_pass_plain_v3"),sessionStorage.removeItem("cn_pass_plain_v3"),Nt()):Nt()}function xn(){const n=document.getElementById("auth-title"),e=document.getElementById("auth-desc"),o=document.getElementById("confirm-password-wrapper"),t=document.getElementById("auth-submit");n&&(n.innerText="Configura tu Bóveda"),e&&(e.innerText="Crea una contraseña maestra. Introduce la contraseña dos veces para asegurar que es correcta."),o&&o.classList.remove("hidden"),t&&(t.innerText="Crear mi Bóveda",t.classList.remove("btn-shad-primary"),t.classList.add("btn-shad-success"))}function Nt(){const n=document.getElementById("auth-title"),e=document.getElementById("auth-desc"),o=document.getElementById("confirm-password-wrapper"),t=document.getElementById("auth-submit");n&&(n.innerText="Bóveda Protegida"),e&&(e.innerText="Ingresa tu contraseña maestra para continuar"),o&&o.classList.add("hidden"),t&&(t.innerText="Desbloquear",t.classList.add("btn-shad-primary"),t.classList.remove("btn-shad-success"))}async function En(n){var l;const e=document.getElementById("master-password").value,o=document.getElementById("confirm-password").value,t=(l=document.getElementById("remember-me"))==null?void 0:l.checked,i=!localStorage.getItem("cn_master_hash_v3");if(!e)return D("Ingresa una contraseña");if(i){if(!o)return D("Confirma tu contraseña");if(e!==o)return D("⚠️ ¡Las contraseñas no coinciden!");if(e.length<4)return D("La contraseña debe tener al menos 4 caracteres")}const a=await z.hashPassword(e),r=localStorage.getItem("cn_master_hash_v3");if(!r)localStorage.setItem("cn_master_hash_v3",a),t&&localStorage.setItem("cn_pass_plain_v3",e),sessionStorage.setItem("cn_pass_plain_v3",e),D("✅ Bóveda creada con éxito");else if(r===a)t&&localStorage.setItem("cn_pass_plain_v3",e),sessionStorage.setItem("cn_pass_plain_v3",e),D("Bóveda abierta");else return D("❌ Contraseña incorrecta");const s=document.getElementById("auth-shield");s.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>s.style.display="none",300),document.getElementById("app").classList.remove("opacity-0"),await Yt(e),n()}function Sn(){return`
    <div id="app" class="flex h-screen overflow-hidden opacity-100 transition-opacity duration-300">
        <!-- Sidebar Desktop -->
        <aside class="w-64 hidden md:flex flex-col border-r bg-sidebar">
            <div class="p-6 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20">
                    <img src="./icons/logo.png" alt="CloudNotes" class="w-full h-full object-contain">
                </div>
                <div>
                    <h1 class="text-sm font-semibold leading-none">CloudNotes</h1>
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wider">Pro Edition</span>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 space-y-8">
                <div class="space-y-1">
                    <button class="nav-link active w-full" data-view="all">
                        <i data-lucide="layout-grid" class="w-4 h-4"></i> Todas las notas
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between px-4">
                        <h3 class="sidebar-section-title text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Etiquetas</h3>
                        <button id="sidebar-manage-cats" class="text-[10px] bg-muted hover:bg-accent px-2 py-1 rounded border transition-colors font-bold uppercase text-muted-foreground hover:text-foreground">
                            Gestionar
                        </button>
                    </div>
                    <div id="sidebar-categories" class="space-y-1"></div>
                </div>
            </div>

            <div class="p-6 space-y-2 mt-auto">
                <button id="sync-btn" class="nav-link w-full text-xs opacity-60 hover:opacity-100">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Sincronizar Bóveda
                </button>
                <button id="settings-trigger" class="nav-link w-full text-xs opacity-60 hover:opacity-100">
                    <i data-lucide="settings" class="w-3.5 h-3.5"></i> Configuración
                </button>
                <button id="sidebar-pwa-install-btn" class="hidden nav-link w-full text-xs opacity-60 hover:opacity-100">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i> Instalar en PC
                </button>
                <button id="logout-btn" class="nav-link w-full text-xs opacity-60 hover:opacity-100 text-destructive">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Cerrar Bóveda
                </button>
                <div class="mt-auto pt-4 border-t border-border/20 px-4">
                    <div id="app-version" class="text-[9px] text-muted-foreground font-mono opacity-30">v3.2.8</div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col bg-background relative overflow-hidden h-full">
            <!-- Desktop Header -->
            <header class="hidden md:flex h-16 items-center justify-between px-8 border-b">
                <div class="flex items-center gap-4 flex-1">
                    <div class="relative w-full max-w-sm">
                        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></i>
                        <input type="text" id="search-input" placeholder="Buscar notas..." class="pl-12 h-9 w-full" autocomplete="off">
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button id="pwa-install-btn" class="hidden btn-shad btn-shad-outline h-9 px-3">
                        <i data-lucide="download" class="w-4 h-4 mr-2"></i> Instalar
                    </button>
                    <button id="add-note-btn" class="btn-shad btn-shad-primary h-9">
                        <i data-lucide="plus" class="w-4 h-4 mr-2"></i> Nueva Nota
                    </button>
                </div>
            </header>

            <!-- Mobile Top Bar -->
            <div class="md:hidden h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div class="flex items-center gap-3">
                    <button id="mobile-sidebar-trigger" class="p-2 -ml-2 hover:bg-accent rounded-md">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>
                    <div class="flex items-center gap-2">
                        <img src="./icons/logo.png" alt="Logo" class="w-6 h-6">
                        <span class="font-bold tracking-tight text-lg">CloudNotes</span>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <button id="mobile-search-btn" class="p-2 hover:bg-accent rounded-md">
                        <i data-lucide="search" class="w-5 h-5"></i>
                    </button>
                </div>
                <div id="mobile-search-bar" class="absolute inset-0 bg-background flex items-center px-4 gap-2 hidden animate-in slide-in-from-top duration-200">
                    <i data-lucide="search" class="w-4 h-4 text-muted-foreground"></i>
                    <input type="text" id="mobile-search-input-top" placeholder="Buscar en tus notas..." class="flex-1 bg-transparent border-none outline-none text-sm h-full" autocomplete="off">
                    <button id="close-mobile-search" class="p-2 hover:bg-accent rounded-md">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Grid -->
            <div id="notes-viewport" class="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                <div class="max-w-7xl mx-auto space-y-8">
                    <div class="flex items-end justify-between">
                        <div>
                            <h1 id="view-title" class="text-3xl font-bold tracking-tight">Todas las notas</h1>
                            <p id="view-desc" class="text-sm text-muted-foreground mt-1">Organiza tus pensamientos y protege tu privacidad.</p>
                        </div>
                    </div>
                    <div id="notes-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
                </div>
            </div>

            <!-- Mobile Bottom Nav -->
            <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-2xl border-t flex items-center justify-around z-40 pb-safe">
                <button class="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground active:text-primary transition-colors nav-link-mobile" data-view="all">
                    <i data-lucide="home" class="w-5 h-5"></i>
                    <span class="text-[10px] font-medium">Inicio</span>
                </button>
                <button class="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground active:text-primary transition-colors" id="mobile-search-trigger">
                    <i data-lucide="search" class="w-5 h-5"></i>
                    <span class="text-[10px] font-medium">Buscar</span>
                </button>
                <button class="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground active:text-primary transition-colors" id="mobile-add-btn">
                    <div class="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <i data-lucide="plus" class="w-6 h-6"></i>
                    </div>
                </button>
                <button class="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground active:text-primary transition-colors" id="mobile-menu-trigger">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                    <span class="text-[10px] font-medium">Menú</span>
                </button>
            </nav>
        </main>

        <!-- Mobile Sidebar Drawer -->
        <div id="mobile-sidebar-overlay" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] hidden">
            <div id="mobile-sidebar-drawer" class="w-[80vw] h-full bg-card border-r flex flex-col animate-in slide-in-from-left duration-300">
                <div class="p-6 flex items-center justify-between border-b">
                    <div class="flex items-center gap-2">
                        <img src="./icons/logo.png" alt="Logo" class="w-6 h-6">
                        <span class="font-bold tracking-tight">CloudNotes</span>
                    </div>
                    <button id="close-mobile-sidebar" class="p-2 hover:bg-accent rounded-md">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-8">
                    <div class="space-y-1">
                        <button class="nav-link-mobile-drawer active w-full" data-view="all">
                            <i data-lucide="layout-grid" class="w-4 h-4"></i> Todas las notas
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between px-2">
                            <h3 class="sidebar-section-title">Etiquetas</h3>
                            <button id="mobile-manage-cats" class="text-[10px] bg-muted hover:bg-accent px-2 py-1 rounded border transition-colors font-bold uppercase text-muted-foreground hover:text-foreground">
                                Gestionar
                            </button>
                        </div>
                        <div id="mobile-sidebar-categories" class="space-y-1 px-2"></div>
                    </div>
                </div>
                <div class="p-6 border-t space-y-2">
                    <button id="mobile-sync-btn" class="flex items-center gap-3 w-full p-3 rounded-md hover:bg-accent text-sm">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i> Sincronizar
                    </button>
                    <button id="mobile-logout-btn" class="flex items-center gap-3 w-full p-3 rounded-md hover:bg-accent text-sm text-destructive">
                        <i data-lucide="log-out" class="w-4 h-4"></i> Cerrar Bóveda
                    </button>
                </div>
            </div>
        </div>
    </div>`}let ht=null;function In(){return`
    <div id="editor-modal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm dialog-overlay"></div>
        <div class="dialog-content max-w-2xl h-[80vh] flex flex-col">
            <div class="flex items-center justify-between border-b pb-4">
                <input type="text" id="edit-title" placeholder="Título de la nota"
                    class="bg-transparent text-xl font-bold outline-none border-none placeholder:text-muted-foreground w-full">
                <button id="close-editor" class="text-muted-foreground hover:text-foreground"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>

            <div class="flex-1 py-4 overflow-y-auto">
                <div class="flex items-center gap-1 mb-4 p-1 border rounded-md bg-muted/30 w-fit">
                    <button class="editor-tool" data-cmd="bold"><i data-lucide="bold" class="w-4 h-4"></i></button>
                    <button id="open-text-colors" class="editor-tool" title="Color de texto"><i data-lucide="type" class="w-4 h-4"></i></button>
                    <div class="w-px h-4 bg-border mx-1"></div>
                    <button class="editor-tool" data-cmd="italic"><i data-lucide="italic" class="w-4 h-4"></i></button>
                    <button class="editor-tool" data-cmd="underline"><i data-lucide="underline" class="w-4 h-4"></i></button>
                    <div class="w-px h-4 bg-border mx-1"></div>
                    <button id="open-emojis" class="editor-tool"><i data-lucide="smile" class="w-4 h-4"></i></button>
                </div>

                <div id="edit-content" contenteditable="true"
                    class="min-h-[200px] outline-none text-sm leading-relaxed prose prose-slate dark:prose-invert max-w-none"
                    placeholder="Empieza a escribir..."></div>
            </div>

            <div class="border-t pt-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="flex items-center bg-muted/30 p-1 rounded-md border mr-2">
                        <button id="open-colors" class="editor-tool" title="Color de fondo"><i data-lucide="palette" class="w-4 h-4"></i></button>
                    </div>

                    <div class="relative group" id="cat-select-wrapper">
                        <button id="cat-dropdown-trigger"
                            class="h-9 px-3 rounded-md border border-input bg-background/50 text-xs flex items-center gap-2 hover:bg-accent transition-all">
                            <span id="selected-cat-label">Sin categoría</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-muted-foreground"></i>
                        </button>
                        <div id="cat-dropdown-menu"
                            class="absolute bottom-full mb-2 left-0 w-48 bg-popover border rounded-md shadow-xl hidden z-50 py-1 overflow-hidden">
                        </div>
                        <select id="edit-category" class="hidden">
                            <option value="">Sin categoría</option>
                        </select>
                    </div>
                    <button id="toggle-pin" class="h-9 w-9 inline-flex items-center justify-center rounded-md border border-input bg-background/50 hover:bg-accent transition-all">
                        <i data-lucide="pin" class="w-4 h-4"></i>
                    </button>
                    <button id="toggle-lock" class="h-9 w-9 inline-flex items-center justify-center rounded-md border border-input bg-background/50 hover:bg-accent transition-all">
                        <i data-lucide="lock" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="flex gap-2">
                    <button id="delete-note" class="btn-shad bg-destructive/10 text-destructive hover:bg-destructive hover:text-white h-9 px-3" title="Eliminar nota">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                    <button id="save-note" class="btn-shad btn-shad-primary h-9">Guardar Nota</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Popovers -->
    <div id="color-popover" class="fixed z-[60] hidden popover-content">
        <div class="grid grid-cols-6 gap-2" id="bg-color-grid"></div>
    </div>
    <div id="text-color-popover" class="fixed z-[60] hidden popover-content">
        <div class="grid grid-cols-6 gap-2" id="text-color-grid"></div>
    </div>
    <div id="emoji-popover" class="fixed z-[60] hidden popover-content w-80">
        <div class="grid grid-cols-8 gap-2 h-64 overflow-y-auto" id="emoji-grid"></div>
    </div>`}function _n(n){document.getElementById("editor-modal"),document.getElementById("edit-title");const e=document.getElementById("edit-content"),o=document.getElementById("close-editor"),t=document.getElementById("save-note"),i=document.getElementById("delete-note");o.onclick=vt,t.onclick=async()=>{await kn(),n()},i.onclick=async()=>{p.editingNoteId&&confirm("¿Eliminar esta nota?")&&(p.notes=p.notes.filter(a=>a.id!==p.editingNoteId),await X(),vt(),n())},document.querySelectorAll(".editor-tool").forEach(a=>{a.dataset.cmd&&(a.onmousedown=r=>{r.preventDefault(),bt(),document.execCommand(a.dataset.cmd,!1,a.dataset.val||null),Re()})}),Cn(),e.onkeyup=()=>{Be(),Re()},e.onmouseup=()=>{Be(),Re()},e.onfocus=()=>{Be(),Re()}}function Re(){document.querySelectorAll(".editor-tool[data-cmd]").forEach(n=>{const e=n.dataset.cmd,o=document.queryCommandState(e);n.classList.toggle("bg-primary/20",o),n.classList.toggle("text-primary",o)})}function De(n=null){const e=document.getElementById("editor-modal"),o=document.getElementById("edit-title"),t=document.getElementById("edit-content"),i=document.getElementById("edit-category"),a=e.querySelector(".dialog-content");p.editingNoteId=n?n.id:null,o.value=n?n.title:"",t.innerHTML=n?n.content:"";let r="";!n&&p.currentView!=="all"&&(r=p.currentView),i.value=n?n.categoryId||"":r;const s=Me.find(c=>c.id===(n?n.themeId:"default"))||Me[0],l=p.settings.theme==="dark"?s.dark:s.light,d=s.id==="default"?p.settings.theme==="dark":vn(l);a.style.backgroundColor=l,a.style.color=d?"rgba(255,255,255,0.95)":"rgba(0,0,0,0.9)",a.dataset.themeId=s.id,o.style.color=d?"rgba(255,255,255,0.95)":"rgba(0,0,0,0.9)",t.style.color=d?"rgba(255,255,255,0.95)":"rgba(0,0,0,0.9)",e.querySelectorAll(".editor-tool, #cat-dropdown-trigger, #toggle-pin, #toggle-lock").forEach(c=>{c.style.color=d?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.7)",c.style.borderColor=d?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)",c.style.backgroundColor=d?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"}),Vt(n?n.pinned:!1),Wt(n?!!n.passwordHash:!1),Tn(),e.classList.remove("hidden"),t.focus()}function vt(){document.getElementById("editor-modal").classList.add("hidden"),p.editingNoteId=null}async function kn(){let n=document.getElementById("edit-title").value.trim();const e=document.getElementById("edit-content").innerHTML,o=document.getElementById("edit-category").value,t=document.getElementById("toggle-pin").dataset.active==="true",i=document.getElementById("toggle-lock").dataset.active==="true",a=document.querySelector("#editor-modal .dialog-content").dataset.themeId;if(n||(n=new Date().toLocaleString()),!e.trim())return D("La nota está vacía");const r=p.notes.findIndex(l=>l.id===p.editingNoteId),s={id:p.editingNoteId||Date.now().toString(),title:n,content:e,categoryId:o||null,pinned:t,themeId:a||"default",passwordHash:i&&r>=0?p.notes[r].passwordHash:null,updatedAt:Date.now()};if(i&&!s.passwordHash){const l=await He("Seguridad","Establece una contraseña para esta nota:");if(l)s.passwordHash=await z.hashPassword(l);else return}r>=0?p.notes[r]=s:p.notes.unshift(s),await X(),vt()}function Be(){const n=window.getSelection();n.rangeCount>0&&(ht=n.getRangeAt(0))}function bt(){if(ht){const n=window.getSelection();n.removeAllRanges(),n.addRange(ht)}}function Tn(){const n=document.getElementById("edit-category").value,e=p.categories.find(o=>o.id===n);document.getElementById("selected-cat-label")&&(document.getElementById("selected-cat-label").innerText=e?e.name:"Sin categoría")}function Vt(n){const e=document.getElementById("toggle-pin");e.dataset.active=n,e.className=n?"h-9 w-9 inline-flex items-center justify-center rounded-md border border-primary bg-primary/20 text-primary shadow-inner":"h-9 w-9 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent text-muted-foreground"}function Wt(n){const e=document.getElementById("toggle-lock");e.dataset.active=n,e.className=n?"h-9 w-9 inline-flex items-center justify-center rounded-md border border-primary bg-primary/10 text-primary":"h-9 w-9 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent text-muted-foreground";const o=e.querySelector("[data-lucide]");o&&(o.setAttribute("data-lucide",n?"lock":"unlock"),ee())}function Cn(){document.getElementById("open-colors").onclick=i=>at(i,"color-popover"),document.getElementById("open-text-colors").onmousedown=i=>{i.preventDefault(),Be()},document.getElementById("open-text-colors").onclick=i=>at(i,"text-color-popover"),document.getElementById("open-emojis").onmousedown=i=>{i.preventDefault(),Be()},document.getElementById("open-emojis").onclick=i=>at(i,"emoji-popover");const n=document.getElementById("bg-color-grid");Me.forEach(i=>{const a=document.createElement("div");a.className="w-8 h-8 rounded-full cursor-pointer border hover:scale-110 transition-transform",a.style.backgroundColor=p.settings.theme==="dark"?i.dark:i.light,a.onclick=()=>{const r=document.querySelector("#editor-modal .dialog-content");r.style.backgroundColor=p.settings.theme==="dark"?i.dark:i.light,r.dataset.themeId=i.id,_e()},n.appendChild(a)});const e=document.getElementById("text-color-grid");Xt.forEach(i=>{const a=document.createElement("div");a.className="w-8 h-8 rounded-full cursor-pointer border hover:scale-110 transition-transform",a.style.backgroundColor=i,a.onmousedown=r=>r.preventDefault(),a.onclick=()=>{bt(),document.execCommand("foreColor",!1,i),_e()},e.appendChild(a)});const o=document.getElementById("emoji-grid");hn.forEach(i=>{const a=document.createElement("span");a.className="cursor-pointer hover:bg-accent p-2 rounded text-xl text-center",a.innerText=i,a.onclick=()=>{bt(),document.execCommand("insertHTML",!1,i),_e()},o.appendChild(a)}),document.getElementById("toggle-pin").onclick=function(){Vt(this.dataset.active!=="true")},document.getElementById("toggle-lock").onclick=function(){Wt(this.dataset.active!=="true")},document.addEventListener("click",i=>{!i.target.closest(".editor-tool")&&!i.target.closest(".popover-content")&&!i.target.closest("#cat-dropdown-trigger")&&_e()});const t=document.getElementById("cat-dropdown-trigger");t.onclick=i=>{i.stopPropagation(),document.getElementById("cat-dropdown-menu").classList.toggle("hidden")}}function at(n,e){n.stopPropagation();const o=document.getElementById(e),t=n.currentTarget.getBoundingClientRect();_e(e),o.classList.remove("hidden"),o.style.top=`${t.bottom+8}px`,o.style.left=`${Math.min(t.left,window.innerWidth-300)}px`}function _e(n=null){["color-popover","text-color-popover","emoji-popover","cat-dropdown-menu"].forEach(e=>{const o=document.getElementById(e);e!==n&&o&&o.classList.add("hidden")})}function Dn(){return`
    <div id="categories-modal" class="fixed inset-0 z-[70] hidden">
        <div class="dialog-overlay"></div>
        <div class="dialog-content max-w-lg p-0 overflow-hidden h-[500px] flex flex-col">
            <div class="p-6 flex justify-between items-center border-b">
                <div>
                    <h2 class="text-lg font-semibold text-foreground">Gestionar Etiquetas</h2>
                    <p class="text-xs text-muted-foreground">Organiza tus notas con categorías personalizadas</p>
                </div>
                <button class="close-categories p-2 hover:bg-accent rounded-md transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>

            <div class="p-4 bg-muted/30 border-b">
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <i data-lucide="tag" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></i>
                        <input type="text" id="new-cat-name" placeholder="Nueva etiqueta..." 
                               class="pl-12 h-10 w-full bg-background" autocomplete="off">
                    </div>
                    <button id="add-cat-btn" class="btn-shad btn-shad-primary h-10 px-6">Crear</button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-2" id="cat-manager-list">
                <!-- Items injected here -->
            </div>
        </div>
        <!-- Color Picker Popover -->
        <div id="cat-color-picker" class="fixed z-[80] hidden popover-content p-2">
            <div class="grid grid-cols-5 gap-2" id="cat-palette-grid"></div>
        </div>
    </div>`}function je(n,e=null){const o=document.getElementById("cat-manager-list");o&&(o.innerHTML="",e&&(p.categories=e),p.categories.forEach(t=>{const i=document.createElement("div");i.className="flex items-center gap-3 p-2 rounded-lg border bg-card/50 hover:bg-accent/30 transition-all group",i.innerHTML=`
            <div class="w-8 h-8 rounded-md cursor-pointer hover:scale-110 transition-transform shadow-sm flex-shrink-0 flex items-center justify-center border" 
                 style="background-color: ${t.color};"
                 id="cp-${t.id}" title="Cambiar color">
            </div>
            
            <input type="text" value="${t.name}" 
                   class="bg-transparent border-none outline-none font-medium text-sm flex-1 focus:ring-0 transition-colors h-9 px-2 rounded hover:bg-background/50 focus:bg-background"
                   id="cn-${t.id}" autocomplete="off">
            
            <div class="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button class="p-2 rounded-md hover:bg-background border border-transparent hover:border-border transition-all ${t.passwordHash?"text-primary":"text-muted-foreground"}"
                        id="lock-${t.id}" title="${t.passwordHash?"Protegido":"Protección"}">
                    <i data-lucide="${t.passwordHash?"lock":"unlock"}" class="w-4 h-4"></i>
                </button>
                <button class="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                        id="del-${t.id}" title="Eliminar">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `,o.appendChild(i),document.getElementById(`cp-${t.id}`).onclick=r=>{r.stopPropagation(),Bn(t.id,n,r.currentTarget)};const a=document.getElementById(`cn-${t.id}`);a.oninput=r=>{t.name=r.target.value,n()},a.onchange=async()=>{await X(),n()},document.getElementById(`lock-${t.id}`).onclick=()=>An(t.id,n),document.getElementById(`del-${t.id}`).onclick=()=>Nn(t.id,n)}),ee())}async function Bn(n,e,o){const t=p.categories.find(l=>l.id===n);if(!t)return;const i=document.getElementById("cat-color-picker"),a=document.getElementById("cat-palette-grid");a.innerHTML="",Xt.forEach(l=>{const d=document.createElement("div");d.className="w-6 h-6 rounded-md cursor-pointer border hover:scale-110 transition-transform",d.style.backgroundColor=l,d.onclick=async()=>{t.color=l,await X(),je(e),e(),i.classList.add("hidden")},a.appendChild(d)});const r=o.getBoundingClientRect();i.style.top=`${r.bottom+8}px`,i.style.left=`${r.left}px`,i.classList.remove("hidden");const s=l=>{!i.contains(l.target)&&l.target!==o&&(i.classList.add("hidden"),document.removeEventListener("click",s))};setTimeout(()=>document.addEventListener("click",s),10)}async function Nn(n,e){const o=p.categories.find(t=>t.id===n);if(o){if(o.passwordHash){const t=await He("Seguridad","Etiqueta protegida. Ingresa contraseña para eliminar:");if(!t)return;if(await z.hashPassword(t)!==o.passwordHash)return D("❌ Error: Contraseña incorrecta")}confirm(`¿Eliminar la etiqueta "${o.name}"? Las notas no se borrarán.`)&&(p.categories=p.categories.filter(t=>t.id!==n),p.notes.forEach(t=>{t.categoryId===n&&(t.categoryId=null)}),p.currentView===n&&(p.currentView="all"),await X(),je(e),e())}}async function An(n,e){const o=p.categories.find(t=>t.id===n);if(o){if(o.passwordHash){const t=await He("Seguridad","Ingresa la contraseña para quitar la protección:");if(!t)return;if(await z.hashPassword(t)!==o.passwordHash)return D("❌ Error: Contraseña incorrecta");o.passwordHash=null,D("🔓 Protección quitada")}else{const t=await He("Seguridad","Define una contraseña para proteger esta etiqueta:");t&&(o.passwordHash=await z.hashPassword(t),D("🔒 Etiqueta protegida"))}await X(),je(e),e()}}function Pn(){return`
    <div id="settings-modal" class="fixed inset-0 z-[80] hidden">
        <div class="dialog-overlay"></div>
        <div class="dialog-content max-w-2xl p-0 overflow-hidden flex flex-col md:flex-row h-[500px]">
            <!-- Sidebar Settings -->
            <div class="w-full md:w-48 bg-muted/50 border-b md:border-b-0 md:border-r p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <button class="settings-tab active" data-tab="appearance">
                    <i data-lucide="palette" class="w-4 h-4"></i> Apariencia
                </button>
                <button class="settings-tab" data-tab="sync">
                    <i data-lucide="refresh-cw" class="w-4 h-4"></i> Sincronización
                </button>
                <button class="settings-tab" data-tab="security">
                    <i data-lucide="shield" class="w-4 h-4"></i> Seguridad
                </button>
                <button class="settings-tab text-destructive mt-auto" data-tab="danger">
                    <i data-lucide="alert-triangle" class="w-4 h-4"></i> Zona Peligrosa
                </button>
            </div>

            <!-- Content Area -->
            <div class="flex-1 flex flex-col min-w-0">
                <div class="p-4 border-b flex justify-between items-center">
                    <h2 id="settings-tab-title" class="font-bold">Configuración</h2>
                    <button class="close-settings p-2 hover:bg-accent rounded-md group">
                        <i data-lucide="x" class="w-5 h-5 text-muted-foreground group-hover:text-foreground"></i>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-6" id="settings-panels">
                    <!-- Panel: Apariencia -->
                    <div id="panel-appearance" class="settings-panel space-y-6">
                        <section class="space-y-4">
                            <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tema Visual</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <button id="theme-light" class="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent transition-all group">
                                    <div class="w-full aspect-video bg-zinc-100 rounded border flex items-center justify-center">
                                         <div class="w-1/2 h-2 bg-zinc-300 rounded"></div>
                                    </div>
                                    <span class="text-xs font-medium">Claro</span>
                                </button>
                                <button id="theme-dark" class="flex flex-col items-center gap-2 p-4 rounded-lg border bg-zinc-950 hover:bg-zinc-900 transition-all group ring-primary">
                                    <div class="w-full aspect-video bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                                         <div class="w-1/2 h-2 bg-zinc-600 rounded"></div>
                                    </div>
                                    <span class="text-xs font-medium text-white">Oscuro</span>
                                </button>
                            </div>
                        </section>
                    </div>

                    <!-- Panel: Sincronización -->
                    <div id="panel-sync" class="settings-panel hidden space-y-6">
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Google Drive</h3>
                                <span id="drive-status" class="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-bold uppercase">Desconectado</span>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium">Nombre de carpeta en Drive</label>
                                <input type="text" id="config-drive-path" class="h-10 px-4 w-full" placeholder="p.ej. CloudNotesV3" autocomplete="off">
                                <p class="text-[10px] text-muted-foreground">Las notas se guardarán encriptadas dentro de esta carpeta.</p>
                            </div>
                            <button id="save-sync-config" class="btn-shad btn-shad-primary w-full h-10">Guardar Cambios</button>
                        </section>
                    </div>

                    <!-- Panel: Seguridad -->
                    <div id="panel-security" class="settings-panel hidden space-y-6">
                        <section class="space-y-4">
                            <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Encriptación</h3>
                            <div class="space-y-2">
                                <label class="text-xs font-medium">Algoritmo preferido</label>
                                <select id="config-algo" class="h-10 w-full px-3">
                                    <option value="aes-256-gcm">AES-256-GCM (Recomendado)</option>
                                    <option value="kyber">CRYSTALS-Kyber (Experimental)</option>
                                </select>
                            </div>
                             <button id="save-security-config" class="btn-shad btn-shad-primary w-full h-10">Actualizar Algoritmo</button>
                        </section>
                    </div>

                    <!-- Panel: Danger Zone -->
                    <div id="panel-danger" class="settings-panel hidden space-y-6">
                        <section class="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-4">
                            <h3 class="text-sm font-semibold text-destructive uppercase tracking-wider">Acciones Irreversibles</h3>
                            <p class="text-xs text-muted-foreground">Al restaurar de fábrica se borrarán todas las notas, categorías y configuraciones de este navegador.</p>
                            <button id="factory-reset" class="btn-shad bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full h-10">
                                <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i> Borrar Todo Localmente
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>`}function On(){const n=document.querySelectorAll(".settings-panel"),e=document.querySelectorAll(".settings-tab"),o=document.getElementById("settings-tab-title");e.forEach(t=>{t.onclick=()=>{const i=t.dataset.tab;e.forEach(r=>r.classList.toggle("active",r===t)),n.forEach(r=>r.classList.toggle("hidden",r.id!==`panel-${i}`));const a={appearance:"Apariencia y Temas",sync:"Sincronización Cloud",security:"Seguridad y Cifrado",danger:"Zona Peligrosa"};o.innerText=a[i]||"Configuración",ee()}})}function Ln(){return`
    <!-- Prompt Modal -->
    <div id="prompt-modal" class="fixed inset-0 z-[200] hidden">
        <div class="absolute inset-0 bg-background/90 backdrop-blur-xl"></div>
        <div class="dialog-content max-w-sm">
            <h2 id="prompt-title" class="text-lg font-bold mb-2">Seguridad</h2>
            <p id="prompt-desc" class="text-sm text-muted-foreground mb-6">Ingresa la contraseña para continuar</p>
            <div class="space-y-4">
                <div class="relative">
                    <input type="password" id="prompt-input" placeholder="Tu contraseña"
                        class="text-center tracking-widest outline-none pr-10">
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground toggle-pass"
                        data-target="prompt-input">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="flex gap-2">
                    <button id="prompt-cancel" class="btn-shad btn-shad-outline flex-1">Cancelar</button>
                    <button id="prompt-confirm" class="btn-shad btn-shad-primary flex-1">Confirmar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast">
        <div class="border">
            ¡Acción completada!
        </div>
    </div>`}function yt(n,e=null){const o=document.getElementById("sidebar-categories"),t=document.getElementById("mobile-sidebar-categories"),i=document.getElementById("edit-category"),a=document.getElementById("cat-dropdown-menu");e&&(p.categories=e),o&&(o.innerHTML=""),t&&(t.innerHTML=""),i&&(i.innerHTML='<option value="">Sin categoría</option>'),a&&(a.innerHTML='<div class="px-3 py-1.5 text-xs hover:bg-accent cursor-pointer border-b" data-id="">Sin categoría</div>');const r=(l,d,f)=>{if(!a)return;const c=document.createElement("div");c.className="px-3 py-1.5 text-xs hover:bg-accent cursor-pointer flex items-center gap-2",c.innerHTML=`<div class="w-2 h-2 rounded-full" style="background-color: ${f}"></div> ${d}`,c.onclick=()=>{i&&(i.value=l),s(),a.classList.add("hidden")},a.appendChild(c)},s=()=>{const l=document.getElementById("edit-category").value,d=p.categories.find(f=>f.id===l);document.getElementById("selected-cat-label").innerText=d?d.name:"Sin categoría"};if(a){const l=a.querySelector('[data-id=""]');l&&(l.onclick=()=>{i&&(i.value=""),s(),a.classList.add("hidden")})}p.categories.forEach(l=>{const d=(f=!1)=>{const c=document.createElement("button");c.className=f?"nav-link-mobile-drawer w-full group":"nav-link w-full group",p.currentView===l.id&&c.classList.add("active"),c.onclick=async()=>{if(l.passwordHash){const b=await He("Acceso Restringido",`Ingresa la contraseña para "${l.name}":`);if(!b)return;if(await z.hashPassword(b)!==l.passwordHash){D("Contraseña incorrecta");return}}document.querySelectorAll(".nav-link, .nav-link-mobile-drawer").forEach(b=>b.classList.remove("active")),c.classList.add("active"),n(l.id,l.name),f&&document.getElementById("mobile-sidebar-overlay").classList.add("hidden")};const h=p.settings.theme==="dark"?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)";return c.innerHTML=`
                <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full shadow-sm" style="background-color: ${l.color}; border: 1px solid ${h}"></div>
                    <span class="truncate">${l.name}</span>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${l.passwordHash?'<i data-lucide="lock" class="w-3 h-3 text-muted-foreground"></i>':""}
                </div>
            `,c};if(o&&o.appendChild(d(!1)),t&&t.appendChild(d(!0)),i){const f=document.createElement("option");f.value=l.id,f.innerText=l.name,i.appendChild(f)}r(l.id,l.name,l.color)}),ee()}/**!
 * Sortable 1.15.6
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function At(n,e){var o=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);e&&(t=t.filter(function(i){return Object.getOwnPropertyDescriptor(n,i).enumerable})),o.push.apply(o,t)}return o}function U(n){for(var e=1;e<arguments.length;e++){var o=arguments[e]!=null?arguments[e]:{};e%2?At(Object(o),!0).forEach(function(t){Mn(n,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(o)):At(Object(o)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(o,t))})}return n}function Ve(n){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?Ve=function(e){return typeof e}:Ve=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Ve(n)}function Mn(n,e,o){return e in n?Object.defineProperty(n,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[e]=o,n}function Q(){return Q=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(n[t]=o[t])}return n},Q.apply(this,arguments)}function Hn(n,e){if(n==null)return{};var o={},t=Object.keys(n),i,a;for(a=0;a<t.length;a++)i=t[a],!(e.indexOf(i)>=0)&&(o[i]=n[i]);return o}function jn(n,e){if(n==null)return{};var o=Hn(n,e),t,i;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(i=0;i<a.length;i++)t=a[i],!(e.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(n,t)&&(o[t]=n[t])}return o}var $n="1.15.6";function Z(n){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(n)}var te=Z(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),$e=Z(/Edge/i),Pt=Z(/firefox/i),Ne=Z(/safari/i)&&!Z(/chrome/i)&&!Z(/android/i),_t=Z(/iP(ad|od|hone)/i),Ut=Z(/chrome/i)&&Z(/android/i),Jt={capture:!1,passive:!1};function w(n,e,o){n.addEventListener(e,o,!te&&Jt)}function y(n,e,o){n.removeEventListener(e,o,!te&&Jt)}function Ze(n,e){if(e){if(e[0]===">"&&(e=e.substring(1)),n)try{if(n.matches)return n.matches(e);if(n.msMatchesSelector)return n.msMatchesSelector(e);if(n.webkitMatchesSelector)return n.webkitMatchesSelector(e)}catch{return!1}return!1}}function Kt(n){return n.host&&n!==document&&n.host.nodeType?n.host:n.parentNode}function Y(n,e,o,t){if(n){o=o||document;do{if(e!=null&&(e[0]===">"?n.parentNode===o&&Ze(n,e):Ze(n,e))||t&&n===o)return n;if(n===o)break}while(n=Kt(n))}return null}var Ot=/\s+/g;function j(n,e,o){if(n&&e)if(n.classList)n.classList[o?"add":"remove"](e);else{var t=(" "+n.className+" ").replace(Ot," ").replace(" "+e+" "," ");n.className=(t+(o?" "+e:"")).replace(Ot," ")}}function g(n,e,o){var t=n&&n.style;if(t){if(o===void 0)return document.defaultView&&document.defaultView.getComputedStyle?o=document.defaultView.getComputedStyle(n,""):n.currentStyle&&(o=n.currentStyle),e===void 0?o:o[e];!(e in t)&&e.indexOf("webkit")===-1&&(e="-webkit-"+e),t[e]=o+(typeof o=="string"?"":"px")}}function ve(n,e){var o="";if(typeof n=="string")o=n;else do{var t=g(n,"transform");t&&t!=="none"&&(o=t+" "+o)}while(!e&&(n=n.parentNode));var i=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return i&&new i(o)}function Zt(n,e,o){if(n){var t=n.getElementsByTagName(e),i=0,a=t.length;if(o)for(;i<a;i++)o(t[i],i);return t}return[]}function W(){var n=document.scrollingElement;return n||document.documentElement}function C(n,e,o,t,i){if(!(!n.getBoundingClientRect&&n!==window)){var a,r,s,l,d,f,c;if(n!==window&&n.parentNode&&n!==W()?(a=n.getBoundingClientRect(),r=a.top,s=a.left,l=a.bottom,d=a.right,f=a.height,c=a.width):(r=0,s=0,l=window.innerHeight,d=window.innerWidth,f=window.innerHeight,c=window.innerWidth),(e||o)&&n!==window&&(i=i||n.parentNode,!te))do if(i&&i.getBoundingClientRect&&(g(i,"transform")!=="none"||o&&g(i,"position")!=="static")){var h=i.getBoundingClientRect();r-=h.top+parseInt(g(i,"border-top-width")),s-=h.left+parseInt(g(i,"border-left-width")),l=r+a.height,d=s+a.width;break}while(i=i.parentNode);if(t&&n!==window){var b=ve(i||n),x=b&&b.a,E=b&&b.d;b&&(r/=E,s/=x,c/=x,f/=E,l=r+f,d=s+c)}return{top:r,left:s,bottom:l,right:d,width:c,height:f}}}function Lt(n,e,o){for(var t=re(n,!0),i=C(n)[e];t;){var a=C(t)[o],r=void 0;if(r=i>=a,!r)return t;if(t===W())break;t=re(t,!1)}return!1}function be(n,e,o,t){for(var i=0,a=0,r=n.children;a<r.length;){if(r[a].style.display!=="none"&&r[a]!==m.ghost&&(t||r[a]!==m.dragged)&&Y(r[a],o.draggable,n,!1)){if(i===e)return r[a];i++}a++}return null}function kt(n,e){for(var o=n.lastElementChild;o&&(o===m.ghost||g(o,"display")==="none"||e&&!Ze(o,e));)o=o.previousElementSibling;return o||null}function F(n,e){var o=0;if(!n||!n.parentNode)return-1;for(;n=n.previousElementSibling;)n.nodeName.toUpperCase()!=="TEMPLATE"&&n!==m.clone&&(!e||Ze(n,e))&&o++;return o}function Mt(n){var e=0,o=0,t=W();if(n)do{var i=ve(n),a=i.a,r=i.d;e+=n.scrollLeft*a,o+=n.scrollTop*r}while(n!==t&&(n=n.parentNode));return[e,o]}function Fn(n,e){for(var o in n)if(n.hasOwnProperty(o)){for(var t in e)if(e.hasOwnProperty(t)&&e[t]===n[o][t])return Number(o)}return-1}function re(n,e){if(!n||!n.getBoundingClientRect)return W();var o=n,t=!1;do if(o.clientWidth<o.scrollWidth||o.clientHeight<o.scrollHeight){var i=g(o);if(o.clientWidth<o.scrollWidth&&(i.overflowX=="auto"||i.overflowX=="scroll")||o.clientHeight<o.scrollHeight&&(i.overflowY=="auto"||i.overflowY=="scroll")){if(!o.getBoundingClientRect||o===document.body)return W();if(t||e)return o;t=!0}}while(o=o.parentNode);return W()}function zn(n,e){if(n&&e)for(var o in e)e.hasOwnProperty(o)&&(n[o]=e[o]);return n}function rt(n,e){return Math.round(n.top)===Math.round(e.top)&&Math.round(n.left)===Math.round(e.left)&&Math.round(n.height)===Math.round(e.height)&&Math.round(n.width)===Math.round(e.width)}var Ae;function Qt(n,e){return function(){if(!Ae){var o=arguments,t=this;o.length===1?n.call(t,o[0]):n.apply(t,o),Ae=setTimeout(function(){Ae=void 0},e)}}}function Rn(){clearTimeout(Ae),Ae=void 0}function en(n,e,o){n.scrollLeft+=e,n.scrollTop+=o}function tn(n){var e=window.Polymer,o=window.jQuery||window.Zepto;return e&&e.dom?e.dom(n).cloneNode(!0):o?o(n).clone(!0)[0]:n.cloneNode(!0)}function nn(n,e,o){var t={};return Array.from(n.children).forEach(function(i){var a,r,s,l;if(!(!Y(i,e.draggable,n,!1)||i.animated||i===o)){var d=C(i);t.left=Math.min((a=t.left)!==null&&a!==void 0?a:1/0,d.left),t.top=Math.min((r=t.top)!==null&&r!==void 0?r:1/0,d.top),t.right=Math.max((s=t.right)!==null&&s!==void 0?s:-1/0,d.right),t.bottom=Math.max((l=t.bottom)!==null&&l!==void 0?l:-1/0,d.bottom)}}),t.width=t.right-t.left,t.height=t.bottom-t.top,t.x=t.left,t.y=t.top,t}var L="Sortable"+new Date().getTime();function qn(){var n=[],e;return{captureAnimationState:function(){if(n=[],!!this.options.animation){var t=[].slice.call(this.el.children);t.forEach(function(i){if(!(g(i,"display")==="none"||i===m.ghost)){n.push({target:i,rect:C(i)});var a=U({},n[n.length-1].rect);if(i.thisAnimationDuration){var r=ve(i,!0);r&&(a.top-=r.f,a.left-=r.e)}i.fromRect=a}})}},addAnimationState:function(t){n.push(t)},removeAnimationState:function(t){n.splice(Fn(n,{target:t}),1)},animateAll:function(t){var i=this;if(!this.options.animation){clearTimeout(e),typeof t=="function"&&t();return}var a=!1,r=0;n.forEach(function(s){var l=0,d=s.target,f=d.fromRect,c=C(d),h=d.prevFromRect,b=d.prevToRect,x=s.rect,E=ve(d,!0);E&&(c.top-=E.f,c.left-=E.e),d.toRect=c,d.thisAnimationDuration&&rt(h,c)&&!rt(f,c)&&(x.top-c.top)/(x.left-c.left)===(f.top-c.top)/(f.left-c.left)&&(l=Yn(x,h,b,i.options)),rt(c,f)||(d.prevFromRect=f,d.prevToRect=c,l||(l=i.options.animation),i.animate(d,x,c,l)),l&&(a=!0,r=Math.max(r,l),clearTimeout(d.animationResetTimer),d.animationResetTimer=setTimeout(function(){d.animationTime=0,d.prevFromRect=null,d.fromRect=null,d.prevToRect=null,d.thisAnimationDuration=null},l),d.thisAnimationDuration=l)}),clearTimeout(e),a?e=setTimeout(function(){typeof t=="function"&&t()},r):typeof t=="function"&&t(),n=[]},animate:function(t,i,a,r){if(r){g(t,"transition",""),g(t,"transform","");var s=ve(this.el),l=s&&s.a,d=s&&s.d,f=(i.left-a.left)/(l||1),c=(i.top-a.top)/(d||1);t.animatingX=!!f,t.animatingY=!!c,g(t,"transform","translate3d("+f+"px,"+c+"px,0)"),this.forRepaintDummy=Gn(t),g(t,"transition","transform "+r+"ms"+(this.options.easing?" "+this.options.easing:"")),g(t,"transform","translate3d(0,0,0)"),typeof t.animated=="number"&&clearTimeout(t.animated),t.animated=setTimeout(function(){g(t,"transition",""),g(t,"transform",""),t.animated=!1,t.animatingX=!1,t.animatingY=!1},r)}}}}function Gn(n){return n.offsetWidth}function Yn(n,e,o,t){return Math.sqrt(Math.pow(e.top-n.top,2)+Math.pow(e.left-n.left,2))/Math.sqrt(Math.pow(e.top-o.top,2)+Math.pow(e.left-o.left,2))*t.animation}var pe=[],st={initializeByDefault:!0},Fe={mount:function(e){for(var o in st)st.hasOwnProperty(o)&&!(o in e)&&(e[o]=st[o]);pe.forEach(function(t){if(t.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),pe.push(e)},pluginEvent:function(e,o,t){var i=this;this.eventCanceled=!1,t.cancel=function(){i.eventCanceled=!0};var a=e+"Global";pe.forEach(function(r){o[r.pluginName]&&(o[r.pluginName][a]&&o[r.pluginName][a](U({sortable:o},t)),o.options[r.pluginName]&&o[r.pluginName][e]&&o[r.pluginName][e](U({sortable:o},t)))})},initializePlugins:function(e,o,t,i){pe.forEach(function(s){var l=s.pluginName;if(!(!e.options[l]&&!s.initializeByDefault)){var d=new s(e,o,e.options);d.sortable=e,d.options=e.options,e[l]=d,Q(t,d.defaults)}});for(var a in e.options)if(e.options.hasOwnProperty(a)){var r=this.modifyOption(e,a,e.options[a]);typeof r<"u"&&(e.options[a]=r)}},getEventProperties:function(e,o){var t={};return pe.forEach(function(i){typeof i.eventProperties=="function"&&Q(t,i.eventProperties.call(o[i.pluginName],e))}),t},modifyOption:function(e,o,t){var i;return pe.forEach(function(a){e[a.pluginName]&&a.optionListeners&&typeof a.optionListeners[o]=="function"&&(i=a.optionListeners[o].call(e[a.pluginName],t))}),i}};function Xn(n){var e=n.sortable,o=n.rootEl,t=n.name,i=n.targetEl,a=n.cloneEl,r=n.toEl,s=n.fromEl,l=n.oldIndex,d=n.newIndex,f=n.oldDraggableIndex,c=n.newDraggableIndex,h=n.originalEvent,b=n.putSortable,x=n.extraEventProperties;if(e=e||o&&o[L],!!e){var E,R=e.options,J="on"+t.charAt(0).toUpperCase()+t.substr(1);window.CustomEvent&&!te&&!$e?E=new CustomEvent(t,{bubbles:!0,cancelable:!0}):(E=document.createEvent("Event"),E.initEvent(t,!0,!0)),E.to=r||o,E.from=s||o,E.item=i||o,E.clone=a,E.oldIndex=l,E.newIndex=d,E.oldDraggableIndex=f,E.newDraggableIndex=c,E.originalEvent=h,E.pullMode=b?b.lastPutMode:void 0;var A=U(U({},x),Fe.getEventProperties(t,e));for(var q in A)E[q]=A[q];o&&o.dispatchEvent(E),R[J]&&R[J].call(e,E)}}var Vn=["evt"],O=function(e,o){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=t.evt,a=jn(t,Vn);Fe.pluginEvent.bind(m)(e,o,U({dragEl:u,parentEl:_,ghostEl:v,rootEl:S,nextEl:fe,lastDownEl:We,cloneEl:I,cloneHidden:ae,dragStarted:ke,putSortable:B,activeSortable:m.active,originalEvent:i,oldIndex:he,oldDraggableIndex:Pe,newIndex:$,newDraggableIndex:ie,hideGhostForTarget:sn,unhideGhostForTarget:ln,cloneNowHidden:function(){ae=!0},cloneNowShown:function(){ae=!1},dispatchSortableEvent:function(s){P({sortable:o,name:s,originalEvent:i})}},a))};function P(n){Xn(U({putSortable:B,cloneEl:I,targetEl:u,rootEl:S,oldIndex:he,oldDraggableIndex:Pe,newIndex:$,newDraggableIndex:ie},n))}var u,_,v,S,fe,We,I,ae,he,$,Pe,ie,qe,B,me=!1,Qe=!1,et=[],ce,G,lt,dt,Ht,jt,ke,ge,Oe,Le=!1,Ge=!1,Ue,N,ct=[],wt=!1,tt=[],it=typeof document<"u",Ye=_t,$t=$e||te?"cssFloat":"float",Wn=it&&!Ut&&!_t&&"draggable"in document.createElement("div"),on=function(){if(it){if(te)return!1;var n=document.createElement("x");return n.style.cssText="pointer-events:auto",n.style.pointerEvents==="auto"}}(),an=function(e,o){var t=g(e),i=parseInt(t.width)-parseInt(t.paddingLeft)-parseInt(t.paddingRight)-parseInt(t.borderLeftWidth)-parseInt(t.borderRightWidth),a=be(e,0,o),r=be(e,1,o),s=a&&g(a),l=r&&g(r),d=s&&parseInt(s.marginLeft)+parseInt(s.marginRight)+C(a).width,f=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+C(r).width;if(t.display==="flex")return t.flexDirection==="column"||t.flexDirection==="column-reverse"?"vertical":"horizontal";if(t.display==="grid")return t.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(a&&s.float&&s.float!=="none"){var c=s.float==="left"?"left":"right";return r&&(l.clear==="both"||l.clear===c)?"vertical":"horizontal"}return a&&(s.display==="block"||s.display==="flex"||s.display==="table"||s.display==="grid"||d>=i&&t[$t]==="none"||r&&t[$t]==="none"&&d+f>i)?"vertical":"horizontal"},Un=function(e,o,t){var i=t?e.left:e.top,a=t?e.right:e.bottom,r=t?e.width:e.height,s=t?o.left:o.top,l=t?o.right:o.bottom,d=t?o.width:o.height;return i===s||a===l||i+r/2===s+d/2},Jn=function(e,o){var t;return et.some(function(i){var a=i[L].options.emptyInsertThreshold;if(!(!a||kt(i))){var r=C(i),s=e>=r.left-a&&e<=r.right+a,l=o>=r.top-a&&o<=r.bottom+a;if(s&&l)return t=i}}),t},rn=function(e){function o(a,r){return function(s,l,d,f){var c=s.options.group.name&&l.options.group.name&&s.options.group.name===l.options.group.name;if(a==null&&(r||c))return!0;if(a==null||a===!1)return!1;if(r&&a==="clone")return a;if(typeof a=="function")return o(a(s,l,d,f),r)(s,l,d,f);var h=(r?s:l).options.group.name;return a===!0||typeof a=="string"&&a===h||a.join&&a.indexOf(h)>-1}}var t={},i=e.group;(!i||Ve(i)!="object")&&(i={name:i}),t.name=i.name,t.checkPull=o(i.pull,!0),t.checkPut=o(i.put),t.revertClone=i.revertClone,e.group=t},sn=function(){!on&&v&&g(v,"display","none")},ln=function(){!on&&v&&g(v,"display","")};it&&!Ut&&document.addEventListener("click",function(n){if(Qe)return n.preventDefault(),n.stopPropagation&&n.stopPropagation(),n.stopImmediatePropagation&&n.stopImmediatePropagation(),Qe=!1,!1},!0);var ue=function(e){if(u){e=e.touches?e.touches[0]:e;var o=Jn(e.clientX,e.clientY);if(o){var t={};for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.target=t.rootEl=o,t.preventDefault=void 0,t.stopPropagation=void 0,o[L]._onDragOver(t)}}},Kn=function(e){u&&u.parentNode[L]._isOutsideThisEl(e.target)};function m(n,e){if(!(n&&n.nodeType&&n.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(n));this.el=n,this.options=e=Q({},e),n[L]=this;var o={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(n.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return an(n,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(r,s){r.setData("Text",s.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:m.supportPointer!==!1&&"PointerEvent"in window&&(!Ne||_t),emptyInsertThreshold:5};Fe.initializePlugins(this,n,o);for(var t in o)!(t in e)&&(e[t]=o[t]);rn(e);for(var i in this)i.charAt(0)==="_"&&typeof this[i]=="function"&&(this[i]=this[i].bind(this));this.nativeDraggable=e.forceFallback?!1:Wn,this.nativeDraggable&&(this.options.touchStartThreshold=1),e.supportPointer?w(n,"pointerdown",this._onTapStart):(w(n,"mousedown",this._onTapStart),w(n,"touchstart",this._onTapStart)),this.nativeDraggable&&(w(n,"dragover",this),w(n,"dragenter",this)),et.push(this.el),e.store&&e.store.get&&this.sort(e.store.get(this)||[]),Q(this,qn())}m.prototype={constructor:m,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&(ge=null)},_getDirection:function(e,o){return typeof this.options.direction=="function"?this.options.direction.call(this,e,o,u):this.options.direction},_onTapStart:function(e){if(e.cancelable){var o=this,t=this.el,i=this.options,a=i.preventOnFilter,r=e.type,s=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,l=(s||e).target,d=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,f=i.filter;if(ao(t),!u&&!(/mousedown|pointerdown/.test(r)&&e.button!==0||i.disabled)&&!d.isContentEditable&&!(!this.nativeDraggable&&Ne&&l&&l.tagName.toUpperCase()==="SELECT")&&(l=Y(l,i.draggable,t,!1),!(l&&l.animated)&&We!==l)){if(he=F(l),Pe=F(l,i.draggable),typeof f=="function"){if(f.call(this,e,l,this)){P({sortable:o,rootEl:d,name:"filter",targetEl:l,toEl:t,fromEl:t}),O("filter",o,{evt:e}),a&&e.preventDefault();return}}else if(f&&(f=f.split(",").some(function(c){if(c=Y(d,c.trim(),t,!1),c)return P({sortable:o,rootEl:c,name:"filter",targetEl:l,fromEl:t,toEl:t}),O("filter",o,{evt:e}),!0}),f)){a&&e.preventDefault();return}i.handle&&!Y(d,i.handle,t,!1)||this._prepareDragStart(e,s,l)}}},_prepareDragStart:function(e,o,t){var i=this,a=i.el,r=i.options,s=a.ownerDocument,l;if(t&&!u&&t.parentNode===a){var d=C(t);if(S=a,u=t,_=u.parentNode,fe=u.nextSibling,We=t,qe=r.group,m.dragged=u,ce={target:u,clientX:(o||e).clientX,clientY:(o||e).clientY},Ht=ce.clientX-d.left,jt=ce.clientY-d.top,this._lastX=(o||e).clientX,this._lastY=(o||e).clientY,u.style["will-change"]="all",l=function(){if(O("delayEnded",i,{evt:e}),m.eventCanceled){i._onDrop();return}i._disableDelayedDragEvents(),!Pt&&i.nativeDraggable&&(u.draggable=!0),i._triggerDragStart(e,o),P({sortable:i,name:"choose",originalEvent:e}),j(u,r.chosenClass,!0)},r.ignore.split(",").forEach(function(f){Zt(u,f.trim(),ut)}),w(s,"dragover",ue),w(s,"mousemove",ue),w(s,"touchmove",ue),r.supportPointer?(w(s,"pointerup",i._onDrop),!this.nativeDraggable&&w(s,"pointercancel",i._onDrop)):(w(s,"mouseup",i._onDrop),w(s,"touchend",i._onDrop),w(s,"touchcancel",i._onDrop)),Pt&&this.nativeDraggable&&(this.options.touchStartThreshold=4,u.draggable=!0),O("delayStart",this,{evt:e}),r.delay&&(!r.delayOnTouchOnly||o)&&(!this.nativeDraggable||!($e||te))){if(m.eventCanceled){this._onDrop();return}r.supportPointer?(w(s,"pointerup",i._disableDelayedDrag),w(s,"pointercancel",i._disableDelayedDrag)):(w(s,"mouseup",i._disableDelayedDrag),w(s,"touchend",i._disableDelayedDrag),w(s,"touchcancel",i._disableDelayedDrag)),w(s,"mousemove",i._delayedDragTouchMoveHandler),w(s,"touchmove",i._delayedDragTouchMoveHandler),r.supportPointer&&w(s,"pointermove",i._delayedDragTouchMoveHandler),i._dragStartTimer=setTimeout(l,r.delay)}else l()}},_delayedDragTouchMoveHandler:function(e){var o=e.touches?e.touches[0]:e;Math.max(Math.abs(o.clientX-this._lastX),Math.abs(o.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){u&&ut(u),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;y(e,"mouseup",this._disableDelayedDrag),y(e,"touchend",this._disableDelayedDrag),y(e,"touchcancel",this._disableDelayedDrag),y(e,"pointerup",this._disableDelayedDrag),y(e,"pointercancel",this._disableDelayedDrag),y(e,"mousemove",this._delayedDragTouchMoveHandler),y(e,"touchmove",this._delayedDragTouchMoveHandler),y(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,o){o=o||e.pointerType=="touch"&&e,!this.nativeDraggable||o?this.options.supportPointer?w(document,"pointermove",this._onTouchMove):o?w(document,"touchmove",this._onTouchMove):w(document,"mousemove",this._onTouchMove):(w(u,"dragend",this),w(S,"dragstart",this._onDragStart));try{document.selection?Je(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,o){if(me=!1,S&&u){O("dragStarted",this,{evt:o}),this.nativeDraggable&&w(document,"dragover",Kn);var t=this.options;!e&&j(u,t.dragClass,!1),j(u,t.ghostClass,!0),m.active=this,e&&this._appendGhost(),P({sortable:this,name:"start",originalEvent:o})}else this._nulling()},_emulateDragOver:function(){if(G){this._lastX=G.clientX,this._lastY=G.clientY,sn();for(var e=document.elementFromPoint(G.clientX,G.clientY),o=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(G.clientX,G.clientY),e!==o);)o=e;if(u.parentNode[L]._isOutsideThisEl(e),o)do{if(o[L]){var t=void 0;if(t=o[L]._onDragOver({clientX:G.clientX,clientY:G.clientY,target:e,rootEl:o}),t&&!this.options.dragoverBubble)break}e=o}while(o=Kt(o));ln()}},_onTouchMove:function(e){if(ce){var o=this.options,t=o.fallbackTolerance,i=o.fallbackOffset,a=e.touches?e.touches[0]:e,r=v&&ve(v,!0),s=v&&r&&r.a,l=v&&r&&r.d,d=Ye&&N&&Mt(N),f=(a.clientX-ce.clientX+i.x)/(s||1)+(d?d[0]-ct[0]:0)/(s||1),c=(a.clientY-ce.clientY+i.y)/(l||1)+(d?d[1]-ct[1]:0)/(l||1);if(!m.active&&!me){if(t&&Math.max(Math.abs(a.clientX-this._lastX),Math.abs(a.clientY-this._lastY))<t)return;this._onDragStart(e,!0)}if(v){r?(r.e+=f-(lt||0),r.f+=c-(dt||0)):r={a:1,b:0,c:0,d:1,e:f,f:c};var h="matrix(".concat(r.a,",").concat(r.b,",").concat(r.c,",").concat(r.d,",").concat(r.e,",").concat(r.f,")");g(v,"webkitTransform",h),g(v,"mozTransform",h),g(v,"msTransform",h),g(v,"transform",h),lt=f,dt=c,G=a}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!v){var e=this.options.fallbackOnBody?document.body:S,o=C(u,!0,Ye,!0,e),t=this.options;if(Ye){for(N=e;g(N,"position")==="static"&&g(N,"transform")==="none"&&N!==document;)N=N.parentNode;N!==document.body&&N!==document.documentElement?(N===document&&(N=W()),o.top+=N.scrollTop,o.left+=N.scrollLeft):N=W(),ct=Mt(N)}v=u.cloneNode(!0),j(v,t.ghostClass,!1),j(v,t.fallbackClass,!0),j(v,t.dragClass,!0),g(v,"transition",""),g(v,"transform",""),g(v,"box-sizing","border-box"),g(v,"margin",0),g(v,"top",o.top),g(v,"left",o.left),g(v,"width",o.width),g(v,"height",o.height),g(v,"opacity","0.8"),g(v,"position",Ye?"absolute":"fixed"),g(v,"zIndex","100000"),g(v,"pointerEvents","none"),m.ghost=v,e.appendChild(v),g(v,"transform-origin",Ht/parseInt(v.style.width)*100+"% "+jt/parseInt(v.style.height)*100+"%")}},_onDragStart:function(e,o){var t=this,i=e.dataTransfer,a=t.options;if(O("dragStart",this,{evt:e}),m.eventCanceled){this._onDrop();return}O("setupClone",this),m.eventCanceled||(I=tn(u),I.removeAttribute("id"),I.draggable=!1,I.style["will-change"]="",this._hideClone(),j(I,this.options.chosenClass,!1),m.clone=I),t.cloneId=Je(function(){O("clone",t),!m.eventCanceled&&(t.options.removeCloneOnHide||S.insertBefore(I,u),t._hideClone(),P({sortable:t,name:"clone"}))}),!o&&j(u,a.dragClass,!0),o?(Qe=!0,t._loopId=setInterval(t._emulateDragOver,50)):(y(document,"mouseup",t._onDrop),y(document,"touchend",t._onDrop),y(document,"touchcancel",t._onDrop),i&&(i.effectAllowed="move",a.setData&&a.setData.call(t,i,u)),w(document,"drop",t),g(u,"transform","translateZ(0)")),me=!0,t._dragStartId=Je(t._dragStarted.bind(t,o,e)),w(document,"selectstart",t),ke=!0,window.getSelection().removeAllRanges(),Ne&&g(document.body,"user-select","none")},_onDragOver:function(e){var o=this.el,t=e.target,i,a,r,s=this.options,l=s.group,d=m.active,f=qe===l,c=s.sort,h=B||d,b,x=this,E=!1;if(wt)return;function R(Ie,fn){O(Ie,x,U({evt:e,isOwner:f,axis:b?"vertical":"horizontal",revert:r,dragRect:i,targetRect:a,canSort:c,fromSortable:h,target:t,completed:A,onMove:function(Bt,pn){return Xe(S,o,u,i,Bt,C(Bt),e,pn)},changed:q},fn))}function J(){R("dragOverAnimationCapture"),x.captureAnimationState(),x!==h&&h.captureAnimationState()}function A(Ie){return R("dragOverCompleted",{insertion:Ie}),Ie&&(f?d._hideClone():d._showClone(x),x!==h&&(j(u,B?B.options.ghostClass:d.options.ghostClass,!1),j(u,s.ghostClass,!0)),B!==x&&x!==m.active?B=x:x===m.active&&B&&(B=null),h===x&&(x._ignoreWhileAnimating=t),x.animateAll(function(){R("dragOverAnimationComplete"),x._ignoreWhileAnimating=null}),x!==h&&(h.animateAll(),h._ignoreWhileAnimating=null)),(t===u&&!u.animated||t===o&&!t.animated)&&(ge=null),!s.dragoverBubble&&!e.rootEl&&t!==document&&(u.parentNode[L]._isOutsideThisEl(e.target),!Ie&&ue(e)),!s.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),E=!0}function q(){$=F(u),ie=F(u,s.draggable),P({sortable:x,name:"change",toEl:o,newIndex:$,newDraggableIndex:ie,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),t=Y(t,s.draggable,o,!0),R("dragOver"),m.eventCanceled)return E;if(u.contains(e.target)||t.animated&&t.animatingX&&t.animatingY||x._ignoreWhileAnimating===t)return A(!1);if(Qe=!1,d&&!s.disabled&&(f?c||(r=_!==S):B===this||(this.lastPutMode=qe.checkPull(this,d,u,e))&&l.checkPut(this,d,u,e))){if(b=this._getDirection(e,t)==="vertical",i=C(u),R("dragOverValid"),m.eventCanceled)return E;if(r)return _=S,J(),this._hideClone(),R("revert"),m.eventCanceled||(fe?S.insertBefore(u,fe):S.appendChild(u)),A(!0);var M=kt(o,s.draggable);if(!M||to(e,b,this)&&!M.animated){if(M===u)return A(!1);if(M&&o===e.target&&(t=M),t&&(a=C(t)),Xe(S,o,u,i,t,a,e,!!t)!==!1)return J(),M&&M.nextSibling?o.insertBefore(u,M.nextSibling):o.appendChild(u),_=o,q(),A(!0)}else if(M&&eo(e,b,this)){var se=be(o,0,s,!0);if(se===u)return A(!1);if(t=se,a=C(t),Xe(S,o,u,i,t,a,e,!1)!==!1)return J(),o.insertBefore(u,se),_=o,q(),A(!0)}else if(t.parentNode===o){a=C(t);var V=0,le,we=u.parentNode!==o,H=!Un(u.animated&&u.toRect||i,t.animated&&t.toRect||a,b),xe=b?"top":"left",ne=Lt(t,"top","top")||Lt(u,"top","top"),Ee=ne?ne.scrollTop:void 0;ge!==t&&(le=a[xe],Le=!1,Ge=!H&&s.invertSwap||we),V=no(e,t,a,b,H?1:s.swapThreshold,s.invertedSwapThreshold==null?s.swapThreshold:s.invertedSwapThreshold,Ge,ge===t);var K;if(V!==0){var de=F(u);do de-=V,K=_.children[de];while(K&&(g(K,"display")==="none"||K===v))}if(V===0||K===t)return A(!1);ge=t,Oe=V;var Se=t.nextElementSibling,oe=!1;oe=V===1;var ze=Xe(S,o,u,i,t,a,e,oe);if(ze!==!1)return(ze===1||ze===-1)&&(oe=ze===1),wt=!0,setTimeout(Qn,30),J(),oe&&!Se?o.appendChild(u):t.parentNode.insertBefore(u,oe?Se:t),ne&&en(ne,0,Ee-ne.scrollTop),_=u.parentNode,le!==void 0&&!Ge&&(Ue=Math.abs(le-C(t)[xe])),q(),A(!0)}if(o.contains(u))return A(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){y(document,"mousemove",this._onTouchMove),y(document,"touchmove",this._onTouchMove),y(document,"pointermove",this._onTouchMove),y(document,"dragover",ue),y(document,"mousemove",ue),y(document,"touchmove",ue)},_offUpEvents:function(){var e=this.el.ownerDocument;y(e,"mouseup",this._onDrop),y(e,"touchend",this._onDrop),y(e,"pointerup",this._onDrop),y(e,"pointercancel",this._onDrop),y(e,"touchcancel",this._onDrop),y(document,"selectstart",this)},_onDrop:function(e){var o=this.el,t=this.options;if($=F(u),ie=F(u,t.draggable),O("drop",this,{evt:e}),_=u&&u.parentNode,$=F(u),ie=F(u,t.draggable),m.eventCanceled){this._nulling();return}me=!1,Ge=!1,Le=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),xt(this.cloneId),xt(this._dragStartId),this.nativeDraggable&&(y(document,"drop",this),y(o,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),Ne&&g(document.body,"user-select",""),g(u,"transform",""),e&&(ke&&(e.cancelable&&e.preventDefault(),!t.dropBubble&&e.stopPropagation()),v&&v.parentNode&&v.parentNode.removeChild(v),(S===_||B&&B.lastPutMode!=="clone")&&I&&I.parentNode&&I.parentNode.removeChild(I),u&&(this.nativeDraggable&&y(u,"dragend",this),ut(u),u.style["will-change"]="",ke&&!me&&j(u,B?B.options.ghostClass:this.options.ghostClass,!1),j(u,this.options.chosenClass,!1),P({sortable:this,name:"unchoose",toEl:_,newIndex:null,newDraggableIndex:null,originalEvent:e}),S!==_?($>=0&&(P({rootEl:_,name:"add",toEl:_,fromEl:S,originalEvent:e}),P({sortable:this,name:"remove",toEl:_,originalEvent:e}),P({rootEl:_,name:"sort",toEl:_,fromEl:S,originalEvent:e}),P({sortable:this,name:"sort",toEl:_,originalEvent:e})),B&&B.save()):$!==he&&$>=0&&(P({sortable:this,name:"update",toEl:_,originalEvent:e}),P({sortable:this,name:"sort",toEl:_,originalEvent:e})),m.active&&(($==null||$===-1)&&($=he,ie=Pe),P({sortable:this,name:"end",toEl:_,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){O("nulling",this),S=u=_=v=fe=I=We=ae=ce=G=ke=$=ie=he=Pe=ge=Oe=B=qe=m.dragged=m.ghost=m.clone=m.active=null,tt.forEach(function(e){e.checked=!0}),tt.length=lt=dt=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":u&&(this._onDragOver(e),Zn(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],o,t=this.el.children,i=0,a=t.length,r=this.options;i<a;i++)o=t[i],Y(o,r.draggable,this.el,!1)&&e.push(o.getAttribute(r.dataIdAttr)||io(o));return e},sort:function(e,o){var t={},i=this.el;this.toArray().forEach(function(a,r){var s=i.children[r];Y(s,this.options.draggable,i,!1)&&(t[a]=s)},this),o&&this.captureAnimationState(),e.forEach(function(a){t[a]&&(i.removeChild(t[a]),i.appendChild(t[a]))}),o&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,o){return Y(e,o||this.options.draggable,this.el,!1)},option:function(e,o){var t=this.options;if(o===void 0)return t[e];var i=Fe.modifyOption(this,e,o);typeof i<"u"?t[e]=i:t[e]=o,e==="group"&&rn(t)},destroy:function(){O("destroy",this);var e=this.el;e[L]=null,y(e,"mousedown",this._onTapStart),y(e,"touchstart",this._onTapStart),y(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(y(e,"dragover",this),y(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(o){o.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),et.splice(et.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!ae){if(O("hideClone",this),m.eventCanceled)return;g(I,"display","none"),this.options.removeCloneOnHide&&I.parentNode&&I.parentNode.removeChild(I),ae=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(ae){if(O("showClone",this),m.eventCanceled)return;u.parentNode==S&&!this.options.group.revertClone?S.insertBefore(I,u):fe?S.insertBefore(I,fe):S.appendChild(I),this.options.group.revertClone&&this.animate(u,I),g(I,"display",""),ae=!1}}};function Zn(n){n.dataTransfer&&(n.dataTransfer.dropEffect="move"),n.cancelable&&n.preventDefault()}function Xe(n,e,o,t,i,a,r,s){var l,d=n[L],f=d.options.onMove,c;return window.CustomEvent&&!te&&!$e?l=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(l=document.createEvent("Event"),l.initEvent("move",!0,!0)),l.to=e,l.from=n,l.dragged=o,l.draggedRect=t,l.related=i||e,l.relatedRect=a||C(e),l.willInsertAfter=s,l.originalEvent=r,n.dispatchEvent(l),f&&(c=f.call(d,l,r)),c}function ut(n){n.draggable=!1}function Qn(){wt=!1}function eo(n,e,o){var t=C(be(o.el,0,o.options,!0)),i=nn(o.el,o.options,v),a=10;return e?n.clientX<i.left-a||n.clientY<t.top&&n.clientX<t.right:n.clientY<i.top-a||n.clientY<t.bottom&&n.clientX<t.left}function to(n,e,o){var t=C(kt(o.el,o.options.draggable)),i=nn(o.el,o.options,v),a=10;return e?n.clientX>i.right+a||n.clientY>t.bottom&&n.clientX>t.left:n.clientY>i.bottom+a||n.clientX>t.right&&n.clientY>t.top}function no(n,e,o,t,i,a,r,s){var l=t?n.clientY:n.clientX,d=t?o.height:o.width,f=t?o.top:o.left,c=t?o.bottom:o.right,h=!1;if(!r){if(s&&Ue<d*i){if(!Le&&(Oe===1?l>f+d*a/2:l<c-d*a/2)&&(Le=!0),Le)h=!0;else if(Oe===1?l<f+Ue:l>c-Ue)return-Oe}else if(l>f+d*(1-i)/2&&l<c-d*(1-i)/2)return oo(e)}return h=h||r,h&&(l<f+d*a/2||l>c-d*a/2)?l>f+d/2?1:-1:0}function oo(n){return F(u)<F(n)?1:-1}function io(n){for(var e=n.tagName+n.className+n.src+n.href+n.textContent,o=e.length,t=0;o--;)t+=e.charCodeAt(o);return t.toString(36)}function ao(n){tt.length=0;for(var e=n.getElementsByTagName("input"),o=e.length;o--;){var t=e[o];t.checked&&tt.push(t)}}function Je(n){return setTimeout(n,0)}function xt(n){return clearTimeout(n)}it&&w(document,"touchmove",function(n){(m.active||me)&&n.cancelable&&n.preventDefault()});m.utils={on:w,off:y,css:g,find:Zt,is:function(e,o){return!!Y(e,o,e,!1)},extend:zn,throttle:Qt,closest:Y,toggleClass:j,clone:tn,index:F,nextTick:Je,cancelNextTick:xt,detectDirection:an,getChild:be,expando:L};m.get=function(n){return n[L]};m.mount=function(){for(var n=arguments.length,e=new Array(n),o=0;o<n;o++)e[o]=arguments[o];e[0].constructor===Array&&(e=e[0]),e.forEach(function(t){if(!t.prototype||!t.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(t));t.utils&&(m.utils=U(U({},m.utils),t.utils)),Fe.mount(t)})};m.create=function(n,e){return new m(n,e)};m.version=$n;var T=[],Te,Et,St=!1,ft,pt,nt,Ce;function ro(){function n(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var e in this)e.charAt(0)==="_"&&typeof this[e]=="function"&&(this[e]=this[e].bind(this))}return n.prototype={dragStarted:function(o){var t=o.originalEvent;this.sortable.nativeDraggable?w(document,"dragover",this._handleAutoScroll):this.options.supportPointer?w(document,"pointermove",this._handleFallbackAutoScroll):t.touches?w(document,"touchmove",this._handleFallbackAutoScroll):w(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(o){var t=o.originalEvent;!this.options.dragOverBubble&&!t.rootEl&&this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?y(document,"dragover",this._handleAutoScroll):(y(document,"pointermove",this._handleFallbackAutoScroll),y(document,"touchmove",this._handleFallbackAutoScroll),y(document,"mousemove",this._handleFallbackAutoScroll)),Ft(),Ke(),Rn()},nulling:function(){nt=Et=Te=St=Ce=ft=pt=null,T.length=0},_handleFallbackAutoScroll:function(o){this._handleAutoScroll(o,!0)},_handleAutoScroll:function(o,t){var i=this,a=(o.touches?o.touches[0]:o).clientX,r=(o.touches?o.touches[0]:o).clientY,s=document.elementFromPoint(a,r);if(nt=o,t||this.options.forceAutoScrollFallback||$e||te||Ne){gt(o,this.options,s,t);var l=re(s,!0);St&&(!Ce||a!==ft||r!==pt)&&(Ce&&Ft(),Ce=setInterval(function(){var d=re(document.elementFromPoint(a,r),!0);d!==l&&(l=d,Ke()),gt(o,i.options,d,t)},10),ft=a,pt=r)}else{if(!this.options.bubbleScroll||re(s,!0)===W()){Ke();return}gt(o,this.options,re(s,!1),!1)}}},Q(n,{pluginName:"scroll",initializeByDefault:!0})}function Ke(){T.forEach(function(n){clearInterval(n.pid)}),T=[]}function Ft(){clearInterval(Ce)}var gt=Qt(function(n,e,o,t){if(e.scroll){var i=(n.touches?n.touches[0]:n).clientX,a=(n.touches?n.touches[0]:n).clientY,r=e.scrollSensitivity,s=e.scrollSpeed,l=W(),d=!1,f;Et!==o&&(Et=o,Ke(),Te=e.scroll,f=e.scrollFn,Te===!0&&(Te=re(o,!0)));var c=0,h=Te;do{var b=h,x=C(b),E=x.top,R=x.bottom,J=x.left,A=x.right,q=x.width,M=x.height,se=void 0,V=void 0,le=b.scrollWidth,we=b.scrollHeight,H=g(b),xe=b.scrollLeft,ne=b.scrollTop;b===l?(se=q<le&&(H.overflowX==="auto"||H.overflowX==="scroll"||H.overflowX==="visible"),V=M<we&&(H.overflowY==="auto"||H.overflowY==="scroll"||H.overflowY==="visible")):(se=q<le&&(H.overflowX==="auto"||H.overflowX==="scroll"),V=M<we&&(H.overflowY==="auto"||H.overflowY==="scroll"));var Ee=se&&(Math.abs(A-i)<=r&&xe+q<le)-(Math.abs(J-i)<=r&&!!xe),K=V&&(Math.abs(R-a)<=r&&ne+M<we)-(Math.abs(E-a)<=r&&!!ne);if(!T[c])for(var de=0;de<=c;de++)T[de]||(T[de]={});(T[c].vx!=Ee||T[c].vy!=K||T[c].el!==b)&&(T[c].el=b,T[c].vx=Ee,T[c].vy=K,clearInterval(T[c].pid),(Ee!=0||K!=0)&&(d=!0,T[c].pid=setInterval((function(){t&&this.layer===0&&m.active._onTouchMove(nt);var Se=T[this.layer].vy?T[this.layer].vy*s:0,oe=T[this.layer].vx?T[this.layer].vx*s:0;typeof f=="function"&&f.call(m.dragged.parentNode[L],oe,Se,n,nt,T[this.layer].el)!=="continue"||en(T[this.layer].el,oe,Se)}).bind({layer:c}),24))),c++}while(e.bubbleScroll&&h!==l&&(h=re(h,!1)));St=d}},30),dn=function(e){var o=e.originalEvent,t=e.putSortable,i=e.dragEl,a=e.activeSortable,r=e.dispatchSortableEvent,s=e.hideGhostForTarget,l=e.unhideGhostForTarget;if(o){var d=t||a;s();var f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:o,c=document.elementFromPoint(f.clientX,f.clientY);l(),d&&!d.el.contains(c)&&(r("spill"),this.onSpill({dragEl:i,putSortable:t}))}};function Tt(){}Tt.prototype={startIndex:null,dragStart:function(e){var o=e.oldDraggableIndex;this.startIndex=o},onSpill:function(e){var o=e.dragEl,t=e.putSortable;this.sortable.captureAnimationState(),t&&t.captureAnimationState();var i=be(this.sortable.el,this.startIndex,this.options);i?this.sortable.el.insertBefore(o,i):this.sortable.el.appendChild(o),this.sortable.animateAll(),t&&t.animateAll()},drop:dn};Q(Tt,{pluginName:"revertOnSpill"});function Ct(){}Ct.prototype={onSpill:function(e){var o=e.dragEl,t=e.putSortable,i=t||this.sortable;i.captureAnimationState(),o.parentNode&&o.parentNode.removeChild(o),i.animateAll()},drop:dn};Q(Ct,{pluginName:"removeOnSpill"});m.mount(new ro);m.mount(Ct,Tt);function Dt(n){const e=document.getElementById("notes-grid");if(!e)return;e.innerHTML="";const o=p.currentView==="all"?p.notes.filter(r=>{const s=p.categories.find(l=>l.id===r.categoryId);return!s||!s.passwordHash}):p.notes.filter(r=>r.categoryId===p.currentView),t=o.filter(r=>r.pinned),i=o.filter(r=>!r.pinned),a=r=>{const s=document.createElement("div");s.className="note-card note-animate-in relative group",s.dataset.id=r.id;const l=Me.find(h=>h.id===r.themeId)||Me[0],d=p.settings.theme==="dark"?l.dark:l.light;r.themeId!=="default"&&(s.style.backgroundColor=d,s.style.borderColor=p.settings.theme==="dark"?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)");const f=p.categories.find(h=>h.id===r.categoryId),c=p.unlockedNotes.has(r.id);return s.innerHTML=`
            <div class="note-card-content">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="font-bold text-sm line-clamp-2 leading-tight">${r.title}</h3>
                    <div class="flex gap-1.5 opacity-60">
                        ${r.pinned?'<i data-lucide="pin" class="w-3.5 h-3.5 fill-current"></i>':""}
                        ${r.passwordHash?`<i data-lucide="${c?"unlock":"lock"}" class="w-3.5 h-3.5 lock-indicator cursor-pointer" data-id="${r.id}"></i>`:""}
                    </div>
                </div>
                <div class="text-[13px] opacity-70 line-clamp-5 mb-6 leading-relaxed flex-1">
                    ${r.passwordHash&&!c?'<div class="flex items-center gap-2 py-4 italic opacity-50"><i data-lucide="shield-alert" class="w-4 h-4"></i> Contenido protegido</div>':r.content}
                </div>
                <div class="flex items-center justify-between mt-auto pt-3 border-t">
                    <div class="flex items-center gap-2">
                         ${f?`<span class="text-[10px] px-2 py-0.5 rounded bg-muted font-medium text-muted-foreground">${f.name}</span>`:""}
                         <span class="text-[10px] text-muted-foreground font-mono">${new Date(r.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <button class="delete-note-btn p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors opacity-0 group-hover:opacity-100" data-id="${r.id}" title="Eliminar">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>
        `,s.onclick=h=>{h.target.closest(".delete-note-btn")||n(r)},s};if(t.length>0){const r=document.createElement("h3");if(r.className="text-xs font-bold text-muted-foreground uppercase tracking-wider col-span-full mb-2 mt-2 flex items-center gap-2",r.innerHTML='<i data-lucide="pin" class="w-3 h-3"></i> Destacadas',e.appendChild(r),t.forEach(s=>e.appendChild(a(s))),i.length>0){const s=document.createElement("div");s.className="col-span-full h-px bg-border my-4",e.appendChild(s)}}if(i.length>0){if(t.length>0){const r=document.createElement("h3");r.className="text-xs font-bold text-muted-foreground uppercase tracking-wider col-span-full mb-2 mt-2",r.innerText="Notas",e.appendChild(r)}i.forEach(r=>e.appendChild(a(r)))}o.length===0&&(e.innerHTML=`<div class="col-span-full text-center py-20 text-muted-foreground opacity-50">
            <i data-lucide="ghost" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
            <p>No hay notas aquí</p>
        </div>`),ee(),e.querySelectorAll(".delete-note-btn").forEach(r=>{r.onclick=async s=>{s.stopPropagation(),confirm("¿Eliminar esta nota?")&&(p.notes=p.notes.filter(l=>l.id!==r.dataset.id),await X(),Dt(n))}}),so()}function so(n){const e=document.getElementById("notes-grid");e&&(e.sortable&&e.sortable.destroy(),e.sortable=m.create(e,{animation:250,ghostClass:"opacity-50",onEnd:async()=>{const o=[];e.querySelectorAll(".note-card").forEach(a=>{const r=p.notes.find(s=>s.id===a.dataset.id);r&&o.push(r)});const t=new Set(o.map(a=>a.id)),i=p.notes.filter(a=>!t.has(a.id));p.notes=[...o,...i],await X()}}))}async function zt(){console.log("Iniciando aplicación modular..."),lo(),gn(),un(),_n(ye),On(),co(),await wn(ye),uo(),fo(),go(),ee(),console.log("Aplicación lista.")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",zt):zt();function lo(){const n=document.getElementById("root");if(!n)return console.error("No se encontró el elemento #root");n.innerHTML=`
        ${yn()}
        ${Sn()}
        ${In()}
        ${Dn()}
        ${Pn()}
        ${Ln()}
    `,console.log("Estructura inyectada.")}function ye(){Dt(De),yt(ot,p.categories),cn(),ee()}function ot(n,e){p.currentView=n,cn(e),Dt(De)}function cn(n=null){const e=document.getElementById("view-title"),o=document.getElementById("view-desc");if(!e||!o)return;const t=p.categories.find(a=>a.id===p.currentView),i=n||(t?t.name:"Todas las notas");e.innerText=i,o.innerText=p.currentView==="all"?"Organiza tus pensamientos y protege tu privacidad.":`Mostrando notas en "${i}".`}function un(){const n=p.settings.theme==="dark";document.documentElement.classList.toggle("dark",n),document.documentElement.classList.toggle("light",!n)}function k(n,e){const o=document.getElementById(n);o&&(o.onclick=e)}function co(){k("add-note-btn",()=>{console.log("Abriendo editor (Desktop)"),De()}),k("mobile-add-btn",()=>{console.log("Abriendo editor (Mobile)"),De()}),k("sync-btn",Rt),k("mobile-sync-btn",Rt),k("settings-trigger",mo),k("logout-btn",mt),k("mobile-logout-btn",mt);const n=async()=>{p.settings.drivePath=document.getElementById("config-drive-path").value,p.settings.algo=document.getElementById("config-algo").value,await X(),D("✅ Configuración guardada")};k("save-sync-config",n),k("save-security-config",n),k("theme-light",()=>Gt("light")),k("theme-dark",()=>Gt("dark")),document.querySelectorAll(".nav-link[data-view], .nav-link-mobile[data-view], .nav-link-mobile-drawer[data-view]").forEach(o=>{o.onclick=()=>{const t=o.dataset.view;ot(t,t==="all"?"Todas las notas":""),It()}}),k("sidebar-manage-cats",qt),k("mobile-manage-cats",()=>{It(),qt()}),k("add-cat-btn",po);const e=o=>{const t=o.target.closest("#settings-modal, #categories-modal, #editor-modal");t&&t.classList.add("hidden")};document.querySelectorAll(".close-modal, .close-settings, .close-categories").forEach(o=>{o.onclick=e}),document.body.addEventListener("click",o=>{const t=o.target.closest(".toggle-pass");if(!t)return;const i=document.getElementById(t.dataset.target);if(!i)return;const a=i.type==="password";i.type=a?"text":"password";const r=t.querySelector("[data-lucide]");r&&(r.setAttribute("data-lucide",a?"eye-off":"eye"),ee())}),k("auth-submit",()=>En(ye)),k("factory-reset",()=>{confirm("⚠️ ¿BORRAR TODO? Esto eliminará todas las notas guardadas en este navegador localmente.")&&(localStorage.clear(),sessionStorage.clear(),location.reload())}),window.handleLogout=mt,window.openEditor=De}function uo(){const n=t=>{const i=t.target.value.toLowerCase();document.querySelectorAll(".note-card").forEach(r=>{const s=p.notes.find(d=>d.id===r.dataset.id);if(!s)return;const l=s.title.toLowerCase().includes(i)||s.content.toLowerCase().includes(i);r.classList.toggle("hidden",!l)})},e=document.getElementById("search-input"),o=document.getElementById("mobile-search-input-top");e&&(e.oninput=n),o&&(o.oninput=n)}function fo(){const n=document.getElementById("mobile-sidebar-overlay");k("mobile-sidebar-trigger",()=>{n==null||n.classList.remove("hidden"),yt(ot,p.categories)}),k("close-mobile-sidebar",It),k("mobile-menu-trigger",()=>{n==null||n.classList.remove("hidden"),yt(ot,p.categories)});const e=document.getElementById("mobile-search-bar"),o=document.getElementById("mobile-search-input-top");k("mobile-search-btn",()=>{e==null||e.classList.remove("hidden"),o==null||o.focus()}),k("close-mobile-search",()=>{e&&e.classList.add("hidden"),o&&(o.value="",o.dispatchEvent(new Event("input")))}),k("mobile-search-trigger",()=>{e==null||e.classList.remove("hidden"),o==null||o.focus()})}async function Rt(){const n=sessionStorage.getItem("cn_pass_plain_v3")||localStorage.getItem("cn_pass_plain_v3");if(!n)return D("Error de sesión");D("Sincronizando con la nube...");try{const e=new bn("notev3_",p.settings.drivePath),o=await e.getOrCreateFolder(p.settings.drivePath),t=await z.encrypt({notes:p.notes,categories:p.categories},n);await e.saveChunks(t,o),D("✅ Sincronización completada")}catch{D("❌ Error en la sincronización")}}function qt(){const n=document.getElementById("categories-modal");n&&(n.classList.remove("hidden"),je(ye,p.categories))}function It(){const n=document.getElementById("mobile-sidebar-overlay");n&&n.classList.add("hidden")}async function po(){const n=document.getElementById("new-cat-name"),e=n==null?void 0:n.value.trim();e&&(p.categories.push({id:"cat_"+Date.now(),name:e,color:"#aecbfa",passwordHash:null}),await X(),n&&(n.value=""),je(ye,p.categories),ye())}function mt(){localStorage.removeItem("cn_pass_plain_v3"),sessionStorage.removeItem("cn_pass_plain_v3"),location.reload()}function go(){const n=document.getElementById("app-version");n&&(n.innerText=mn)}function mo(){const n=document.getElementById("settings-modal");if(n){n.classList.remove("hidden"),document.getElementById("config-drive-path").value=p.settings.drivePath,document.getElementById("config-algo").value=p.settings.algo;const e=n.querySelector('.settings-tab[data-tab="appearance"]');e&&e.click()}}function Gt(n){p.settings.theme=n,un(),X()}
