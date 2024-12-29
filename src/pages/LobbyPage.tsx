import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  Group,
  Modal,
  Paper,
  Popover,
  ScrollArea,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDatabase } from "reactfire";
import { Session } from "../common";
import { useOrder } from "../context/orderContext.tsx";
import { groupBy, sumBy } from "lodash";
import {
  IconClipboardCopy,
  IconInfoCircleFilled,
  IconX,
} from "@tabler/icons-react";
import PlateRow from "../Component/plateRow.tsx";
import { useDisclosure } from "@mantine/hooks";

const LobbyPage = () => {
  const database = useDatabase();
  const { sessionCode } = useOrder();
  const [modalOpen, modalEntry] = useDisclosure();
  const { userId } = useOrder();
  const [data, setData] = useState<Session | null>(null);
  const orders = Object.entries(
    groupBy(
      Object.values(data?.orders ?? {}).flatMap((order) => order),
      "item"
    )
  ).map(([item, items]) => ({
    item,
    quantity: sumBy(items, "quantity"),
  }));
  const myOrder = userId ? data?.orders?.[userId] ?? [] : [];

  function endSession() {
    if (!sessionCode) return;
    const dataRef = ref(database, sessionCode);
    set(dataRef, { end: 1 }).then(() => modalEntry.close());
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionCode) return;
      const dataRef = ref(database, sessionCode);
      onValue(dataRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
      });
    };

    fetchData();
  }, [sessionCode]);

  return (
    <Box pb={50}>
      <Modal
        lockScroll={false}
        title={"Chiudere la sessione?"}
        opened={modalOpen}
        onClose={modalEntry.close}
      >
        Sicuro di voler terminare la sessione?
        <Group justify={"space-between"} mt={12}>
          <Button onClick={modalEntry.close}>Annulla</Button>
          <Button onClick={endSession} color={"red"}>
            Continua
          </Button>
        </Group>
      </Modal>
      <Group justify={"space-between"}>
        <Title>{data && sessionCode ? data.title : "Lobby"}</Title>
        <Popover>
          <Popover.Dropdown>
            <Text fw={600}>Codice accesso:</Text>
            <CopyButton value={sessionCode ?? ""}>
              {({ copied, copy }) => (
                <Group gap={4} c={copied ? "lime" : "blue"} onClick={copy}>
                  <IconClipboardCopy />
                  {copied ? "Copiato" : sessionCode}
                </Group>
              )}
            </CopyButton>
          </Popover.Dropdown>
          <Popover.Target>
            <ActionIcon variant={"transparent"}>
              <IconInfoCircleFilled />
            </ActionIcon>
          </Popover.Target>
        </Popover>
      </Group>
      <Space h={16} />
      <Box mx={8}>
        <Title mb={16} order={2}>
          Tutti i piatti
        </Title>
        <Paper py={8} px={12} bg={"dark"} radius={"md"}>
          <Group gap={0}>
            <Box w={"50%"} fw={700}>
              Piatto
            </Box>
            <Box w={"50%"} fw={700}>
              Quantità
            </Box>
          </Group>
          <ScrollArea.Autosize mah={300}>
            {orders.map((order, index) => (
              <React.Fragment key={order.item}>
                <React.Fragment key={order.item}>
                  <PlateRow
                    orderIndex={index}
                    sessionCode={sessionCode ?? ""}
                    order={order}
                  />
                </React.Fragment>
              </React.Fragment>
            ))}
          </ScrollArea.Autosize>
        </Paper>
        <Title my={16} order={2}>
          I tuoi piatti
        </Title>
        <Paper py={8} px={12} bg={"dark"} radius={"md"}>
          <Group gap={0}>
            <Box w={"50%"} fw={700}>
              Piatto
            </Box>
            <Box w={"50%"} fw={700}>
              Quantità
            </Box>
          </Group>
          <ScrollArea.Autosize mah={300}>
            {myOrder.map((order, index) => (
              <React.Fragment key={order.item}>
                <PlateRow
                  showButton
                  orderIndex={index}
                  sessionCode={sessionCode ?? ""}
                  order={order}
                />
              </React.Fragment>
            ))}
          </ScrollArea.Autosize>
        </Paper>
      </Box>
      {userId === "0" && (
        <Box bg={"dark.9"} pos={"fixed"} w={"100%"} h={40} left={0} bottom={0}>
          <Group justify={"end"} mx={4} h={"100%"}>
            <Button onClick={modalEntry.open} variant={"subtle"}>
              <IconX />
              Chiudi sessione
            </Button>
          </Group>
        </Box>
      )}
    </Box>
  );
};
export default LobbyPage;
