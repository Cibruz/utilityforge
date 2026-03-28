// =====================================================
// AUTH.JS — Supabase authentication & session management
// Loaded on every page after supabase-config.js
// =====================================================

let _supabase = null;
let _currentUser = null;
let _currentPlan = 'free';

// Initialise Supabase client once the CDN library is ready
function getSupabase() {
    if (_supabase) return _supabase;
    if (typeof supabase === 'undefined' || !supabase.createClient) return null;
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return _supabase;
}

// ── Session ──────────────────────────────────────────

async function getSession() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session;
}

async function getCurrentUser() {
    if (_currentUser) return _currentUser;
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getUser();
    _currentUser = data.user || null;
    return _currentUser;
}

// ── Plan ─────────────────────────────────────────────

async function getUserPlan() {
    const user = await getCurrentUser();
    if (!user) return 'free';

    // Check localStorage cache first (refreshed on login)
    const cached = localStorage.getItem('uf_plan');
    if (cached) return cached;

    const sb = getSupabase();
    if (!sb) return 'free';

    const { data } = await sb
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

    const plan = (data && data.plan) || 'free';
    localStorage.setItem('uf_plan', plan);
    _currentPlan = plan;
    return plan;
}

function getCachedPlan() {
    return localStorage.getItem('uf_plan') || 'free';
}

function isPro() {
    return getCachedPlan() === 'pro';
}

// ── Sign Up ───────────────────────────────────────────

async function authSignUp(email, password, name) {
    const sb = getSupabase();
    if (!sb) return { error: { message: 'Supabase not configured yet.' } };

    const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
    });

    if (!error && data.user) {
        // Create profile row (plan defaults to 'free' in DB)
        await sb.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            plan: 'free',
            created_at: new Date().toISOString()
        });
        localStorage.setItem('uf_plan', 'free');
    }

    return { data, error };
}

// ── Sign In ───────────────────────────────────────────

async function authSignIn(email, password) {
    const sb = getSupabase();
    if (!sb) return { error: { message: 'Supabase not configured yet.' } };

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
        _currentUser = data.user;
        // Fetch and cache plan
        const { data: profile } = await sb
            .from('profiles')
            .select('plan')
            .eq('id', data.user.id)
            .single();
        localStorage.setItem('uf_plan', profile?.plan || 'free');
    }

    return { data, error };
}

// ── Google OAuth ──────────────────────────────────────

async function authSignInWithGoogle() {
    const sb = getSupabase();
    if (!sb) return { error: { message: 'Supabase not configured yet.' } };

    const { data, error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/index.html' }
    });

    return { data, error };
}

// ── Sign Out ──────────────────────────────────────────

async function authSignOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    _currentUser = null;
    localStorage.removeItem('uf_plan');
    window.location.href = 'index.html';
}

// ── Upgrade to Pro (Stripe redirect) ─────────────────

function goToPro(yearly = false) {
    const link = yearly ? STRIPE_YEARLY_LINK : STRIPE_MONTHLY_LINK;
    window.location.href = link;
}

// ── Update header based on auth state ────────────────

async function updateHeaderAuthState() {
    const user = await getCurrentUser();
    const nav = document.querySelector('.header-nav');
    if (!nav) return;

    if (user) {
        const plan = getCachedPlan();
        const initials = (user.email || 'U')[0].toUpperCase();
        nav.innerHTML = `
            <a href="account.html#pricing" class="hide-mobile">${plan === 'pro' ? '⭐ Pro' : 'Upgrade'}</a>
            <div class="user-menu" onclick="toggleUserMenu()">
                <div class="user-avatar">${initials}</div>
                <span class="hide-mobile" style="font-size:13px;color:rgba(255,255,255,0.85);">${user.email}</span>
            </div>
            <div class="user-dropdown" id="userDropdown">
                <div class="dropdown-email">${user.email}</div>
                <div class="dropdown-plan">${plan === 'pro' ? '⭐ Pro Plan' : '🆓 Free Plan'}</div>
                ${plan !== 'pro' ? '<a href="account.html#pricing" class="dropdown-link upgrade-link">Upgrade to Pro →</a>' : ''}
                <a href="account.html#history" class="dropdown-link">Tool History</a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-signout" onclick="authSignOut()">Sign Out</button>
            </div>
        `;
        // Apply pro perks
        if (plan === 'pro') {
            document.body.classList.add('is-pro');
        }
    } else {
        nav.innerHTML = `
            <a href="index.html" class="hide-mobile">Home</a>
            <a href="account.html#pricing" class="hide-mobile">Pricing</a>
            <a href="auth.html#login" class="nav-btn-signin">Sign In</a>
            <a href="auth.html#signup" class="nav-btn-signup">Sign Up</a>
        `;
    }
}

function toggleUserMenu() {
    const d = document.getElementById('userDropdown');
    if (d) d.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        const d = document.getElementById('userDropdown');
        if (d) d.classList.remove('open');
    }
});

// ── Limit checker ─────────────────────────────────────

function checkLimit(type, value) {
    if (isPro()) return true;
    const limit = LIMITS.free[type];
    if (limit === false || value > limit) {
        showUpgradeModal(type);
        return false;
    }
    return true;
}

// ── Upgrade modal ─────────────────────────────────────

function showUpgradeModal(reason) {
    let msg = 'You have reached the free plan limit.';
    if (reason === 'maxBulkItems') msg = 'Free plan is limited to 10 items at once.';
    if (reason === 'maxChars')     msg = 'Free plan supports up to 5,000 characters.';
    if (reason === 'maxStringLen') msg = 'Free plan supports strings up to 50 characters long.';
    if (reason === 'downloads')    msg = 'Downloading results is a Pro feature.';
    if (reason === 'history')      msg = 'Tool history is a Pro feature.';
    if (reason === 'darkMode')     msg = 'Dark mode is a Pro feature.';

    document.getElementById('upgradeModalMsg').textContent = msg;
    document.getElementById('upgradeOverlay').classList.add('show');
}

function closeUpgradeModal() {
    document.getElementById('upgradeOverlay').classList.remove('show');
}

// ── Inject upgrade modal into page ───────────────────

function injectUpgradeModal() {
    if (document.getElementById('upgradeOverlay')) return;
    const modal = document.createElement('div');
    modal.className = 'upgrade-overlay';
    modal.id = 'upgradeOverlay';
    modal.innerHTML = `
        <div class="upgrade-modal">
            <div class="modal-icon">⭐</div>
            <h2>Upgrade to Pro</h2>
            <p id="upgradeModalMsg">Upgrade to Pro for unlimited access.</p>
            <div class="modal-actions">
                <a href="account.html#pricing" class="btn-upgrade">See Pro Plans</a>
                <button class="btn-cancel" onclick="closeUpgradeModal()">Maybe Later</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeUpgradeModal();
    });
}

// ── Download result as .txt ───────────────────────────

function downloadResult(content, filename) {
    if (!isPro()) {
        showUpgradeModal('downloads');
        return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || 'utilityforge-result.txt';
    a.click();
    URL.revokeObjectURL(a.href);
}

// ── Save to history (Pro) ─────────────────────────────

function saveToHistory(toolName, input, output) {
    if (!isPro()) return;
    const history = JSON.parse(localStorage.getItem('uf_history') || '[]');
    history.unshift({
        tool: toolName,
        input: String(input).substring(0, 200),
        output: String(output).substring(0, 500),
        date: new Date().toISOString()
    });
    // Keep last 50 entries
    localStorage.setItem('uf_history', JSON.stringify(history.slice(0, 50)));
}

// ── Dark mode (Pro) ───────────────────────────────────

function toggleDarkMode() {
    if (!isPro()) {
        showUpgradeModal('darkMode');
        return;
    }
    const on = document.body.classList.toggle('dark-mode');
    localStorage.setItem('uf_dark', on ? '1' : '0');
}

function initDarkMode() {
    if (isPro() && localStorage.getItem('uf_dark') === '1') {
        document.body.classList.add('dark-mode');
    }
}
