import { createContext, useContext, useEffect, useState } from "react";
import { OrderItem } from "../common";
import { noop } from "lodash";
import { useDisclosure, useSessionStorage, useTimeout } from "@mantine/hooks";
import { onValue, ref } from "firebase/database";
import { useDatabase } from "reactfire";
import { Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type OrderContextPropstype = {
  userId: string | null;
  sessionCode: string | null;
  setUserId: (a: string | null) => void;
  setSessionCode: (a: string | null) => void;
  addPlate: (p: string, q: number) => void;
  removePlate: (p: string) => void;
  editPlate: (p: string, q: number) => void;
  plates: OrderItem[];
};

const DefaultOrderContextProps = {
  userId: "",
  sessionCode: null,
  setUserId: noop,
  addPlate: noop,
  removePlate: noop,
  editPlate: noop,
  setSessionCode: noop,
  plates: [],
} as OrderContextPropstype;

const OrderContext = createContext(DefaultOrderContextProps);

export const OrderContextProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const database = useDatabase();
  const [plates, setPlates] = useState([] as OrderItem[]);
  const navigate = useNavigate();
  const [modalOpen, modalEntry] = useDisclosure();
  const [userId, setUserId] = useSessionStorage<string | null>({
    key: "user/id",
    defaultValue: null,
  });
  const [sessionCode, setSessionCode] = useSessionStorage<string | null>({
    key: "user/session",
    defaultValue: null,
  });
  const logOutEntry = useTimeout(() => {
    modalEntry.close();
    navigate("/");
  }, 3000);

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

  useEffect(() => {
    if (sessionCode) {
      const dataRef = ref(database, sessionCode);
      onValue(dataRef, (snap) => {
        const sessionData = snap.val();
        if (sessionData?.end) {
          modalEntry.open();
          logOutEntry.start();
          setSessionCode("");
          setUserId("");
        }
      });
    }
  }, [sessionCode]);

  useEffect(() => {
    return () => {
      logOutEntry.clear();
    };
  }, []);

  return (
    <OrderContext.Provider
      value={{
        userId,
        sessionCode,
        setSessionCode,
        setUserId,
        addPlate,
        removePlate,
        editPlate,
        plates,
      }}
    >
      <Modal
        lockScroll={false}
        title={"Sessione terminata"}
        opened={modalOpen}
        onClose={modalEntry.close}
      >
        Stai per essere disconnesso
      </Modal>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextPropstype => {
  const orderContext = useContext(OrderContext);
  return orderContext;
};
