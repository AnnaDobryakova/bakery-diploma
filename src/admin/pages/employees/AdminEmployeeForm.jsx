import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const initialValues = {
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    position: "",
};

const phoneRegExp = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;


const userSchema = yup.object().shape({
    firstName: yup.string().required("Обязательное поле"),
    lastName: yup.string().required("Обязательное поле"),
    age: yup.number().required("Обязательное поле").positive("Возраст должен быть положительным").integer("Возраст должен быть целым числом"),
    phone: yup.string().required("Обязательное поле").matches(phoneRegExp, "Неверный формат телефона"),
    email: yup.string().email("Неверный формат email").required("Обязательное поле"),
    position: yup.string().required("Обязательное поле"),
});

const AdminEmployeeForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log("Form values:", values);
    }

    return (
        <Box m="20px">
            <Header title="ДОБАВИТЬ СОТРУДНИКА" subtitle="Форма для добавления нового сотрудника" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}>
                            <TextField 
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Имя"
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.firstName && !!errors.firstName}
                                helperText={touched.firstName && errors.firstName}
                                sx={{ gridColumn: "span 2"}}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Фамилия"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.lastName && !!errors.lastName}
                                helperText={touched.lastName && errors.lastName}
                                sx={{ gridColumn: "span 2"}}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                label="Возраст"
                                name="age"
                                type="number"
                                value={values.age}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.age && !!errors.age}
                                helperText={touched.age && errors.age}
                                sx={{ gridColumn: "span 4"}}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Телефон"
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.phone && !!errors.phone}
                                helperText={touched.phone && errors.phone}
                                sx={{ gridColumn: "span 4"}}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 4"}}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"                                    
                                type="text"
                                label="Должность"
                                name="position"
                                value={values.position}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.position && !!errors.position}
                                helperText={touched.position && errors.position} 
                                sx={{ gridColumn: "span 4"}}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Добавить сотрудника
                            </Button>
                        </Box>

                    </form>
                )}

            </Formik>
        </Box>
    );
}

export default AdminEmployeeForm;