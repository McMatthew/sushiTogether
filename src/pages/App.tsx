import { AppShell, Group, Image, Title } from "@mantine/core";
import logo from "../assets/logo.png";
import NewOrderCard from "../Component/NewOrderCard";
import JoinSessionCard from "../Component/JoinSession";

function App() {
  return (
    <AppShell>
      <>
        <AppShell.Header>
          <Group px={8} align="center">
            <Image src={logo} width={30} height={30} />
            <Title order={1}>Sushi Together</Title>
          </Group>
        </AppShell.Header>
        <Title order={2} c={"gray.1"} mb={18}>
          Inizia una sushiata!
        </Title>
        <NewOrderCard />

        <Title order={2} c={"gray.1"} mt={18} mb={18}>
          Autoinvitati!
        </Title>
        <JoinSessionCard />
      </>
    </AppShell>
  );
}

export default App;
