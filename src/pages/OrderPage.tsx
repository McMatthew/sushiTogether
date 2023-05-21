import { Box, Title } from "@mantine/core";
import OrderSummary from "../Component/OrderSummary";
import CreateOrderMenu from "../Component/CreateOrderMenu";

const OrderPage = () => {
  return (
    <Box>
      <Title c={"white"} order={1}>
        Ordine
      </Title>
      <Title order={3} mb={12}>
        Scegli quali piatti ordinare
      </Title>
      <OrderSummary />
      <CreateOrderMenu />
    </Box>
  );
};
export default OrderPage;
