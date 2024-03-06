import * as yup from 'yup';

export const userValidator=yup.object().shape({
    name:yup.string("name must be string").min(3,"Name must be at least 3 characters").required("name is required"),
    login:yup.string("login must be string").min(3,"login must be at least 3 characters").required("login is required"),
    role_id:yup.number("role must be number").required("role is required"),
})