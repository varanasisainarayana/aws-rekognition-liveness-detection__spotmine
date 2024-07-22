import CommonStore from "./common_store";
import React from "react";
class RootStore {
  constructor() {
    this.CommonStore = new CommonStore(this);
  }
}

const StoresContext = React.createContext(new RootStore());
export const useStores = () => React.useContext(StoresContext);
