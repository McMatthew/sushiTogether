import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  TextInput,
  Title,
} from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOrder } from "../context/orderContext";
import { redirect } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { useDisclosure } from "@mantine/hooks";
import { useDatabase } from "reactfire";
import { ref, onValue, set } from "firebase/database";
import { ReturnedSessionType } from "../common";

const CreateOrderMenu = () => {
  const [item, setItem] = useState<string>();
  const [quantity, setQuantity] = useState<number>();
  const { addPlate, firebasetoken, plates } = useOrder();
  const [opened, { open, close }] = useDisclosure();
  const database = useDatabase();
  const pathnameSplitted = location.pathname.split("/");
  const sessionCode = pathnameSplitted[pathnameSplitted.length - 1];
  const [data, setData] = useState<ReturnedSessionType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = ref(database, sessionCode);
      onValue(dataRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
      });
    };

    fetchData();
  }, []);

  async function prepareOrder() {
    if (data && firebasetoken) {
      const dataRef = ref(database, `${sessionCode}/${firebasetoken}/orders`);
      const mergedMap = new Map();

      for (const obj1 of data[firebasetoken].orders ?? []) {
        const { item, quantity } = obj1;
        if (mergedMap.has(item)) {
          mergedMap.set(item, mergedMap.get(item) + quantity);
        } else {
          mergedMap.set(item, quantity);
        }
      }

      for (const obj2 of plates) {
        const { item, quantity } = obj2;
        if (mergedMap.has(item)) {
          mergedMap.set(item, mergedMap.get(item) + quantity);
        } else {
          mergedMap.set(item, quantity);
        }
      }

      const mergedArray = Array.from(mergedMap, ([item, quantity]) => ({
        item,
        quantity,
      }));

      await set(dataRef, mergedArray);
    }
  }

  return (
    <>
      <ConfirmModal
        title={"Sicuro sicuro?"}
        onClose={close}
        opened={opened}
        onConfirm={() => {
          prepareOrder();
          close();
          redirect("/lobby");
        }}
      />
      <Card shadow="md" radius={"md"} mt={16}>
        <Card.Section>
          <Title mt={4} px={8} order={2}>
            Menu
          </Title>
          <Title px={8} order={4}>
            Inserisci quantità e numero del piatto
          </Title>
        </Card.Section>
        <Box>
          <Group mt={8} spacing={4}>
            <NumberInput
              min={1}
              max={99}
              w={40}
              size="xs"
              hideControls
              onChange={(e) => setQuantity(+e)}
              placeholder="1"
            />
            <TextInput
              size="xs"
              placeholder="N10"
              onChange={(e) => setItem(e.currentTarget.value)}
            />
            <ActionIcon
              disabled={!item && !quantity}
              color="lime"
              variant="filled"
              onClick={() => {
                if (quantity && item) {
                  addPlate(item, quantity);
                }
              }}
            >
              <IconReceipt />
            </ActionIcon>
          </Group>
          <Divider my={18} />
          <Button onClick={open}>Conferma ordine</Button>
        </Box>
      </Card>
    </>
  );
};
export default CreateOrderMenu;
