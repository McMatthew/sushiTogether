import {
  Box,
  ColorSwatch,
  Divider,
  Group,
  List,
  ScrollArea,
  Text,
  Image,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import sushi from "../assets/logo.png";
import { useOrder } from "../context/orderContext";
import { IconX } from "@tabler/icons-react";

const OrderSummary = () => {
  const theme = useMantineTheme();
  const { plates, removePlate } = useOrder();

  return (
    <Box
      h={270}
      bg={"gray.2"}
      sx={{
        borderRadius: 12,
      }}
    >
      <Box
        h={34}
        bg={"pink.3"}
        sx={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingTop: 8,
          paddingLeft: 4,
        }}
      >
        <Group spacing={2}>
          <ColorSwatch color={theme.colors.red[6]} w={15} h={15} />
          <ColorSwatch color={theme.colors.yellow[6]} w={15} h={15} />
          <ColorSwatch color={theme.colors.green[5]} w={15} h={15} />
        </Group>
      </Box>
      <ScrollArea
        offsetScrollbars
        type="auto"
        scrollbarSize={10}
        h={235}
        styles={(theme) => ({
          scrollbar: {
            '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
              backgroundColor: theme.colors.pink[2],
            },
          },

          corner: {
            opacity: 1,
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <List
          icon={<img src={sushi} width={15} />}
          spacing={"sm"}
          c={"gray.7"}
          ml={8}
        >
          {plates.length === 0 ? (
            <Image
              fit="contain"
              src={sushi}
              height={186}
              p={20}
              styles={{ image: { filter: "grayscale(1)", opacity: 0.4 } }}
            />
          ) : (
            plates.map((order) => (
              <>
                <List.Item key={order.item}>
                  <Group position="center">
                    <Text>
                      {order.item} x {order.quantity}
                    </Text>
                    <ActionIcon size={"xs"} color="red.4" variant="outline">
                      <IconX onClick={() => removePlate(order.item)} />
                    </ActionIcon>
                  </Group>
                </List.Item>
                <Divider color={"gray.5"} />
              </>
            ))
          )}
        </List>
      </ScrollArea>
    </Box>
  );
};
export default OrderSummary;
