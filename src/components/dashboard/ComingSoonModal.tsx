'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

interface ComingSoonModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: any;
}

export default function ComingSoonModal({ open, setOpen, user }: ComingSoonModalProps) {
  const [loading, setLoading] = useState(false);
  const url = `/api/user/${user._id}`;
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const handleRedeemBonus = (bonus: any) => {
    setLoading(true);
    axios
      .post(`/api/user/${user._id}/bonus`, { bonus })
      .then((res) => {
        setLoading(false);
        mutate(url);
        router.refresh();
        setOpen(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error('error redeeming bonus');
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogContent>
        <div className="w-full flex flex-col justify-center items-center p-6 text-center">
          {user.bonus ? (
            <>
              <img src="/img/gift-celebrate.svg" className="w-full sm:w-[90%]" alt="illustration" />
              <h2 className="font-bold text-green-600 text-2xl md:text-4xl mt-2">
                Redeem Gift Price
              </h2>
              <div className="mt-7">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  onClick={() => handleRedeemBonus(user.bonus)}
                >
                  <span>Redeem Bonus</span>
                </LoadingButton>
              </div>
            </>
          ) : (
            <>
              <img src="/img/empty-box.svg" className="w-full sm:w-[90%]" alt="illustration" />
              <h2 className="font-bold text-gray-600 text-2xl md:text-4xl mt-2">No Bonus Price</h2>
              <div className="mt-7">
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
