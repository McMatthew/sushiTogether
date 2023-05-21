import { createContext, useContext, useEffect, useState } from "react";
import { OrderItem } from "../common";
import { useFirebaseApp } from "reactfire";
import { DatabaseReference, getDatabase, ref } from "firebase/database";

type OrderContextPropstype = {
  code?: string;
  setCode: (c: string) => void;
  addPlate: (p: string, q: number) => void;
  removePlate: (p: string) => void;
  editPlate: (p: string, q: number) => void;
  plates: OrderItem[];
};

const DefaultOrderContextProps = {
  code: undefined,
  setCode: () => {},
  addPlate: () => {},
  removePlate: () => {},
  editPlate: () => {},
  plates: [],
} as OrderContextPropstype;

const OrderContext = createContext(DefaultOrderContextProps);

export const OrderContextProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [plates, setPlates] = useState([] as OrderItem[]);
  const [code, setCode] = useState<string>();
  const [dbref, setDbref] = useState<DatabaseReference>();
  const app = useFirebaseApp();

  useEffect(() => {
    if (code) setDbref(ref(getDatabase(app), code));
  }, [code]);

  function _setCode(a: string) {
    setCode(a);
  }

  function addPlate(plate: string, quantity: number) {
    if (quantity === 0 || !Number.isInteger(quantity)) return;
    const alreadyOrdered = plates.find((order) => order.item === plate);
    if (alreadyOrdered) editPlate(plate, quantity + alreadyOrdered.quantity);
    else setPlates(plates.concat({ item: plate, quantity }));
  }

  function removePlate(searchedPlate: string) {
    const flatPlate = searchedPlate.toLowerCase();

    const newOrder = plates
      .map((plate) => {
        if (plate.item.toLowerCase() !== flatPlate) return plate;
        return undefined;
      })
      .filter((plate) => plate !== undefined) as OrderItem[];

    setPlates(newOrder);
  }

  function editPlate(searchedPlate: string, newQuantity: number) {
    const flatPlate = searchedPlate.toLowerCase();
    const editedOrder = plates
      .map((plate) => {
        if (plate.item.toLowerCase() === flatPlate)
          return { item: plate.item, quantity: newQuantity };
        return plate;
      })
      .filter((plate) => plate !== undefined) as OrderItem[];
    setPlates(editedOrder);
  }

  return (
    <OrderContext.Provider
      value={{
        code,
        setCode: _setCode,
        addPlate,
        removePlate,
        editPlate,
        plates,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextPropstype => {
  const orderContext = useContext(OrderContext);
  return orderContext;
};
