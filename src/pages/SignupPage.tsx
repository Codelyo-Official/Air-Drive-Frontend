//signupPage.tsx
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { AlertCircle, ArrowRight, CheckCircle, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/auth';
import { validationSignupSchema } from '../validationSchema/registerSchema';

// Initial values
const initialValues = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password2: '',
  userType: 'regular' as 'regular' | 'owner',
  agreeTerms: false
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [generalError, setGeneralError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      setGeneralError('');

      // Create FormData to match your API
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('password2', values.password2);
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('user_type', values.userType);

      // ✅ Actually call the signup mutation
      await signUp.mutateAsync(formData);
      navigate('/dashboard');

    } catch (error: unknown) {
      console.error('Signup failed:', error);

      // Handle specific field errors from server
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : 'An unknown error occurred';

      if (errorMessage.includes('username')) {
        setFieldError('username', errorMessage);
      } else if (errorMessage.includes('email')) {
        setFieldError('email', errorMessage);
      } else if (errorMessage.includes('password')) {
        setFieldError('password', errorMessage);
      } else {
        // Show general error for other cases
        setGeneralError(errorMessage || 'Signup failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-600">
            Join Air Drive to rent cars or share your own
          </p>
        </div>

        {/* General Error Message */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{generalError}</p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSignupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.username && touched.username
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      placeholder="Enter your username"
                    />
                  </div>
                  <ErrorMessage name="username" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* First Name Field */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.firstName && touched.firstName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      placeholder="John"
                    />
                    <ErrorMessage name="firstName" component="p" className="mt-1 text-xs text-red-600" />
                  </div>

                  {/* Last Name Field */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.lastName && touched.lastName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      placeholder="Doe"
                    />
                    <ErrorMessage name="lastName" component="p" className="mt-1 text-xs text-red-600" />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email && touched.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${values.userType === 'regular'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      onClick={() => setFieldValue('userType', 'regular')}
                    >
                      <div className="text-center">
                        <div className="font-medium">Renter</div>
                        <div className="text-xs text-gray-500">Rent cars</div>
                      </div>
                    </div>
                    <div
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${values.userType === 'owner'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      onClick={() => setFieldValue('userType', 'owner')}
                    >
                      <div className="text-center">
                        <div className="font-medium">Owner</div>
                        <div className="text-xs text-gray-500">Share your car</div>
                      </div>
                    </div>
                  </div>
                  <ErrorMessage name="userType" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password && touched.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-amber-500"
                        }`}
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <Field
                      id="password2"
                      name="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password2 && touched.password2
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-amber-500"
                        }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password2" component="p" className="mt-1 text-xs text-red-600" />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must contain uppercase, lowercase, number, and special character.
                  </p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="font-medium text-amber-600 hover:text-amber-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="font-medium text-amber-600 hover:text-amber-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              <ErrorMessage name="agreeTerms" component="p" className="text-xs text-red-600" />

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Facebook
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <CheckCircle size={20} className="text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Insurance included.</span> Every trip includes liability insurance and protection against physical damage.
            </p>
          </div>
          <div className="flex items-start">
            <CheckCircle size={20} className="text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Vetted renters.</span> We verify driver's licenses and driving records to ensure safety.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;