import {
  Box,
  Card,
  Group,
  TextInput,
  Title,
  NumberInput,
  Chip,
  Button,
} from "@mantine/core";
import Pattern from "../assets/topography.svg";
import { makeCode } from "../utils";

const NewOrderCard = () => {
  return (
    <Card shadow="md" radius={"md"}>
      <Card.Section>
        <Box
          h={65}
          sx={{
            backgroundColor: "#25262b",
            backgroundImage: `url(${Pattern})`,
            borderBottom: `1px solid gray`,
          }}
        >
          <TextInput
            variant="unstyled"
            placeholder="Titolo"
            py={8}
            styles={(theme) => ({
              input: {
                fontSize: 35,
                paddingLeft: 8,
                color: theme.colors.green[3],
                height: "unset",
                fontWeight: 600,
              },
            })}
          />
        </Box>
      </Card.Section>
      <Group position="apart" mt={12}>
        <Title order={3} weight={500}>
          Partecipanti:
        </Title>
        <NumberInput
          min={1}
          max={20}
          defaultValue={1}
          variant="filled"
          size="md"
          w={100}
        />
      </Group>
      <Group position="apart" mt={12}>
        <Title order={3} weight={500}>
          Codice:
        </Title>
        <Chip checked={false} size={"xl"} radius={"sm"}>
          {makeCode(5)}
        </Chip>
      </Group>
      <Group position="right" mt={16}>
        <Button onClick={() => {}}>Avvia</Button>
      </Group>
    </Card>
  );
};

export default NewOrderCard;
