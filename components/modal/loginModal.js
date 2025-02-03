import Modal from "./modal";
import { useSession, signIn } from "next-auth/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const LoginModal = ({ isModalOpen, setIsModalOpen, navigateToRegister, navigatePath="" }) => {
    const [response, setResponse] = useState(null);
    const router = useRouter();
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
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={formik.handleSubmit}>
                {/* Email Input */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        className={`w-full px-4 py-2 border ${formik.errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 ${formik.errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:outline-none`}
                        placeholder="Enter your email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className={`w-full px-4 py-2 border ${formik.errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 ${formik.errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:outline-none`}
                        placeholder="Enter your password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                </div>

                {/* Error Message Modal */}
                {response && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
                            <p className={`text-lg font-semibold ${response.status === 200 ? "text-green-600" : "text-red-600"}`}>
                                {response.message}
                            </p>
                            <button
                                onClick={() => {
                                    setResponse(null);    
                                    if (navigatePath && response.status === 200) {
                                        setResponse(null);
                                        router.push(navigatePath);
                                    }
                                    setResponse(null);
                                }}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {/* Submit Button */}
                <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Login
                </button>
                <p className="text-sm text-gray-600 pt-4">
                    Don't have an account?
                    <button onClick={navigateToRegister} className="text-blue-500 hover:underline ps-1">Sign up</button>
                </p>

            </form>
        </Modal>
    );
};
export default LoginModal;
