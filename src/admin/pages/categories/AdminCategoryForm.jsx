import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../../api/categoriesApi";

const initialValues = {
  name: "",
  code: "",
  description: "",
};

const categorySchema = yup.object().shape({
  name: yup.string().required("Обязательное поле"),
  code: yup
    .string()
    .required("Обязательное поле")
    .matches(
      /^[a-z0-9_-]+$/,
      "Код должен содержать только латинские буквы, цифры, дефис или нижнее подчеркивание"
    ),
  description: yup.string().nullable(),
});

const AdminCategoryForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formInitialValues, setFormInitialValues] = useState(initialValues);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    const loadCategory = async () => {
      if (!isEditMode) return;

      try {
        const category = await getCategoryById(id);

        setFormInitialValues({
          name: category.name || "",
          code: category.code || "",
          description: category.description || "",
        });
      } catch (error) {
        console.error("Ошибка загрузки категории:", error);
        alert("Не удалось загрузить категорию");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, isEditMode]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        name: values.name.trim(),
        code: values.code.trim(),
        description: values.description.trim(),
      };

      if (isEditMode) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }

      navigate("/admin/categories");
    } catch (error) {
      console.error("Ошибка сохранения категории:", error);
      alert(error.message || "Не удалось сохранить категорию");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Box m="20px">Загрузка...</Box>;
  }

  return (
    <Box m="20px">
      <Header
        title={isEditMode ? "РЕДАКТИРОВАТЬ КАТЕГОРИЮ" : "ДОБАВИТЬ КАТЕГОРИЮ"}
        subtitle={
          isEditMode
            ? "Форма для редактирования категории"
            : "Форма для добавления новой категории"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formInitialValues}
        validationSchema={categorySchema}
        enableReinitialize
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
                label="Название категории"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Код категории"
                name="code"
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.code && !!errors.code}
                helperText={touched.code && errors.code}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                variant="filled"
                type="text"
                label="Описание"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" gap="10px" mt="20px">
              <Button
                type="button"
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/admin/categories")}
              >
                Отмена
              </Button>

              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Сохранение..."
                  : isEditMode
                  ? "Сохранить изменения"
                  : "Добавить категорию"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminCategoryForm;