import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// const initialValues = {
//   firstName: "",
//   lastName: "",
//   age: "",
//   phone: "",
//   email: "",
//   position: "",
// };

const phoneRegExp = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

const userSchema = yup.object().shape({
  firstName: yup.string().required("Обязательное поле"),
  lastName: yup.string().required("Обязательное поле"),
  age: yup
    .number()
    .typeError("Возраст должен быть числом")
    .required("Обязательное поле")
    .positive("Возраст должен быть положительным")
    .integer("Возраст должен быть целым числом"),
  phone: yup
    .string()
    .required("Обязательное поле")
    .matches(phoneRegExp, "Неверный формат телефона"),
  email: yup
    .string()
    .email("Неверный формат email")
    .required("Обязательное поле"),
  position: yup.string().required("Обязательное поле"),
});

const AdminEmployeeForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    position: "",
    });


    useEffect(() => {
    if (!isEditMode) return;

    const fetchEmployee = async () => {
        try {
        const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
        const employee = res.data;

        setInitialValues({
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            age: employee.age || "",
            phone: employee.phone || "",
            email: employee.email || "",
            position: employee.position || "",
        });
        } catch (error) {
        console.error("Ошибка при загрузке сотрудника:", error);
        alert("Не удалось загрузить данные сотрудника");
        }
    };

    fetchEmployee();
    }, [id, isEditMode]);

  const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
  try {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      age: Number(values.age),
      phone: values.phone.trim(),
      email: values.email.trim(),
      position: values.position,
    };

    if (isEditMode) {
      await axios.put(`http://localhost:5000/api/employees/${id}`, payload);
    } else {
      await axios.post("http://localhost:5000/api/employees", {
        ...payload,
        status: "Активен",
      });
      resetForm();
    }

    navigate("/admin/employees");
  } catch (error) {
    console.error("Ошибка при сохранении сотрудника:", error);
    alert(isEditMode ? "Не удалось обновить сотрудника" : "Не удалось добавить сотрудника");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <Box m="20px">
      <Header
        title={isEditMode ? "РЕДАКТИРОВАТЬ СОТРУДНИКА" : "ДОБАВИТЬ СОТРУДНИКА"}
        subtitle={
            isEditMode
            ? "Форма для редактирования данных сотрудника"
            : "Форма для добавления нового сотрудника"
        }
      />

      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
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
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Возраст"
                name="age"
                value={values.age}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.age && !!errors.age}
                helperText={touched.age && errors.age}
                sx={{ gridColumn: "span 4" }}
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
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                select
                fullWidth
                variant="filled"
                label="Должность"
                name="position"
                value={values.position}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.position && !!errors.position}
                helperText={touched.position && errors.position}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="Администратор">Администратор</MenuItem>
                <MenuItem value="Менеджер">Менеджер</MenuItem>
                <MenuItem value="Пекарь">Пекарь</MenuItem>
                <MenuItem value="Кассир">Кассир</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Сохранение..." : "Добавить сотрудника"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminEmployeeForm;