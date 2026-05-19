import { createFileRoute } from "@tanstack/react-router";

import { UpdatesSettingsPanel } from "../components/settings/SettingsPanels";

export const Route = createFileRoute("/settings/updates")({
  component: UpdatesSettingsPanel,
});
