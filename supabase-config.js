// =====================================================
// SUPABASE CONFIGURATION
// Replace these two values with your project credentials
// Found at: supabase.com → Your Project → Settings → API
// =====================================================

const SUPABASE_URL  = 'https://aatenoshvddlispsiaul.supabase.co';
const SUPABASE_ANON = 'sb_publishable_Ee-7qkzMUus7Z9IEclpnsw_8oeMW3zn';

// =====================================================
// PAYMENT CONFIGURATION
// Once you have a Paddle/Stripe checkout link, replace
// 'signup.html' below with your real payment URL.
// =====================================================

const STRIPE_MONTHLY_LINK = 'auth.html#signup';
const STRIPE_YEARLY_LINK  = 'auth.html#signup';

// =====================================================
// PLAN LIMITS  (edit these if you want different limits)
// =====================================================

const LIMITS = {
  free: {
    maxChars:     5000,   // max characters in text tool inputs
    maxBulkItems: 10,     // max items in list generators
    maxStringLen: 50,     // max random string length
    downloads:    false,  // can download results as file
    history:      false,  // can view tool history
    darkMode:     false,  // can use dark mode
    ads:          true,   // sees ads
  },
  pro: {
    maxChars:     Infinity,
    maxBulkItems: Infinity,
    maxStringLen: Infinity,
    downloads:    true,
    history:      true,
    darkMode:     true,
    ads:          false,
  }
};
