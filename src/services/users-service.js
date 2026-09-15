(function attachUsersService() {
  const users = () => window.INK_DB.from('usuarios');

  window.INK_SERVICES = window.INK_SERVICES || {};
  window.INK_SERVICES.users = {
    list() {
      return users().select('*').order('nombre');
    },
    save(data) {
      return users().upsert([data]);
    },
    remove(id) {
      return users().delete().eq('id', id);
    },
    hasAny() {
      return users().select('id').limit(1);
    },
    createDefault(data) {
      return users().insert([data]);
    },
    getAdminPin(id) {
      return users().select('admin_pin').eq('id', id).single();
    },
    updateAdminPin(id, pin) {
      return users().update({ admin_pin: pin }).eq('id', id);
    },
  };
})();
