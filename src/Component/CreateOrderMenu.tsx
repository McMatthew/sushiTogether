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
import { useState } from "react";
import { useOrder } from "../context/orderContext";
import ConfirmModal from "./ConfirmModal";
import { useDisclosure } from "@mantine/hooks";

const CreateOrderMenu = () => {
  const [item, setItem] = useState<string>();
  const [quantity, setQuantity] = useState<number>();
  const { addPlate, setCode } = useOrder();
  const [opened, { open, close }] = useDisclosure();
  const pathnameSplitted = location.pathname.split("/");
  const sessionCode = pathnameSplitted[pathnameSplitted.length - 1];
  setCode(sessionCode);

  return (
    <>
      <ConfirmModal
        title={"Sicuro sicuro?"}
        onClose={close}
        opened={opened}
        onConfirm={() => {}}
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
