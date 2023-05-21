import { Button, Divider, Modal, ModalProps, Text } from "@mantine/core";

const ConfirmModal = (props: ModalProps & { onConfirm: () => void }) => {
  const { onConfirm, ...otherProps } = props;
  return (
    <Modal
      {...otherProps}
      radius={"lg"}
      styles={{ title: { fontSize: 20, fontWeight: 700, color: "white" } }}
    >
      <Text>
        Sicuro di confermare l'ordine? L'azione non è revesibile. Prenditi il
        tuo tempo per pensare... Al massimo ti becchi qualche insulto dai tuoi
        amici
      </Text>
      <Divider my={16} />
      <Button onClick={props.onConfirm}>Si tranqui</Button>
    </Modal>
  );
};

export default ConfirmModal;
