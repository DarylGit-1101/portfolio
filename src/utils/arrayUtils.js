/**
 * Returns a new array with the item at `fromIndex` moved to `toIndex`.
 */
export function moveArrayItem(array, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= array.length || fromIndex === toIndex) {
    return array;
  }
  const next = [...array];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/**
 * Returns a new array with the item at `index` updated by a partial object or replacement value.
 */
export function updateArrayItem(array, index, updater) {
  return array.map((item, idx) => {
    if (idx !== index) return item;
    return typeof updater === 'function' ? updater(item) : { ...item, ...updater };
  });
}

/**
 * Returns a new array with the item at `index` removed.
 */
export function removeArrayItem(array, index) {
  return array.filter((_, idx) => idx !== index);
}

/**
 * Creates standard immutable list CRUD handlers (`add`, `updateField`, `replace`, `move`, `remove`)
 * bound to a specific array property on a module object.
 */
export function createModuleListHandlers(module, listKey, onUpdateModule, { prepend = false } = {}) {
  const list = module[listKey] || [];

  const commit = (nextList) => {
    onUpdateModule({ ...module, [listKey]: nextList });
  };

  return {
    add: (newItem) => commit(prepend ? [newItem, ...list] : [...list, newItem]),
    updateField: (index, field, value) =>
      commit(updateArrayItem(list, index, { [field]: value })),
    replace: (index, nextValue) =>
      commit(updateArrayItem(list, index, () => nextValue)),
    move: (fromIndex, toIndex) => commit(moveArrayItem(list, fromIndex, toIndex)),
    remove: (index) => commit(removeArrayItem(list, index))
  };
}
