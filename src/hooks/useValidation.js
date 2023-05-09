import { useState, useCallback } from 'react';

function useValidation() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (evt) => {
    const input = evt.target;
    const value = input.value;
    const name = input.name;
    console.log(value);
    setValues({ ...values, [name]: value });
    setErrors({...errors, [name]: input.validationMessage});
    setIsValid(input.closest('form').checkValidity());
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    }, 
    [setValues, setErrors, setIsValid]);


  return { values, handleChange, resetForm, errors, isValid};
} 

export default useValidation
