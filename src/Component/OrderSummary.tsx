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
  useMantineColorScheme,
} from "@mantine/core";
import sushi from "../assets/logo.png";
import { useOrder } from "../context/orderContext";
import { IconX } from "@tabler/icons-react";
import { Fragment } from "react";

const OrderSummary = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { plates, removePlate } = useOrder();

  return (
    <Box
      h={270}
      bg={"gray.2"}
      style={{
        borderRadius: 12,
      }}
    >
      <Box
        h={34}
        bg={"pink.3"}
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingTop: 8,
          paddingLeft: 4,
        }}
      >
        <Group gap={2}>
          <ColorSwatch size={15} color={theme.colors.red[6]} />
          <ColorSwatch size={15} color={theme.colors.yellow[6]} />
          <ColorSwatch size={15} color={theme.colors.green[5]} />
        </Group>
      </Box>
      <ScrollArea
        offsetScrollbars
        type="auto"
        scrollbarSize={10}
        h={235}
        styles={(theme) => ({
          scrollbar: {
            '&[dataOrientation="vertical"] .mantineScrollAreaThumb': {
              backgroundColor: theme.colors.pink[2],
            },
          },

          corner: {
            opacity: 1,
            background:
              colorScheme === "dark"
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
              styles={{ root: { filter: "grayscale(1)", opacity: 0.4 } }}
            />
          ) : (
            plates.map((order) => (
              <Fragment key={order.item}>
                <List.Item>
                  <Group align="center">
                    <Text>
                      {order.item} x {order.quantity}
                    </Text>
                    <ActionIcon size={"xs"} color="red.4" variant="outline">
                      <IconX onClick={() => removePlate(order.item)} />
                    </ActionIcon>
                  </Group>
                </List.Item>
                <Divider color={"gray.5"} />
              </Fragment>
            ))
          )}
        </List>
      </ScrollArea>
    </Box>
  );
};
export default OrderSummary;
