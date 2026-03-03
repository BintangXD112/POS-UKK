import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface UserLike {
    name?: string;
    email?: string;
    nama_lengkap?: string;
    username?: string;
    avatar?: string;
}

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: UserLike;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();
    const displayName = user.nama_lengkap ?? user.name ?? user.username ?? 'User';
    const displaySub = user.username ?? user.email ?? '';

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {displaySub}
                    </span>
                )}
            </div>
        </>
    );
}
