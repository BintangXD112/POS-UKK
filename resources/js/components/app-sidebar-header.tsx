import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" />
                {breadcrumbs.length > 0 && (
                    <div className="h-4 w-px bg-border/60 mx-1" />
                )}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
