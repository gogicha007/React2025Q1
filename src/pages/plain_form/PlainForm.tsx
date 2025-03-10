import './plain_form.css';
// import { UseSelector } from 'react-redux';

export default function PlainForm() {
  return (
    <div className="plain__form">
      <h1>The Plain Form</h1>
      <form className="form">
        <div className="form__item">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
        </div>
        <div className="form__item">
          <label htmlFor="age">Age</label>
          <input id="surname" type="number" />
        </div>
        <div className="form__item">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
        </div>
        <div className="form__item">
          <label htmlFor="password">Password</label>
          <input id="password1" type="password" />
        </div>
        <div className="form__item">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input id="password2" type="password" />
        </div>
        <div className="form__item_radio">
          <label>Gender</label>
          <div className="radio-group">
            <label htmlFor="male">
              <input type="radio" id="male" name="gender" value="male" />
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
        </div>
        <div className="form__item_upload">
          <label htmlFor="upload_picture">Upload Picture</label>
          <input id="upload_picture" type="file" />
        </div>
        <div className="form__item">
          <label htmlFor="country">Country</label>
          <select>
            <option value="turkey">Turkey</option>
            <option value="usa">USA</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
