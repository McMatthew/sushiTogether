import { Button, Code, Group, Image, Text } from "@mantine/core";
import sushi from "../assets/logo.png";
import { OrderItem } from "../common.ts";
import { useOrder } from "../context/orderContext.tsx";
import { useDatabase } from "reactfire";
import { ref, update, get } from "firebase/database";

const PlateRow = ({
  order,
  sessionCode,
  orderIndex,
  showButton,
}: {
  order: OrderItem;
  sessionCode: string;
  orderIndex: number;
  showButton?: boolean;
}) => {
  const { userId } = useOrder();
  const database = useDatabase();

  function signAsReceived() {
    const dataRef = ref(
      database,
      `${sessionCode}/orders/${userId}/${orderIndex}`
    );
    get(dataRef).then((data) => {
      const oldRecord = data.val();
      update(dataRef, { ...oldRecord, quantity: oldRecord.quantity - 1 });
    });
  }
  return (
    <Group my={8}>
      <Image height={30} width={"auto"} src={sushi} />
      <Text
        td={!order.quantity ? "line-through" : "none"}
        style={{
          borderRight: "1px solid var(--mantine-color-gray-2)",
          opacity: !order.quantity ? 0.6 : 1,
        }}
        miw={100}
        fw={600}
      >
        {order.item}
      </Text>
      <Group style={{ flexGrow: 1 }} justify="space-between">
        <Code>x{order.quantity}</Code>
        {showButton && (
          <Button
            disabled={!order.quantity}
            size={"compact-xs"}
            onClick={signAsReceived}
          >
            Arrivato
          </Button>
        )}
      </Group>
    </Group>
  );
};

export default PlateRow;
