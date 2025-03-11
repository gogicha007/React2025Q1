import '../plain_form/plain_form.css';
import { useNavigate } from 'react-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertFileToBase64 } from '../../utils/convertFile';

const schema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .regex(/^[A-Z]/, { message: 'First letter of name must be uppercase' }),
    age: z.number().min(0, { message: 'No negative values' }),
    email: z.string().email({ message: 'Invalid email' }),
    password1: z
      .string()
      .min(4, { message: 'Password must be at least 4 characters' })
      .regex(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/,
        {
          message:
            'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
        }
      ),
    password2: z.string(),
    gender: z.string(),
    TC: z
      .boolean()
      .refine((val) => val === true, { message: 'You must accept the T&C' }),
    file: z
      .any()
      .refine((file) => file !== undefined, {
        message: 'You must upload a file',
      })
      .refine((file) => file?.size >= 2000, {
        message: 'File size must be more than 2KB',
      })
      .refine((file) => ['image/jpeg', 'image/png'].includes(file?.type), {
        message: 'File must be of type jpeg or png',
      }),
    country: z.string(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: 'Passwords do not match',
    path: ['password2'],
  });

type FormFields = z.infer<typeof schema>;

export default function HookForm() {
  const navigate = useNavigate();
  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    let base64file: string | null = null;
    try {
      base64file = await convertFileToBase64(data.file);
    } catch (error) {
      console.error(error);
      setValue('file', null, { shouldValidate: true });
      return;
    }
    const validationResult = { ...data, file: base64file };
    console.log(validationResult);
    navigate('/', { state: { from: 'Hook Form' } });
  };

  return (
    <div className="hook-form">
      <h1>The Hook Form</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__item">
          <label htmlFor="name" className="form__label">
            Name
            <input
              {...register('name')}
              id="name"
              type="text"
              className="form__input"
            />
          </label>
          <p className="form__error">{errors?.name?.message}</p>
        </div>
        <div className="form__item">
          <label htmlFor="age" className="form__label">
            Age
            <input
              {...register('age')}
              id="age"
              type="number"
              className="form__input"
              defaultValue={0}
            />
          </label>
          <p className="form__error">{errors?.age?.message}</p>
        </div>
        <div className="form__item">
          <label htmlFor="email" className="form__label">
            Email
            <input
              {...register('email')}
              id="email"
              type="email"
              className="form__input"
            />
          </label>
          <p className="form__error">{errors?.email?.message}</p>
        </div>
        <div className="form__item">
          <label htmlFor="password" className="form__label">
            Password
            <input
              {...register('password1')}
              id="password1"
              type="password"
              className="form__input"
            />
          </label>
          <p className="form__error">{errors?.password1?.message}</p>
        </div>
        <div className="form__item">
          <label htmlFor="password2" className="form__label">
            Confirm Password
            <input
              {...register('password2')}
              id="password2"
              type="password"
              className="form__input"
            />
          </label>
          <p className="form__error">{errors?.password2?.message}</p>
        </div>
        <div className="form__item_radio">
          <label>Gender</label>
          <div className="radio-group">
            <label htmlFor="male">
              <input
                {...register('gender')}
                type="radio"
                id="male"
                name="gender"
                value="male"
                defaultChecked
              />
              Male
            </label>
            <label htmlFor="female">
              <input
                {...register('gender')}
                type="radio"
                id="female"
                name="gender"
                value="female"
              />
              Female
            </label>
          </div>
        </div>
        <div className="form__item_checkbox">
          <label htmlFor="TC">Terms and Conditions</label>
          <input {...register('TC')} id="TC" type="checkbox" />
          <p className="form__error">{errors?.TC?.message}</p>
        </div>
        <div className="form__item">
          <label htmlFor="upload_picture">
            Upload Picture
            <input {...register('file')} id="upload_picture" type="file" />
          </label>
          <p className="form__error">
            {typeof errors?.file?.message === 'string'
              ? errors.file.message
              : ''}
          </p>
        </div>
        <div className="form__item">
          <label htmlFor="country">Country</label>
          <select {...register('country')} id="country" className="form__input">
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
