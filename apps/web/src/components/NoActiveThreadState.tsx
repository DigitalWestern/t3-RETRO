import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { SidebarInset } from "./ui/sidebar";

export function NoActiveThreadState() {
  return (
    <SidebarInset className="h-full min-h-0 overflow-hidden overscroll-y-none bg-[var(--retro-chrome)] text-foreground">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[var(--retro-chrome)] p-1">
        <div className="retro-section-panel flex min-h-0 flex-1 flex-col">
          <div className="retro-section-header retro-thread-header flex min-h-[34px] items-center gap-2 px-3">
            <span className="text-lg" aria-hidden="true">
              ▧
            </span>
            <span className="min-w-0 truncate text-base font-bold">No active thread</span>
          </div>
          <Empty className="flex-1">
            <div className="retro-empty-panel w-full max-w-lg px-8 py-10">
              <EmptyHeader className="max-w-none">
                <EmptyTitle className="text-foreground text-xl">
                  Pick a thread to continue
                </EmptyTitle>
                <EmptyDescription className="mt-2 text-sm text-muted-foreground/78">
                  Select an existing thread or create a new one to get started.
                </EmptyDescription>
              </EmptyHeader>
            </div>
          </Empty>
        </div>
      </div>
    </SidebarInset>
  );
}
