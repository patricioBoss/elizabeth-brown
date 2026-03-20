'use client';

import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { Box, Stack, TextField, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import axios from 'axios';

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  postalCode?: string | number;
  permanentAddress?: string;
}

interface ProfileBlockProps {
  user: UserData;
  url: string;
}

// ----------------------------------------------------------------------

function ProfileBlock({ user, url }: ProfileBlockProps) {
  const [edit, setEdit] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last name required'),
    permanentAddress: Yup.string().min(5, 'Too Short!'),
    postalCode: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      postalCode: user.postalCode ? user.postalCode : '',
      permanentAddress: user.permanentAddress ? user.permanentAddress : '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) =>
      axios
        .post(`/api/user/${user._id}`, values)
        .then((res) => {
          toggleEdit();
          toast.success(res.data.message);
        })
        .catch((err) => {
          if (err.response) {
            toast.error('error, pls try again');
          } else {
            toast.error(err.message);
          }
        }),
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    resetForm,
  } = formik;

  const toggleEdit = () => setEdit((x) => !x);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 5,
        p: 3,
        borderRadius: 2,
        border: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
        height: '100%',
      }}
    >
      <Typography variant="subtitle1">Edit Profile</Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction="column" spacing={2}>
              <TextField
                fullWidth
                label="First name"
                size="small"
                disabled={!edit}
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />

              <TextField
                fullWidth
                label="Last name"
                size="small"
                disabled={!edit}
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                fullWidth
                label="Postal Code"
                size="small"
                disabled={!edit}
                {...getFieldProps('postalCode')}
                error={Boolean(touched.postalCode && errors.postalCode)}
                helperText={touched.postalCode && errors.postalCode}
              />
              <TextField
                fullWidth
                label="Permanent Address"
                size="small"
                disabled={!edit}
                {...getFieldProps('permanentAddress')}
                error={Boolean(
                  touched.permanentAddress && errors.permanentAddress
                )}
                helperText={touched.permanentAddress && errors.permanentAddress}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              {!edit ? (
                <Button size="medium" variant="contained" onClick={toggleEdit}>
                  Edit
                </Button>
              ) : (
                <>
                  <LoadingButton
                    size="medium"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    <span>Submit </span>
                  </LoadingButton>
                  <Button
                    size="medium"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      resetForm();
                      toggleEdit();
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </Box>
  );
}

export default ProfileBlock;
