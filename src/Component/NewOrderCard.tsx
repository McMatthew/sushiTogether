import {
  Box,
  Button,
  Card,
  Chip,
  Group,
  NumberInput,
  TextInput,
  Title,
} from "@mantine/core";
import Pattern from "../assets/topography.svg";
import { makeCode } from "../utils";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import { useFirebaseApp } from "reactfire";
import { useEffect, useState } from "react";
import { useOrder } from "../context/orderContext.tsx";

const NewOrderCard = () => {
  const navigate = useNavigate();
  const app = useFirebaseApp();
  const [title, setTitle] = useState<string>();
  const [nickname, setNickname] = useState<string>();
  const [limit, setLimit] = useState<number | string>(1);
  const [sessionCode, setSessionCode] = useState<string>();
  const { setUserId, setSessionCode: setSessionCodeContext } = useOrder();

  async function initSession() {
    if (!title || !nickname) return;
    const sessionInstance = {
      title: title,
      partecipants: [nickname],
      limit: limit,
      orders: [],
    };
    const databaseRef = ref(getDatabase(app), sessionCode);
    const snapshot = await set(databaseRef, sessionInstance);
    if (sessionCode) {
      setSessionCodeContext(sessionCode);
      navigate(`/session/${sessionCode}`);
    }
    return snapshot;
  }

  useEffect(() => {
    setSessionCode(makeCode(5));
  }, []);

  return (
    <Card shadow="md" radius={"md"}>
      <Card.Section>
        <Box
          h={65}
          style={{
            backgroundColor: "#25262b",
            backgroundImage: `url(${Pattern})`,
            borderBottom: `1px solid gray`,
          }}
        >
          <TextInput
            variant="unstyled"
            placeholder="Titolo"
            maxLength={20}
            py={8}
            onChange={(val) => setTitle(val.currentTarget.value)}
            styles={() => ({
              input: {
                fontSize: 35,
                paddingLeft: 8,
                color: "white",
                height: "unset",
                fontWeight: 600,
              },
            })}
          />
        </Box>
      </Card.Section>
      <Group justify="space-between" mt={12}>
        <Title order={3} fw={500}>
          Partecipanti:
        </Title>
        <NumberInput
          value={limit}
          onChange={(e) => setLimit(e)}
          min={1}
          max={20}
          defaultValue={1}
          variant="filled"
          size="md"
          w={100}
        />
      </Group>
      <Group justify="space-between" mt={12}>
        <Title order={3} fw={500}>
          Codice:
        </Title>
        <Chip checked={false} size={"xl"} radius={"sm"}>
          {sessionCode}
        </Chip>
      </Group>
      <Group justify="space-between" mt={12}>
        <Title order={3} fw={500}>
          Nickname:
        </Title>
        <TextInput
          placeholder="Hooey McGoose"
          onChange={(val) => setNickname(val.currentTarget.value)}
          variant="filled"
          size="md"
          miw={0}
          style={{ flexShrink: 1, flexGrow: 1 }}
          maxLength={20}
        />
      </Group>
      <Group justify="right" mt={16}>
        <Button
          disabled={!title || !nickname}
          onClick={() => {
            initSession().then(() => setUserId("0"));
          }}
        >
          Avvia
        </Button>
      </Group>
    </Card>
  );
};

export default NewOrderCard;
