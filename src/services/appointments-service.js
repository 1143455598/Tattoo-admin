(function attachAppointmentsService() {
  const appointmentTable = () => window.INK_DB.from('citas');

  window.INK_SERVICES = window.INK_SERVICES || {};
  window.INK_SERVICES.appointments = {
    listByDate(date) {
      return appointmentTable().select('*').eq('fecha', date).order('hora');
    },
    listDates() {
      return appointmentTable().select('fecha');
    },
    listByArtistAndDate(artist, date) {
      return appointmentTable().select('id,hora,duracion,artista_nombre')
        .eq('fecha', date)
        .eq('artista_nombre', artist)
        .neq('estado', 'Cancelada');
    },
    listByClientName(name) {
      return appointmentTable().select('*').ilike('cliente_nombre', `${name}%`).order('fecha', { ascending: false });
    },
    listByArtistName(name) {
      return appointmentTable().select('*').eq('artista_nombre', name).order('fecha', { ascending: false });
    },
    get(id) {
      return appointmentTable().select('*').eq('id', id).single();
    },
    listAll() {
      return appointmentTable().select('*').order('fecha', { ascending: false });
    },
    listUpcoming(date) {
      return appointmentTable().select('*').eq('fecha', date).neq('estado', 'Cancelada');
    },
    create(data) {
      return appointmentTable().insert([data]);
    },
    update(id, data) {
      return appointmentTable().update(data).eq('id', id);
    },
    updateStatus(id, estado) {
      return appointmentTable().update({ estado }).eq('id', id);
    },
    remove(id) {
      return appointmentTable().delete().eq('id', id);
    },
    removeAll() {
      return appointmentTable().delete().neq('id', '00000000-0000-0000-0000-000000000000');
    },
  };
})();
