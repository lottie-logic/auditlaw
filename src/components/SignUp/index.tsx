import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Group,
  Input,
  Modal,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import { SetStateAction, useState } from "react";
import { At } from "tabler-icons-react";
import { Web3Storage } from "web3.storage";
const SignUp = () => {
  const [opened, setOpened] = useState(false);

  function getAccessToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdiREVlNjRmQWY5RmJGOEQ3QTM2MzAyNjY5QkY0OTE0MEJmMDFlZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY0NjI3MDg5ODEsIm5hbWUiOiJidW5jaCJ9.OwG3jsLnWHWRR_FtnUEwQHyHzzBr1KRo1HVbikiyrb8";
    // return process.env.WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  const client = makeStorageClient();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      image: "",
      name: "",
      bio: "",
      termsOfService: false,
    },

    // validate: {
    //   email: (value: string) =>
    //     /^\S+@\S+$/.test(value) ? null : "Invalid email",
    // },
  });

  const onFinish = () => {
    // const image =
    //   "https://bafybeiadydnbo4ffr2vuhgehe3gnog4rxoebsyasolvoahych4vcioszhm.ipfs.dweb.link/mila.jpeg";
    const username = form.values.username;
    const name = form.values.name;
    const bio = form.values.bio;
    console.log("full", image);
    const data = {
      username: username,
      name: name,
      bio: bio,
      image: image,
    };
    console.log("form data", data);
  };

  const dropzoneChildren = (status: DropzoneStatus) => (
    <Group
      position="center"
      spacing="lg"
      style={{ minHeight: 50, pointerEvents: "none" }}
    >
      <Avatar radius="xl" size="xl" src={null || image} alt="it's me" />
    </Group>
  );
  return (
    <>
      <div>
        <Text>This is sign in</Text>

        <Modal
          overlayOpacity={0.55}
          overlayBlur={13}
          opened={opened}
          onClose={() => setOpened(false)}
          title="Introduce yourself!"
        >
          <Box sx={{ maxWidth: 300 }} mx="auto">
            {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
            <form>
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={async (files) => {
                  const imageData = files[0].name;
                  const rootCid = await client.put(files, {
                    name: "avatar",
                    maxRetries: 3,
                  });
                  setFile(rootCid);
                  console.log("rootCID", rootCid);
                  setImage(
                    "https://" +
                      `${rootCid}` +
                      ".ipfs.dweb.link/" +
                      `${imageData}`
                  );

                  return { image };
                }}
              >
                {(status) => dropzoneChildren(status)}
              </Dropzone>
              <Space h="md" />

              <TextInput
                label="Username"
                required
                placeholder="milakunis"
                {...form.getInputProps("username")}
              />
              <Space h="md" />

              <TextInput
                label="Full Name"
                required
                placeholder="Mila Kunis"
                {...form.getInputProps("name")}
              />

              <TextInput
                label="Bio"
                placeholder="I like to do human things 👽 "
                {...form.getInputProps("bio")}
              />
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
              />

              <Checkbox
                mt="md"
                label="I agree to sell my privacy"
                {...form.getInputProps("termsOfService", { type: "checkbox" })}
              />
              <Group position="right" mt="md">
                <Button onClick={onFinish}>Submit</Button>
              </Group>
            </form>
          </Box>
        </Modal>

        <Group position="center">
          <Button onClick={() => setOpened(true)}>Join </Button>
        </Group>
      </div>
    </>
  );
};

export default SignUp;