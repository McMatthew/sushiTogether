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
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, push } from "firebase/database";
import { useFirebaseApp } from "reactfire";
import { useState } from "react";

const NewOrderCard = () => {
  const navigate = useNavigate();
  const sessionCode = makeCode(5);
  const app = useFirebaseApp();
  const [title, setTitle] = useState<string>();
  const [nickname, setNickname] = useState<string>();

  async function initSession() {
    if (!title || !nickname) return;
    var sessionInstance = { title: title, partecipants: ["admin"], orders: [] };
    const databaseRef = ref(getDatabase(app), sessionCode);
    const snapshot = await push(databaseRef, sessionInstance);
    navigate(`/session/${sessionCode}`);
    return snapshot;
  }

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
            onChange={(val) => setTitle(val.currentTarget.value)}
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
          {sessionCode}
        </Chip>
      </Group>
      <Group position="apart" mt={12}>
        <Title order={3} weight={500}>
          Nickname:
        </Title>
        <TextInput
          placeholder="Hooey McGoose"
          onChange={(val) => setNickname(val.currentTarget.value)}
          variant="filled"
          size="md"
          w={200}
        />
      </Group>
      <Group position="right" mt={16}>
        <Button
          disabled={!title}
          onClick={() => {
            initSession();
          }}
        >
          Avvia
        </Button>
      </Group>
    </Card>
  );
};

export default NewOrderCard;
