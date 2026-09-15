/* Shared Supabase client. The legacy page still receives the same `db` global. */
(function initializeSupabaseClient() {
  if (!window.supabase || !window.INK_CONFIG) {
    throw new Error('Supabase dependencies must load before src/supabase-client.js');
  }

  const { supabaseUrl, supabaseKey } = window.INK_CONFIG;

  window.INK_DB = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionFromUrl: false,
    },
  });
})();
