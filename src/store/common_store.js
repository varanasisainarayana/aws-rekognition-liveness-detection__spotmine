import { makeAutoObservable } from "mobx";

class CommonStore {
  constructor() {
    makeAutoObservable(this);
  }
  sessionId = null;

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }
}

export default CommonStore;
