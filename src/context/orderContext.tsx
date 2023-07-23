import { createContext, useContext, useState } from "react";
import { OrderItem } from "../common";

type OrderContextPropstype = {
  firebasetoken: string | null;
  setFirebaseToken: (a: string | null) => void;
  addPlate: (p: string, q: number) => void;
  removePlate: (p: string) => void;
  editPlate: (p: string, q: number) => void;
  plates: OrderItem[];
};

const DefaultOrderContextProps = {
  firebasetoken: "",
  setFirebaseToken: () => {},
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
  const [fbToken, setFbToken] = useState<string | null>(null);

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

  function _setFbToken(a: string | null) {
    setFbToken(a);
  }

  return (
    <OrderContext.Provider
      value={{
        firebasetoken: fbToken,
        setFirebaseToken: _setFbToken,
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
