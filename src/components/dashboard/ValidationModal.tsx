'use client';

import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LoadingButton } from '@mui/lab';
import { Box, styled, Typography } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useRouter } from '@bprogress/next';

// ----------------------------------------------------------------------

const Img = styled('img')(({ theme }) => ({
  width: '350px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Zone = styled('div')(({ theme }) => ({
  width: '500px',
  backgroundColor: theme.palette.grey[200],
  border: '.15rem dashed #8c9196',
  borderRadius: '.625rem',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const baseStyle = {
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
}

interface ValidationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: UserData;
  url: string;
}

// ----------------------------------------------------------------------

export default function ValidationModal({ open, setOpen, user, url }: ValidationModalProps) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        setFiles(acceptedFiles);
      },
      onDropRejected: () => {
        toast.error('Please upload a valid image (png, jpeg, jpg) max 3mb');
      },
      accept: { 'image/png': [], 'image/jpeg': [], 'image/jpg': [] },
      maxFiles: 1,
      maxSize: 3 * 1024 * 1024,
    });

  const hasFile = files.length > 0;

  const handleSubmit = () => {
    setLoading(true);
    let photoData = new FormData();
    photoData.append('photo', files[0]);
    photoData.append('purpose', 'verify');

    axios
      .post(
        `${process.env.NEXT_PUBLIC_IMAGE_SERVER}/user/verify/${user._id}`,
        photoData
      )
      .then(() => {
        setLoading(false);
        toast.success(`ID card snapshoot uploaded successfully`);
        setFiles([]);
        router.refresh();
        setOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
      });
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[36rem] sm:p-6">
                <div className="w-full flex flex-col justify-center items-center text-center">
                  <Typography mb={1} variant="h3">
                    {' '}
                    Identity verification
                  </Typography>
                  <Typography sx={{ px: 4 }} variant="body1">
                    {' '}
                    verify your account now using valid snapshot of personal
                    identity card
                  </Typography>
                  <Img src="https://pipsville-bucket.s3.us-west-004.backblazeb2.com/id-verification.gif" />
                  <Box
                    sx={{
                      width: '100%',
                      px: 2,
                    }}
                  >
                    <Zone
                      {...getRootProps({
                        style,
                        className: `drop-zone ${
                          files && files.length ? 'bg-[#AAF27F]' : ''
                        }`,
                      })}
                    >
                      <input {...getInputProps()} />
                      {files && files.length ? (
                        <>
                          <Typography variant="subtitle2">
                            {files[0].name}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="subtitle2">
                            Click or drop ID here
                          </Typography>
                          <Typography variant="body1">
                            (max size :3mb, *.jpeg and *.png )
                          </Typography>
                        </>
                      )}
                    </Zone>
                    <LoadingButton
                      sx={{ mt: 2 }}
                      disabled={!hasFile}
                      loading={loading}
                      onClick={handleSubmit}
                      fullWidth
                      variant="contained"
                      size="large"
                    >
                      <span>submit </span>
                    </LoadingButton>
                  </Box>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
