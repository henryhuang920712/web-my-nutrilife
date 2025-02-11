import Modal from "./modal";
import { useSession, signIn } from "next-auth/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { Terminal, CircleCheck, CircleX, User, LockKeyhole } from "lucide-react"
import Image from "next/image";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { redirect } from 'next/navigation'

const LoginModal = ({ isModalOpen, setIsModalOpen, navigateToRegister, navigatePath = "" }) => {
    const [response, setResponse] = useState(null);

    // const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validateOnChange: false,
        validationSchema: yup.object({
            email: yup.string().email("Invalid email address").required("Required"),
            password: yup.string().required("Required").min(8, "Must be at least 8 characters"),
        }),
        onSubmit: async (values) => {
            try {
                const result = await signIn("credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                });

                if (result.error) {
                    setResponse({ message: "Invalid email or password", status: 400 });
                } else {
                    setResponse({ message: "Login successful!", status: 200 });
                    setTimeout(() => {
                        setIsModalOpen(false); // Close modal on success
                        setResponse(null);
                        // reload the page
                        if (navigatePath) {
                            redirect(navigatePath);
                            // refresh
                            
                        } else {
                            window.location.reload();
                        }
                    }, 1500);
                }

            } catch (error) {
                setResponse({ message: "Something went wrong", status: 500 });
                console.error(error);
            }
        },
    });

    return (

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className="flex justify-between h-full items-stretch">
                <div className="w-1/2 bg-slate-200 px-6 relative">
                    <Image
                        src="/login/login_3.jpg"
                        alt="Description"
                        layout="fill"
                        objectFit="cover"
                    />
                    <Image
                        src="/login/login_2.png"
                        alt="Description"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="w-1/2 py-20 px-6">
                    <h2 className="text-3xl font-semibold mb-4 text-center">Welcome Back</h2>
                    <form onSubmit={formik.handleSubmit}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm mb-2">
                                Your Email
                            </label>
                            <div className="relative w-full">
                                {/* Left-side icon */}
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <User />
                                </div>

                                {/* Input Field */}
                                <input
                                    type="text"
                                    name="email"
                                    id="login-email"
                                    className={`w-full px-10 py-2 border ${formik.errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 ${formik.errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:outline-none`}
                                    placeholder="Enter your email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {/* Validation Error Message */}
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>


                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm mb-2">
                                Your Password
                            </label>
                            <div className="relative w-full">
                                {/* Left-side icon */}
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <LockKeyhole />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="login-password"
                                    className={`w-full px-10 py-2 border ${formik.errors.password ? "border-red-500" : "border-gray-300"} focus:ring-2 ${formik.errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:outline-none`}
                                    placeholder="Enter your password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Error Message Modal */}
                        {response && (<Alert className="p-2 mb-4">
                            {/* <Terminal className="h-4 w-4 flex space-x-2" /> */}
                            <AlertDescription>
                                <div className={`flex space-x-2 ${response.status === 200 ? "text-green-500" : "text-red-500"}`}>
                                {response.status === 200 ? <CircleCheck /> : <CircleX />}
                                <h5>
                                {response.message}
                                </h5>
                                </div>
                                
                            </AlertDescription>
                        </Alert>
                        )}
                        {/* Submit Button */}
                        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600">
                            Login
                        </button>
                        <p className="text-sm text-gray-600 pt-4">
                            Don't have an account?
                            <button onClick={navigateToRegister} className="text-blue-500 hover:underline ps-1">Sign up</button>
                        </p>

                    </form>
                </div>
            </div>
        </Modal>
    );
};
export default LoginModal;
