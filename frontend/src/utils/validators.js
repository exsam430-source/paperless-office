import * as yup from 'yup';

/**
 * Login validation schema
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

/**
 * Register validation schema
 */
export const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string().required('Role is required'),
  department: yup.string().required('Department is required'),
});

export const departmentSchema = yup.object({
  name: yup.string().required('Department name is required'),
  code: yup.string().required('Department code is required'),
  description: yup.string(),
});

/**
 * File creation validation schema
 */

export const fileCreationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),

  fileType: yup
    .mixed()
    .required('File type is required')
    .test('fileType', 'File type is required', (v) => {
      if (!v) return false;
      if (typeof v === 'string') return v.length > 0;
      // react-select object
      return !!v.value;
    }),

  department: yup
    .mixed()
    .required('Department is required')
    .test('department', 'Department is required', (v) => {
      if (!v) return false;
      if (typeof v === 'string') return v.length > 0;
      // react-select object
      return !!v._id;
    }),
});