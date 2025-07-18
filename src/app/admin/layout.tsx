import React from 'react';
import styles from '@/css/admin-layout.module.css';
import AdminHeader from './components/AdminHeader';
import AdminAuthWrapper from '@/wrapper/AdminAuthWrapper';
import ThemeDiv from '@/components/base/ThemeDiv';
import clsx from 'clsx';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AdminAuthWrapper>
            <ThemeDiv className={clsx("border-none", styles['admin-layout'])}>
                <div className={styles.header}>
                    <AdminHeader />
                </div>
                <div className={styles.main}>{children}</div>
            </ThemeDiv>
        </AdminAuthWrapper>
    );
};

export default AdminLayout;