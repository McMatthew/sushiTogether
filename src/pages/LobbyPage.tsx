import { Box, Title } from "@mantine/core";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { useDatabase } from "reactfire";
import { ReturnedSessionType } from "../common";
import { useOrder } from "../context/orderContext";

const LobbyPage = () => {
  const database = useDatabase();
  const pathnameSplitted = location.pathname.split("/");
  const sessionCode = pathnameSplitted[pathnameSplitted.length - 2];
  const [data, setData] = useState<ReturnedSessionType | null>(null);
  const { plates, firebasetoken } = useOrder();

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = ref(database, sessionCode);
      onValue(dataRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
      });
    };

    fetchData();
  }, [firebasetoken]);

  useEffect(() => {
    console.log(data, firebasetoken);
  }, [data]);
  return (
    <Box>
      <Title>
        {data && firebasetoken ? data[firebasetoken].title : "Lobby"}
      </Title>
    </Box>
  );
};
export default LobbyPage;
