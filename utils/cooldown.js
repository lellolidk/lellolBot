const cooldown = new Map();

exports.setCooldown = (id, time) => {
  cooldown.set(id);
  setTimeout(() => {
    this.deleteCooldown(id);
  }, time);
};

exports.deleteCooldown = (id) => {
  cooldown.delete(id);
};

exports.hasCooldown = (id) => {
  return cooldown.has(id);
};
