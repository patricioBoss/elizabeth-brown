'use client';

import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from '@bprogress/next';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

interface UserForm {
  email: string;
  password: string;
}

// ----------------------------------------------------------------------

const AdminLoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserForm>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    axios
      .post('/api/auth/login', user)
      .then((res) => {
        if (res.data.data.role === 'Admin') {
          router.push('/admin/home');
          toast.success('login successful');
        } else {
          toast.error('UnAuthorized');
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <section className="md:h-screen py-36 flex items-center bg-[#3182c1] bg-no-repeat bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      <div className="container">
        <div className="flex justify-center">
          <div className="max-w-[400px] w-full m-auto p-6 bg-white shadow-md  rounded-md">
            <a href="index.html">
              <img
                src="assets/images/logo-icon-64.png"
                className="mx-auto"
                alt=""
              />
            </a>
            <h5 className="my-6 font-bold text-2xl">Admin Login</h5>
            <form className="text-left" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1">
                <div className="mb-4 flex flex-col">
                  <label className="font-semibold" htmlFor="LoginEmail">
                    Email Address:
                  </label>
                  <input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:outline-none focus:ring-inset focus:ring-[#428bc3] sm:text-sm sm:leading-6 mt-3"
                    placeholder="Enter Email"
                  />
                </div>

                <div className="mb-4 flex flex-col">
                  <label className="font-semibold" htmlFor="LoginPassword">
                    Password:
                  </label>
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:outline-none focus:ring-inset focus:ring-[#428bc3] sm:text-sm sm:leading-6 mt-3"
                    placeholder="Enter Password"
                  />
                </div>

                <div className="flex justify-between mb-4">
                  <p className="text-slate-400 mb-0">
                    <Link href="/reset-password" className="text-slate-400">
                      Forgot password ?
                    </Link>
                  </p>
                </div>

                <div className="mb-4">
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    <span> Login</span>
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
