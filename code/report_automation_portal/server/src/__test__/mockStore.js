const mockStore = {
  data: {},
  get: (sid, callback) => {
    callback(null, this.data[sid]);
  },
  set: (sid, session, callback) => {
    this.data[sid] = session;
    callback(null);
  },
  destroy: (sid, callback) => {
    delete this.data[sid];
    callback(null);
  },
};

export default mockStore;
