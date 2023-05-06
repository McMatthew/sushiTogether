import {
  Box,
  Card,
  Group,
  TextInput,
  Title,
  NumberInput,
  Chip,
  Button,
  Image,
} from "@mantine/core";
import Pattern from "../assets/topography.svg";
import chip from "../assets/chip.png";
import logo from "../assets/logo.png";

const JoinSessionCard = () => {
  return (
    <Card
      shadow="md"
      radius={"md"}
      sx={{ backgroundImage: `url(${Pattern})`, position: "relative" }}
    >
      <Image
        src={logo}
        width={30}
        sx={{ position: "absolute", right: 12, top: 8 }}
      />
      <Group mb={8}>
        <Image src={chip} width={50} />
        <Title order={5}>debit</Title>
      </Group>
      <Group spacing={4}>
        <Title order={4}>Nome:</Title>
        <TextInput
          maxLength={15}
          styles={{
            root: { flexGrow: 1, flexBasis: "20%", position: "relative" },
            input: { width: "100%" },
          }}
        />
      </Group>
      <Group spacing={4} mt={12}>
        <Title order={4}>codice:</Title>
        <TextInput
          maxLength={5}
          styles={{
            root: { flexGrow: 1, flexBasis: "30%", position: "relative" },
            input: { width: "100%" },
          }}
        />
        <Button onClick={() => {}}>partecipa</Button>
      </Group>
    </Card>
  );
};

export default JoinSessionCard;
