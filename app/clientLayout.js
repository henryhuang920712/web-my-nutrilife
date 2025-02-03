'use client'; // This is a client component

import { useState } from 'react';
import { Navbar, GetStartedButton } from '@/components/navbar';
import LoginModal from '@/components/modal/loginModal';
import RegisterModal from '@/components/modal/registerModal';
import AuthProvider from '@/components/authProvider';
import { usePathname } from 'next/navigation'

import Home from './page';
export default function ClientLayout({ children }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [navigatePath, setNavigatePath] = useState('');
    const pathName = usePathname();


    return (
        <>
            <AuthProvider>
                <Navbar isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}
                    isRegisterModalOpen={isRegisterModalOpen} setIsRegisterModalOpen={setIsRegisterModalOpen} />
            </AuthProvider>
            {pathName === '/' ? <Home setIsLoginModalOpen={setIsLoginModalOpen} setNavigatePath={setNavigatePath} /> : children}
            <LoginModal isModalOpen={isLoginModalOpen} setIsModalOpen={setIsLoginModalOpen}
                navigateToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
                navigatePath={navigatePath} />
            <RegisterModal isModalOpen={isRegisterModalOpen} setIsModalOpen={setIsRegisterModalOpen} />
        </>
    );
}
