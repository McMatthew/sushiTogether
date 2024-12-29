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
import ConfirmModal from "./ConfirmModal";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { useDatabase } from "reactfire";
import { onValue, ref, set } from "firebase/database";
import { Session } from "../common";
import { useNavigate } from "react-router-dom";

const CreateOrderMenu = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState<boolean>(false);
  const [item, setItem] = useState<string>();
  const [quantity, setQuantity] = useState<number>();
  const { addPlate, plates, userId } = useOrder();
  const [opened, { open, close }] = useDisclosure();
  const database = useDatabase();
  const pathnameSplit = location.pathname.split("/");
  const sessionCode = pathnameSplit[pathnameSplit.length - 1];
  const [data, setData] = useState<Session | null>(null);
  const focusRef = useFocusTrap(focused);

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
    if (data) {
      const dataRef = ref(database, `${sessionCode}/orders/${userId}`);
      const mergedMap = new Map();

      for (const obj1 of userId ? data.orders?.[userId] ?? [] : []) {
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
        lockScroll={false}
        title={"Sicuro sicuro?"}
        onClose={close}
        opened={opened}
        onConfirm={() => {
          prepareOrder().then(() => {
            close();
            navigate("lobby");
          });
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
          <Group mt={8} gap={4}>
            <NumberInput
              ref={focusRef}
              onBlur={() => setFocused(false)}
              min={1}
              max={99}
              w={40}
              size="xs"
              hideControls
              value={quantity}
              onChange={(e) => setQuantity(+e)}
              placeholder="1"
            />
            <TextInput
              size="xs"
              value={item}
              placeholder="Nigiri"
              maxLength={20}
              onChange={(e) => setItem(e.currentTarget.value)}
            />
            <ActionIcon
              disabled={!item || !quantity}
              color="lime"
              variant="filled"
              onClick={() => {
                if (quantity && item) {
                  addPlate(item, quantity);
                  setItem("");
                  setQuantity(1);
                  setFocused(true);
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
