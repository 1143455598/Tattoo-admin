(function attachFinanceService() {
  const transactions = () => window.INK_DB.from('transacciones');

  window.INK_SERVICES = window.INK_SERVICES || {};
  window.INK_SERVICES.finance = {
    list() {
      return transactions().select('*').order('fecha', { ascending: true });
    },
    listRecent() {
      return transactions().select('*').order('fecha', { ascending: false });
    },
    listIncomeForDate(date) {
      return transactions().select('monto').eq('tipo', 'ingreso').eq('fecha', date);
    },
    listIncome() {
      return transactions().select('monto,fecha').eq('tipo', 'ingreso');
    },
    listIncomeByClient(name) {
      return transactions().select('monto').eq('tipo', 'ingreso').ilike('cliente_nombre', name + '%');
    },
    listIncomeByArtist(name) {
      return transactions().select('monto').eq('tipo', 'ingreso').eq('artista_nombre', name);
    },
    create(data) {
      return transactions().insert([data]);
    },
    remove(id) {
      return transactions().delete().eq('id', id);
    },
    removeAll() {
      return transactions().delete().neq('id', '00000000-0000-0000-0000-000000000000');
    },
    latestByType(type) {
      return transactions().select('*').eq('tipo', type).order('created_at', { ascending: false }).limit(1);
    },
  };
})();
