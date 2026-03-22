import './Register.css'
import { useState } from "react";
import back from '../../../assets/back.png'
import { authApi } from '../../api.js'

function Register({ onNavigate }) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rpassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Введите email";
    if (!formData.password.trim()) newErrors.password = "Введите пароль";
    else if (formData.password.length < 8) newErrors.password = "Минимум 8 символов";
    if (!formData.rpassword.trim()) newErrors.rpassword = "Повторите пароль";
    else if (formData.password !== formData.rpassword) newErrors.rpassword = "Пароли не совпадают";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register(formData.email, formData.password, formData.rpassword);
      localStorage.setItem("token", data.access_token);
      onNavigate("home");
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='bigC'>
        <img src={back} alt='' className='img1' />
      </div>
      <button className='back-btn' onClick={() => onNavigate("back")}>‹ Назад</button>
      <div className='containerRegister'>
        <div className='text1'>
          <h1>Создайте свой аккаунт</h1>
        </div>

        {errors.server && (
          <span className="error" style={{ color: "red", textAlign: "center" }}>
            {errors.server}
          </span>
        )}

        <form className='form'>
          <label className='label'>
            Email
            <input type="email" name="email" className='input' onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>

          <label className='label'>
            Пароль
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className='input'
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </label>

          <label className='label'>
            Повторите пароль
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="rpassword"
                className='input'
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-btn">
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.rpassword && <span className="error">{errors.rpassword}</span>}
          </label>
        </form>

        <div>
          <button className='button' onClick={handleSubmit} disabled={loading}>
            {loading ? "Загрузка..." : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;