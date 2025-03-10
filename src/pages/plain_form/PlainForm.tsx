import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import './plain_form.css';
import { useNavigate } from 'react-router';
import { validator } from '../../utils/validator';

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const upload_picture = (
      form.elements.namedItem('upload_picture') as HTMLInputElement
    ).files;
    const country = (form.elements.namedItem('country') as HTMLSelectElement)
      .value;
    console.log(country);
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
      gender: (form.elements.namedItem('gender') as HTMLInputElement).value,
    };
    console.log(data);
    const error = validator(data);
    if (error) {
      setNameError(error.name);
      setAgeError(error.age);
      setEmailError(error.email);
      setPasswordError(error.password1);
      setConfirmPasswordError(error.password2);
      setTCError(error.TC);
      setFileError(error.file);
    } else navigate('/');
  };
  return (
    <div className="plain__form">
      <h1>The Plain Form</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <label htmlFor="name">
            Name
            <input id="name" type="text" />
          </label>
          <p className="form__error">{nameError}</p>
        </div>
        <div className="form__item">
          <label htmlFor="age">
            Age
            <input id="age" type="number" />
          </label>
          <p className="form__error">{ageError}</p>
        </div>
        <div className="form__item">
          <label htmlFor="email">
            Email
            <input id="email" type="email" />
          </label>
          <p className="form__error">{emailError}</p>
        </div>
        <div className="form__item">
          <label htmlFor="password">
            Password
            <input id="password1" type="password" />
          </label>
          <p className="form__error password">{passwordError}</p>
        </div>
        <div className="form__item">
          <label htmlFor="confirm_password">
            Confirm Password
            <input id="password2" type="password" />
          </label>
          <p className="form__error">{confirmPasswordError}</p>
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
          <p className="form__error">{TCError}</p>
        </div>
        <div className="form__item">
          <label htmlFor="upload_picture">
            Upload Picture
            <input id="upload_picture" type="file" />
          </label>
          <span className="form__error">{fileError}</span>
        </div>
        <div className="form__item">
          <label htmlFor="country">Country</label>
          <select id="country">
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
