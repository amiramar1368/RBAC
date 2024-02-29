import * as yup from 'yup';

export const userValidator=yup.object().shape({
    name:yup.string("name must be string").required("name is required"),
    login:yup.string("login must be string").required("login is required"),
    role_id:yup.number("role must be number").required("role is required"),
    password:yup.string().test("len","password must be at least 3 characters",val=>val.length>=3).required()
})