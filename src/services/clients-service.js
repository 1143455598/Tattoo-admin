(function attachClientsService() {
  const clientTable = () => window.INK_DB.from('clientes');

  window.INK_SERVICES = window.INK_SERVICES || {};
  window.INK_SERVICES.clients = {
    list() {
      return clientTable().select('*').order('nombre');
    },
    remove(id) {
      return clientTable().delete().eq('id', id);
    },
    update(id, data) {
      return clientTable().update(data).eq('id', id);
    },
    create(data) {
      return clientTable().insert([data]);
    },
  };
})();
