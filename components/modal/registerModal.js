import Modal from "./modal";
import { useSession, signIn } from "next-auth/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';

const RegisterModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [response, setResponse] = useState(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
        },
        validateOnChange: false,
        validationSchema: yup.object({
            firstName: yup.string().required("Required"),
            lastName: yup.string().required("Required"),
            username: yup.string().required("Required"),
            email: yup.string().email("Invalid email address"),
            password: yup.string().required("Required").min(8, "Must be at least 8 characters")
        }),
        onSubmit: async (values) => {
            try {
                values.role = "credentialed_user";
                // connect to /api/user
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                const status = response.status;
                if (status == 400) {
                    formik.setFieldError('email', 'Username or email already exists');
                    formik.setFieldError('username', 'Username or email already exists');
                }
                const data = await response.json();
                data.status = status;
                setResponse(data);

            } catch (error) {
                // Handle errors
                console.error(error.message);
                console.log(response);
            }
        },
    });

    const handleRegister = (e) => {
        e.preventDefault();
        // Handle registration logic here (e.g., API call)
        console.log("Registration successful!");
        setIsModalOpen(false);
    };

    return (
        <div className="">
            <button
                className="px-4 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={handleOpenModal}
            >
                Register
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4 flex space-x-4">
                        <div className="mb-4">
                            <label
                                htmlFor="firstName"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName" // Important: Match this name with Formik's initialValues
                                id="firstName"
                                className={`w-full px-4 py-2 border ${formik.errors.firstName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-lg focus:ring-2 ${formik.errors.firstName
                                        ? "focus:ring-red-500"
                                        : "focus:ring-blue-500"
                                    } focus:outline-none`}
                                placeholder="Enter your full name"
                                onChange={formik.handleChange} // Formik's handleChange
                                value={formik.values.firstName} // Formik's state value
                                onBlur={formik.handleBlur} // Optional: Tracks when the field loses focus
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                            )}
                        </div>
                        <div className="">
                            <label htmlFor="lastname" className="block text-gray-700 font-medium mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
            </Modal>
        </div>
    );
}


export default RegisterModal;