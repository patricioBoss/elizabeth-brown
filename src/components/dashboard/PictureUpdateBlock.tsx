'use client';

import React, { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import CopyClipboard from './CopyClipboard';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: 'hidden',
  height: '100%',
}));

const ImageInputStyle = styled('input')(() => ({
  '&:hover > div': {
    opacity: 1,
  },
}));

// ----------------------------------------------------------------------

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
  imageUrl?: string;
  email?: string;
  country?: string;
  state?: string;
}

interface PictureUpdateBlockProps {
  user: UserData;
  url: string;
}

// ----------------------------------------------------------------------

function PictureUpdateBlock({ user, url }: PictureUpdateBlockProps) {
  const [error, setError] = useState('');
  const [progressInfo, setProgressInfo] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [progressLoading, setProgressLoading] = useState(false);
  const router = useRouter();

  const checkFileSize = useCallback((file: File) => {
    if (Math.floor(file.size / 1024 / 1024) <= 3) return true;
    return false;
  }, []);

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!checkFileSize(e.target.files[0])) {
        setError('max size exceeded');
        return;
      }
      setError('');
      setProgressLoading(true);
      let photoData = new FormData();
      photoData.append('photo', e.target.files[0]);
      photoData.append('purpose', 'question');

      const config = {
        onUploadProgress: (progressEvent: any) => {
          const { loaded, total } = progressEvent;
          setProgressInfo(Math.floor((loaded * 100) / total));
        },
      };

      axios
        .post(
          `${process.env.NEXT_PUBLIC_IMAGE_SERVER}/user/photo/${user._id}`,
          photoData,
          config
        )
        .then((res) => {
          setProgressLoading(false);
          router.refresh();
          toast.success(`img update successful`);
        })
        .catch((err) => {
          setProgressLoading(false);
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.message);
          }
        });
    }
  };

  const isClient = typeof window !== 'undefined';

  return (
    <RootStyle className=" mx-auto">
      <Stack direction="column" justifyContent="space-between">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="my-3 upload-img overflow-hidden rounded-full h-[8.6875rem] w-[8.6875rem] flex justify-center items-center text-center relative">
            <img
              src={imageUrl ? imageUrl : user.imageUrl}
              className="absolute inset-0"
              alt="profile"
            />
            {!progressLoading ? (
              <>
                {' '}
                <div className="flex justify-center bg-[#0000003a] items-center w-full h-full absolute top-0 left-0">
                  <p className="mb-0 text-white">Upload image</p>
                </div>
                <ImageInputStyle
                  className="opacity-0 absolute top-0 right0 w-full h-full cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={handleImgChange}
                />
              </>
            ) : (
              <BorderLinearProgress
                variant="determinate"
                value={progressInfo}
              />
            )}
          </div>
          {error && (
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              {error}
            </Typography>
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            mx: 'auto',
            display: 'block',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          Allowed *.jpeg, *.jpg, *.png, *.gif
          <br /> max size of 2mb
        </Typography>
        <Typography mt={2} variant="subtitle2">
          Other info
        </Typography>
        <Stack spacing={1} direction={'row'}>
          <Typography variant="subtitle2">email</Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Stack>
        <Stack spacing={1} direction={'row'}>
          <Typography variant="subtitle2">country</Typography>
          <Typography variant="body2">{user.country}</Typography>
        </Stack>
        <Stack spacing={1} direction={'row'}>
          <Typography variant="subtitle2">State</Typography>
          <Typography variant="body2">{user.state}</Typography>
        </Stack>
        <Typography mt={3} variant="subtitle2">
          Referral:{' '}
        </Typography>
        <CopyClipboard
          value={`${isClient ? window.location.hostname : ''}/register?ref=${
            user._id
          }`}
          size="small"
          disabled
        />
      </Stack>
    </RootStyle>
  );
}

export default PictureUpdateBlock;
