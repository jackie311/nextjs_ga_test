import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const EntityContext = createContext({});

export default function GlobalContext({ children }) {
  const [user, setUser] = useState({});
  const [value, setValue] = useState({});

  useEffect(() => {

    axios({
      method: 'get',
      url: "https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1"
    })
      .then(res => {
        setValue(JSON.parse(res?.data?.bea));
      })
      .catch(() => console.error('Fail to fetch entity details'));

  }, []);


  return (
    <EntityContext.Provider value={value}>
      {children}
    </EntityContext.Provider>
  );
};

