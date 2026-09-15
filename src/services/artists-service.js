(function attachArtistsService() {
  const artistTable = () => window.INK_DB.from('artistas');

  window.INK_SERVICES = window.INK_SERVICES || {};
  window.INK_SERVICES.artists = {
    listActive() {
      return artistTable().select('*').eq('activo', true).order('nombre');
    },
    update(id, data) {
      return artistTable().update(data).eq('id', id);
    },
    create(data) {
      return artistTable().insert([data]);
    },
    deactivate(id) {
      return artistTable().update({ activo: false }).eq('id', id);
    },
  };
})();

window.INK_SERVICES.artists.list = window.INK_SERVICES.artists.listActive;
window.INK_SERVICES.artists.remove = window.INK_SERVICES.artists.deactivate;
window.INK_SERVICES.artists.save = function saveArtist(id, data) {
  return id ? window.INK_SERVICES.artists.update(id, data) : window.INK_SERVICES.artists.create(data);
};
