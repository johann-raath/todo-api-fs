import { useState } from "react";

export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}

export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

export const getExpiry = () => {
    return sessionStorage.getItem('expires') || null;
}

export function useFormInput(initialValue) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e) {
        setValue(e.target.value);
    }

    return {
        value,
        onChange: handleChange
    };
}

export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('expires');
}

export const setUserSession = (token, user, expires) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expires', expires);
    sessionStorage.setItem('user', JSON.stringify(user));
}

export const validateFields = (fields) => {
    let er = [];
    fields.map((field) => {
        if (field.value.length == 0) {
            er.push({ msg: field.msg })
        }
    });
    return er;
}