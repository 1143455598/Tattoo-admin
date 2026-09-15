(function attachInventoryService() {
  const inventoryTable = () => window.INK_DB.from('inventario');

  window.INK_SERVICES = window.INK_SERVICES || {};
  window.INK_SERVICES.inventory = {
    list() {
      return inventoryTable().select('*').order('nombre');
    },
    listSummary() {
      return inventoryTable().select('nombre,stock,stock_minimo');
    },
    updateStock(id, stock) {
      return inventoryTable().update({ stock }).eq('id', id);
    },
    update(id, data) {
      return inventoryTable().update(data).eq('id', id);
    },
    create(data) {
      return inventoryTable().insert([data]);
    },
    remove(id) {
      return inventoryTable().delete().eq('id', id);
    },
    save(id, data) {
      return id ? this.update(id, data) : this.create(data);
    },
  };
})();

window.INK_SERVICES.inventory.load = window.INK_SERVICES.inventory.list;
window.INK_SERVICES.inventory.delete = window.INK_SERVICES.inventory.remove;
