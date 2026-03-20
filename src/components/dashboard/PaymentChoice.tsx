'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PaymentMethods from '@/components/dashboard/payment/PaymentMethods';

// ----------------------------------------------------------------------

interface PaymentDetails {
  capital: string;
  currency: string;
  stock: string;
  planId: number;
}

interface User {
  _id: string;
  [key: string]: unknown;
}

interface PaymentChoiceProps {
  user: User;
  details: PaymentDetails;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// ----------------------------------------------------------------------

export default function PaymentChoice({ user, details, open, setOpen }: PaymentChoiceProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1201]" onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-[28rem] sm:p-6">
                <div className="w-full flex flex-col justify-center items-center p-4 text-center">
                  <PaymentMethods details={details} user={user} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
