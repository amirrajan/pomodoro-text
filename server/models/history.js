function tasks(callback) {
  return callback && callback([
    { description: "laundry" },
    { description: "dishes" },
    { description: "coding" },
  ]);
}

module.exports.tasks = tasks;
