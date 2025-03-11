import './plain_form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { validator } from '../../utils/validator';
import { savePlainFormData } from '../../state/features/plain-form/plainFormSlice';
import { IValidatedData, IError } from '../../types/interface';

export default function PlainForm() {
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [TCError, setTCError] = useState('');
  const [fileError, setFileError] = useState('');

  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const upload_picture = (
      form.elements.namedItem('upload_picture') as HTMLInputElement
    ).files;

    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      age: +(form.elements.namedItem('age') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      password1: (form.elements.namedItem('password1') as HTMLInputElement)
        .value,
      password2: (form.elements.namedItem('password2') as HTMLInputElement)
        .value,
      TC: (form.elements.namedItem('TC') as HTMLInputElement).checked,
      file: upload_picture ? upload_picture[0] : null,
      country: (form.elements.namedItem('country') as HTMLSelectElement).value,
      gender: (form.elements.namedItem('gender') as HTMLInputElement).value,
    };
    const validationResult = await validator(data);
    console.log(validationResult);
    if ('error' in (validationResult as IValidatedData | IError)) {
      const { error } = validationResult as IError;
      console.log(error);
      setNameError(error.name);
      setAgeError(error.age);
      setEmailError(error.email);
      setPasswordError(error.password1);
      setConfirmPasswordError(error.password2);
      setTCError(error.TC);
      setFileError(error.file);
    }

    if ('data' in (validationResult as IValidatedData | IError)) {
      const { data } = validationResult as IValidatedData;
      console.log(data);
      dispatch(savePlainFormData(data));
      navigate('/', { state: { from: '/uncontrolled_form' } });
    }
  };

  return (
    <div className="plain__form">
      <h1>The Plain Form</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <label htmlFor="name" className="form__label">
            Name
            <input id="name" type="text" className="form__input" />
          </label>
          <p id="name-error" className="form__error">
            {nameError}
          </p>
        </div>
        <div className="form__item">
          <label htmlFor="age" className="form__label">
            Age
            <input
              id="age"
              type="number"
              className="form__input"
              defaultValue={0}
            />
          </label>
          <p id="age-error" className="form__error">
            {ageError}
          </p>
        </div>
        <div className="form__item">
          <label htmlFor="email" className="form__label">
            Email
            <input id="email" type="email" className="form__input" />
          </label>
          <p id="email-error" className="form__error">
            {emailError}
          </p>
        </div>
        <div className="form__item">
          <label htmlFor="password" className="form__label">
            Password
            <input id="password1" type="password" className="form__input" />
          </label>
          <p id="password-error" className="form__error password">
            {passwordError}
          </p>
        </div>
        <div className="form__item">
          <label htmlFor="password2" className="form__label">
            Confirm Password
            <input id="password2" type="password" className="form__input" />
          </label>
          <p id="password2-error" className="form__error">
            {confirmPasswordError}
          </p>
        </div>
        <div className="form__item_radio">
          <label>Gender</label>
          <div className="radio-group">
            <label htmlFor="male">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                defaultChecked
              />
              Male
            </label>
            <label htmlFor="female">
              <input type="radio" id="female" name="gender" value="female" />
              Female
            </label>
          </div>
        </div>
        <div className="form__item_checkbox">
          <label htmlFor="TC">Terms and Conditions</label>
          <input id="TC" type="checkbox" />
          <p id="TC-error" className="form__error">
            {TCError}
          </p>
        </div>
        <div className="form__item">
          <label htmlFor="upload_picture">
            Upload Picture
            <input id="upload_picture" type="file" />
          </label>
          <span id="upload_picture-error" className="form__error">
            {fileError}
          </span>
        </div>
        <div className="form__item">
          <label htmlFor="country">Country</label>
          <select id="country" className="form__input">
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
