import { useEffect, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArchiveIcon,
  FileTextIcon,
  FolderPlusIcon,
  MonitorIcon,
  OctagonIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  TerminalSquareIcon,
  Trash2Icon,
} from "lucide-react";

import ThreadSidebar from "./Sidebar";
import { Sidebar, SidebarProvider } from "./ui/sidebar";
import { selectThreadTerminalState, useTerminalStateStore } from "../terminalStateStore";
import {
  clearShortcutModifierState,
  syncShortcutModifierStateFromKeyboardEvent,
} from "../shortcutModifierState";
import { APP_BASE_NAME } from "../branding";
import { useCommandPaletteStore } from "../commandPaletteStore";
import { useHandleNewThread } from "../hooks/useHandleNewThread";
import { Button } from "./ui/button";

type RetroCommand = "terminal" | "diff" | "interrupt" | "focus-composer";

function dispatchRetroCommand(command: RetroCommand) {
  window.dispatchEvent(new CustomEvent<RetroCommand>("t3-retro-command", { detail: command }));
}

function RetroToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled}
      className="retro-toolbar-button h-[62px] min-w-[74px] flex-col gap-1 px-2.5 py-1.5"
      onClick={onClick}
    >
      <Icon className="size-6" />
      <span>{label}</span>
    </Button>
  );
}

export function AppSidebarLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const setCommandPaletteOpen = useCommandPaletteStore((store) => store.setOpen);
  const { defaultProjectRef, handleNewThread, routeThreadRef } = useHandleNewThread();
  const activeTerminalState = useTerminalStateStore((state) =>
    selectThreadTerminalState(state.terminalStateByThreadKey, routeThreadRef),
  );

  const handleNewThreadClick = () => {
    if (!defaultProjectRef) return;
    void handleNewThread(defaultProjectRef, { envMode: "local" });
  };

  useEffect(() => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      syncShortcutModifierStateFromKeyboardEvent(event);
    };
    const onWindowKeyUp = (event: KeyboardEvent) => {
      syncShortcutModifierStateFromKeyboardEvent(event);
    };
    const onWindowBlur = () => {
      clearShortcutModifierState();
    };

    window.addEventListener("keydown", onWindowKeyDown, true);
    window.addEventListener("keyup", onWindowKeyUp, true);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("keydown", onWindowKeyDown, true);
      window.removeEventListener("keyup", onWindowKeyUp, true);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, []);

  useEffect(() => {
    const onMenuAction = window.desktopBridge?.onMenuAction;
    if (typeof onMenuAction !== "function") {
      return;
    }

    const unsubscribe = onMenuAction((action) => {
      if (action === "open-settings") {
        void navigate({ to: "/settings" });
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [navigate]);

  return (
    <div
      className="retro-app-window flex h-dvh min-h-0 flex-col"
      data-terminal-open={activeTerminalState.terminalOpen ? "true" : undefined}
      style={
        activeTerminalState.terminalOpen
          ? ({
              "--retro-active-terminal-height": `${activeTerminalState.terminalHeight}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <header className="retro-app-chrome drag-region shrink-0">
        <div className="retro-window-titlebar retro-global-titlebar">
          <div className="retro-title-control-bay" aria-hidden="true">
            <span className="retro-title-icon">▤</span>
          </div>
          <span className="retro-window-title truncate">{APP_BASE_NAME} - Codex Session</span>
          <span
            className="retro-title-control-bay retro-title-control-bay-spacer"
            aria-hidden="true"
          />
        </div>
        <div className="retro-menu-bar retro-global-menu">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Session</span>
          <span>Tools</span>
          <span>Help</span>
        </div>
        <div className="retro-main-toolbar">
          <RetroToolbarButton
            icon={FolderPlusIcon}
            label="New Thread"
            disabled={!defaultProjectRef}
            onClick={handleNewThreadClick}
          />
          <RetroToolbarButton
            icon={RefreshCwIcon}
            label="Refresh"
            onClick={() => location.reload()}
          />
          <RetroToolbarButton
            icon={SearchIcon}
            label="Search"
            onClick={() => setCommandPaletteOpen(true)}
          />
          <RetroToolbarButton
            icon={SettingsIcon}
            label="Settings"
            onClick={() => void navigate({ to: "/settings" })}
          />
          <div className="retro-toolbar-separator" />
          <RetroToolbarButton
            icon={TerminalSquareIcon}
            label="Terminal"
            onClick={() => dispatchRetroCommand("terminal")}
          />
          <RetroToolbarButton
            icon={FileTextIcon}
            label="Diff"
            onClick={() => dispatchRetroCommand("diff")}
          />
          <RetroToolbarButton
            icon={OctagonIcon}
            label="Interrupt"
            onClick={() => dispatchRetroCommand("interrupt")}
          />
          <div className="retro-toolbar-separator" />
          <RetroToolbarButton icon={MonitorIcon} label="Tasks" disabled />
          <RetroToolbarButton icon={ArchiveIcon} label="Archive" disabled />
          <RetroToolbarButton icon={Trash2Icon} label="Delete" disabled />
        </div>
        <div className="retro-address-bar retro-global-address">
          <span className="retro-address-label">Address</span>
          <span className="retro-address-document" aria-hidden="true">
            ▧
          </span>
          <span className="retro-address-field truncate">retroai://session/active</span>
        </div>
      </header>
      <SidebarProvider
        className="min-h-0! flex-1! border-x border-b border-[#404040] bg-[var(--retro-chrome)] shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#707070]"
        defaultOpen
      >
        <Sidebar
          side="left"
          collapsible="none"
          className="retro-static-sidebar border-r border-[#404040] bg-[var(--retro-chrome)] text-foreground"
        >
          <ThreadSidebar />
        </Sidebar>
        {children}
      </SidebarProvider>
      <footer className="retro-final-statusbar">
        <span className="retro-final-statusbar-cell flex-1">Done</span>
        <span className="retro-final-statusbar-cell">
          <span className="retro-status-globe" aria-hidden="true">
            ●
          </span>
          Connected to server
        </span>
        <span className="retro-final-statusbar-cell">Provider: Codex</span>
      </footer>
    </div>
  );
}
