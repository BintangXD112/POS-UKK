export type Role = {
    id_role: number;
    nama_role: 'super admin' | 'admin' | 'kasir';
};

export type User = {
    id_user: number;
    username: string;
    nama_lengkap: string;
    id_sekolah: number;
    role: Role;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type SharedProps = {
    auth: Auth;
    flash: {
        success?: string;
        error?: string;
    };
};
