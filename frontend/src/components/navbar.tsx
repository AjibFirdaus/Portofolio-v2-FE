import React from 'react';
import Modal from './modal';
import useFetchData from '../hooks/fetchData';
import useCheckLogin from '../hooks/fetchCheckLogin';
import useLogin from '../hooks/fetchLogin';

interface NavBarProps {
    scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
    refs: {
        homeRef: React.RefObject<HTMLDivElement>;
        aboutRef: React.RefObject<HTMLDivElement>;
        skillsRef: React.RefObject<HTMLDivElement>;
        projectsRef: React.RefObject<HTMLDivElement>;
        certificatesRef: React.RefObject<HTMLDivElement>;
        contactRef: React.RefObject<HTMLDivElement>;
    };
}

const NavBar: React.FC<NavBarProps> = ({ scrollToSection, refs }) => {
    const { isLoggedIn, checkingLogin } = useCheckLogin();
    const { data } = useFetchData('home');
    const handleCloseLogin = () => {
        const modal = document.getElementById("Login");
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleLogin
    } = useLogin(handleCloseLogin);

    if (checkingLogin) return <div className='flex justify-center'><span className="loading loading-bars loading-lg h-screen"></span></div>;
    if (!data) return <p>No data available</p>;

    const openMenu = () => {
        const modal = document.getElementById("Menu");
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    const openLogin = () => {
        const modal = document.getElementById("Login");
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    const openLogout = () => {
        const modal = document.getElementById("Logout");
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    const handleClose = () => {
        const modal = document.getElementById("Menu");
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    const removeToken = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    const handleCloseLogout = () => {
        const modal = document.getElementById("Logout");
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    if ('name' in data) {
        return (
            <div className="navbar w-screen fixed bg-black z-50">
                <div className="flex-1" onClick={() => {
                    scrollToSection(refs.homeRef);
                }}>
                    <a className="btn btn-ghost text-xl">{data.name}</a>
                </div>
                <div className="flex-none mr-3">
                    <button className="btn btn-square btn-ghost" onClick={openMenu}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-5 w-5 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                        </svg>
                    </button>
                    {!isLoggedIn && (
                        <button className="btn btn-square btn-ghost mr-2" onClick={openLogin}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                            </svg>
                        </button>
                    )}
                    {isLoggedIn && (
                        <button className="btn btn-square btn-ghost mr-2" onClick={openLogout}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                            </svg>
                        </button>
                    )}
                </div>
                <Modal id="Login" title="Login as Admin" onClose={handleClose}>
                    <div className="flex flex-col gap-2">
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input type="text" className="grow" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                            </svg>
                            <input type="password" className="grow" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <button className="btn btn-outline" onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                        {error && <p className='text-red-700'>{error}</p>}
                    </div>
                </Modal>
                <Modal id="Logout" title="Logout" onClose={handleCloseLogout}>
                    <div className="flex flex-col gap-2">
                        <h3 className='text-red-300'>Are you sure you want to log out?</h3>
                        <button className="btn btn-outline" onClick={removeToken}>Logout</button>
                        {error && <p className='text-red-700'>{error}</p>}
                    </div>
                </Modal>
                <Modal id="Menu" title="Where are you going?" onClose={handleClose}>
                    <div className="flex flex-col gap-2">
                        <button
                            className="btn btn-outline w-full"
                            onClick={() => {
                                scrollToSection(refs.homeRef);
                                handleClose();
                            }}
                        >
                            Home
                        </button>
                        <button
                            className="btn btn-outline w-full"
                            onClick={() => {
                                scrollToSection(refs.aboutRef);
                                handleClose();
                            }}
                        >
                            About
                        </button>
                        {/* <button
                        className="btn btn-outline w-full"
                        onClick={() => {
                            scrollToSection(refs.skillsRef);
                            handleClose();
                        }}
                    >
                        Skills
                    </button> */}
                        <button
                            className="btn btn-outline w-full"
                            onClick={() => {
                                scrollToSection(refs.projectsRef);
                                handleClose();
                            }}
                        >
                            Projects
                        </button>
                        {/* <button
                        className="btn btn-outline w-full"
                        onClick={() => {
                            scrollToSection(refs.certificatesRef);
                            handleClose();
                        }}
                    >
                        Certificates
                    </button> */}
                        <button
                            className="btn btn-outline w-full"
                            onClick={() => {
                                scrollToSection(refs.contactRef);
                                handleClose();
                            }}
                        >
                            Contact
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }


}

export default NavBar;