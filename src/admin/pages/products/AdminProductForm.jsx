import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createProduct,
  getProductById,
  updateProduct,
  getProductCategories,
} from "../../../api/productsApi";

const initialValues = {
  name: "",
  description: "",
  category: "",
  price: "",
  remainder: "",
  calories: "",
  proteins: "",
  fats: "",
  carbs: "",
  imageURL: "",
};

const productSchema = yup.object().shape({
  name: yup.string().required("Обязательное поле"),
  description: yup.string().nullable(),
  category: yup.string().required("Обязательное поле"),
  price: yup
    .number()
    .typeError("Цена должна быть числом")
    .required("Обязательное поле")
    .min(0, "Цена не может быть отрицательной"),
  remainder: yup
    .number()
    .typeError("Остаток должен быть числом")
    .required("Обязательное поле")
    .min(0, "Остаток не может быть отрицательным")
    .integer("Остаток должен быть целым числом"),
  calories: yup
    .number()
    .typeError("Калории должны быть числом")
    .min(0, "Не может быть отрицательным")
    .nullable(),
  proteins: yup
    .number()
    .typeError("Белки должны быть числом")
    .min(0, "Не может быть отрицательным")
    .nullable(),
  fats: yup
    .number()
    .typeError("Жиры должны быть числом")
    .min(0, "Не может быть отрицательным")
    .nullable(),
  carbs: yup
    .number()
    .typeError("Углеводы должны быть числом")
    .min(0, "Не может быть отрицательным")
    .nullable(),
  imageURL: yup.string().nullable(),
});

const AdminProductForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formInitialValues, setFormInitialValues] = useState(initialValues);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await getProductCategories();
        setCategories(categoriesData);

        if (isEditMode) {
          const product = await getProductById(id);

          setFormInitialValues({
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            price: product.price ?? "",
            remainder: product.remainder ?? "",
            calories: product.nutrition?.calories ?? "",
            proteins: product.nutrition?.proteins ?? "",
            fats: product.nutrition?.fats ?? "",
            carbs: product.nutrition?.carbs ?? "",
            imageURL: product.imageURL || "",
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки данных товара:", error);
        alert("Не удалось загрузить данные товара");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

const handleImageChange = (event, setFieldValue) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;

  const maxSizeInMb = 2;
  const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    alert("Фото слишком большое. Выберите изображение меньше 2 МБ.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setFieldValue("imageURL", reader.result);
  };
  reader.readAsDataURL(file);
};

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category,
        price: Number(values.price),
        quantity: Number(values.remainder),
        calories: values.calories === "" ? null : Number(values.calories),
        proteins: values.proteins === "" ? null : Number(values.proteins),
        fats: values.fats === "" ? null : Number(values.fats),
        carbohydrates: values.carbs === "" ? null : Number(values.carbs),
        imageUrl: values.imageURL || null,
      };

      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Ошибка сохранения товара:", error);
      alert(error.message || "Не удалось сохранить товар");
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
        title={isEditMode ? "РЕДАКТИРОВАТЬ ТОВАР" : "ДОБАВИТЬ ТОВАР"}
        subtitle={
          isEditMode
            ? "Форма для редактирования товара"
            : "Форма для добавления нового товара"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formInitialValues}
        validationSchema={productSchema}
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
          setFieldValue,
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
                label="Название"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                select
                fullWidth
                variant="filled"
                label="Категория"
                name="category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                sx={{ gridColumn: "span 2" }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </TextField>

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

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Цена"
                name="price"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Остаток"
                name="remainder"
                value={values.remainder}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.remainder && !!errors.remainder}
                helperText={touched.remainder && errors.remainder}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Калории"
                name="calories"
                value={values.calories}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.calories && !!errors.calories}
                helperText={touched.calories && errors.calories}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Белки"
                name="proteins"
                value={values.proteins}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.proteins && !!errors.proteins}
                helperText={touched.proteins && errors.proteins}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Жиры"
                name="fats"
                value={values.fats}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.fats && !!errors.fats}
                helperText={touched.fats && errors.fats}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Углеводы"
                name="carbs"
                value={values.carbs}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.carbs && !!errors.carbs}
                helperText={touched.carbs && errors.carbs}
                sx={{ gridColumn: "span 1" }}
              />

              <Box sx={{ gridColumn: "span 4" }}>
                <Button variant="contained" component="label" color="secondary">
                  Загрузить фото
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, setFieldValue)}
                  />
                </Button>

                {values.imageURL && (
                  <Box mt="15px">
                    <img
                      src={values.imageURL}
                      alt="preview"
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box display="flex" justifyContent="end" gap="10px" mt="20px">
              <Button
                type="button"
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/admin/products")}
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
                  : "Добавить товар"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminProductForm;