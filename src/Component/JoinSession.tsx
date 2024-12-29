import {
  Button,
  Card,
  Group,
  Image,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Pattern from "../assets/topography.svg";
import chip from "../assets/chip.png";
import logo from "../assets/logo.png";
import { useFirebaseApp } from "reactfire";
import { get, getDatabase, push, ref } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/orderContext.tsx";

const JoinSessionCard = () => {
  const app = useFirebaseApp();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { setUserId, setSessionCode } = useOrder();
  const [error, setError] = useState("");

  function logIntoSession(code: string) {
    const databaseRef = ref(getDatabase(app), code);
    if (databaseRef.key) {
      const sessionRef = ref(getDatabase(app), `${code}/partecipants`);
      get(databaseRef).then((res) => {
        const session = res.val();
        if (!session) setError("Nessuna sessione col codice inserito");
        else {
          const partecipants = session.partecipants.length;
          const limitReached = partecipants >= session.limit;
          if (limitReached) return setError("Limite partecipanti raggiunto");
          const id = push(sessionRef, name);
          setUserId(id.key);
          setSessionCode(code);
          navigate(`session/${databaseRef.key}`);
        }
      });
    }
  }

  return (
    <Card
      shadow="md"
      radius={"md"}
      h={220}
      style={{ backgroundImage: `url(${Pattern})`, position: "relative" }}
    >
      <Image
        src={logo}
        h={30}
        w={"auto"}
        style={{ position: "absolute", right: 12, top: 8 }}
      />
      <Group mt={20} mb={8}>
        <Image src={chip} h={50} w={"auto"} />
        <Title order={5}>debit</Title>
      </Group>
      <Group gap={4}>
        <Title order={4}>Nome:</Title>
        <TextInput
          onFocus={() => setError("")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={15}
          styles={{
            root: { flexGrow: 1, flexBasis: "20%", position: "relative" },
            input: { width: "100%" },
          }}
        />
      </Group>
      <Group gap={4} mt={12}>
        <Title order={4}>codice:</Title>
        <TextInput
          onFocus={() => setError("")}
          maxLength={5}
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
          styles={{
            root: { flexGrow: 1, flexBasis: "30%", position: "relative" },
            input: { width: "100%" },
          }}
        />

        <Button disabled={!code || !name} onClick={() => logIntoSession(code)}>
          Partecipa
        </Button>
      </Group>
      {error && <Text c={"red"}>{error}</Text>}
    </Card>
  );
};

export default JoinSessionCard;
