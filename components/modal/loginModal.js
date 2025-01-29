import Modal from "./modal";
import { useSession, signIn } from "next-auth/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';

const LoginModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [response, setResponse] = useState(null);

    const handleOpenModal = () => setIsModalOpen(true);
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
        <div>
            <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={handleOpenModal}
            >
                Login
            </button>

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
                                    onClick={() => setResponse(null)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="w-full p-4">
                        <div className="w-full relative mb-4">
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-100 px-4 py-1 text-center text-sm text-gray-500 -mt-8">
                                or
                            </span>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            onClick={async () => await signIn("google")}
                            className="w-full mx-2 py-3 px-6 flex items-center justify-center rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 mb-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="mr-2" viewBox="0 0 256 262">
                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            <span className="text-center w-full">Sign in with Google</span>
                        </button>

                        {/* GitHub Sign In Button */}
                        <button
                            onClick={async () => await signIn("github")}
                            className="w-full mx-2 py-3 px-6 flex items-center justify-center rounded-full border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 mb-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="mr-2" viewBox="0 0 16 16">
                                <path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
                            </svg>
                            <span className="text-center w-full">Sign in with Github</span>
                        </button>
                    </div>
                    {/* Submit Button */}
                    <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default LoginModal;
