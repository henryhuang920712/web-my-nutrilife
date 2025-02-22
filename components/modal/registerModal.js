import Modal from "./modal";
import { useSession, signIn } from "next-auth/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import DatePicker from "../calendar/datePicker";
import Image from "next/image";

const RegisterModal = ({ isModalOpen, setIsModalOpen }) => {

    const [response, setResponse] = useState(null);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            gender: "",
            birthday: "",
        },
        validateOnChange: false,
        validationSchema: yup.object({
            username: yup.string().required("Required"),
            email: yup.string().email("Invalid email address"),
            password: yup.string().required("Required").min(8, "Must be at least 8 characters"),
            gender: yup.string()
                .oneOf(["M", "F"], "Gender must be either 'M' or 'F'") // Validate gender input (can be 'M' or 'F')
                .required("Required"), // Ensure gender is selected
            birthday: yup.string().required("Required")
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

    return (

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className="flex justify-between h-full items-stretch">
                <div className="w-1/2 bg-slate-200 px-6 relative">
                    <Image
                        src="/login/login_1.jpg"
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
                <div className="w-1/2 py-10 px-6">
                <h2 className="text-3xl font-semibold mb-4 text-center">Create an Account</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm text-gray-700  mb-2"
                            >
                                Your Username
                            </label>
                            <input
                                type="text"
                                name="username" // Important: Match this name with Formik's initialValues
                                id="username"
                                className={`w-full px-4 py-2 border ${formik.errors.username
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } rounded-sm focus:ring-2 ${formik.errors.username
                                        ? "focus:ring-red-500"
                                        : "focus:ring-blue-500"
                                    } focus:outline-none`}
                                placeholder="Enter your user name"
                                onChange={formik.handleChange} // Formik's handleChange
                                value={formik.values.username} // Formik's state value
                                onBlur={formik.handleBlur} // Optional: Tracks when the field loses focus
                            />
                            {formik.touched.username && formik.errors.username && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm text-gray-700 mb-2"
                            >
                                Your email
                            </label>
                            <input
                                type="text"
                                name="email" // Important: Match this name with Formik's initialValues
                                id="email"
                                className={`w-full px-4 py-2 border ${formik.errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } rounded-sm focus:ring-2 ${formik.errors.email
                                        ? "focus:ring-red-500"
                                        : "focus:ring-blue-500"
                                    } focus:outline-none`}
                                placeholder="Enter your email"
                                onChange={formik.handleChange} // Formik's handleChange
                                value={formik.values.email} // Formik's state value
                                onBlur={formik.handleBlur} // Optional: Tracks when the field loses focus
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm text-gray-700 mb-2"
                            >
                                Your password
                            </label>
                            <input
                                type="text"
                                name="password" // Important: Match this name with Formik's initialValues
                                id="password"
                                className={`w-full px-4 py-2 border ${formik.errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } rounded-sm focus:ring-2 ${formik.errors.password
                                        ? "focus:ring-red-500"
                                        : "focus:ring-blue-500"
                                    } focus:outline-none`}
                                placeholder="Enter your email"
                                onChange={formik.handleChange} // Formik's handleChange
                                value={formik.values.password} // Formik's state value
                                onBlur={formik.handleBlur} // Optional: Tracks when the field loses focus
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="gender" className="block text-sm text-gray-700 mb-2">
                                Your Gender
                            </label>
                            <div className="flex items-center">
                                <label htmlFor="gender-male" className="mr-4">
                                    <input
                                        type="radio"
                                        id="gender-male"
                                        name="gender"
                                        value="M"
                                        onChange={formik.handleChange}
                                        checked={formik.values.gender === 'M'}
                                        className="mr-2"
                                    />
                                    Male
                                </label>
                                <label htmlFor="gender-female">
                                    <input
                                        type="radio"
                                        id="gender-female"
                                        name="gender"
                                        value="F"
                                        onChange={formik.handleChange}
                                        checked={formik.values.gender === 'F'}
                                        className="mr-2"
                                    />
                                    Female
                                </label>
                            </div>
                            {formik.touched.gender && formik.errors.gender && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
                            )}
                        </div>
                        <DatePicker
                            fieldName="birthday" // Name of the field in Formik
                            value={formik.values.birthday} // Current value from Formik's state
                            setFieldValue={formik.setFieldValue} // Update Formik's state
                            className="border border-gray-300 rounded p-2 input-container"
                        />
                        {/* Modal Display */}
                        {response && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                                <div className="bg-white shadow-lg rounded-sm p-6 w-96 text-center">
                                    <p className="text-lg font-semibold text-gray-800">{response.message}</p>
                                    <button
                                        onClick={() => setResponse(null)}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}


export default RegisterModal;