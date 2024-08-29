import { Canvas } from "@/components/Canvas/Canvas";
import { ToolBar } from "@/components/ToolBar/Toolbar";
import { Modals } from "@/components/ui/Modals/Modals";
import { Stack } from "@/components/ui/Stack/Stack";

const App = () => {
  return (
    <Stack as="main" style={{ width: "100%" }}>
      <ToolBar />
      <Canvas />
      <Modals />
    </Stack>
  );
};

export default App;
