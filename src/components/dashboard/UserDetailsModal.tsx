'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { fCurrency } from '@/utils/formatNumber';
import plans from '@/helpers/plans';

// ----------------------------------------------------------------------

interface UserRow {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  accountBalance?: number;
  level?: number;
  [key: string]: any;
}

interface UserDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: UserRow;
}

// ----------------------------------------------------------------------

export default function UserDetailsModal({ open, setOpen, user }: UserDetailsModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[3201]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[38rem] sm:p-6">
                <div className=" bg-white shadow">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      User Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Personal details
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Full name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.firstName} {user?.lastName}
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Email address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.email}
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Current Account Balance
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {fCurrency(user?.accountBalance ?? 0)}
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Current Level
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.level} level
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          higest Investment
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.level
                            ? `${plans[user?.level - 1].name}`
                            : 'No Approved Investment yet.'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
