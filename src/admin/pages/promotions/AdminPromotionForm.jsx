import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createPromotion,
  getPromotionById,
  updatePromotion,
} from "../../../api/promotionsApi";

const initialValues = {
  title: "",
  type: "Скидка",
  value: "",
  promoCode: "",
  startDate: "",
  endDate: "",
  status: "Активен",
  restrictions: "",
  imageUrl: "",
};

const promotionSchema = yup.object().shape({
  title: yup.string().required("Обязательное поле"),
  type: yup.string().required("Обязательное поле"),
  value: yup.string().required("Обязательное поле"),
  startDate: yup.string().required("Обязательное поле"),
  endDate: yup
    .string()
    .required("Обязательное поле")
    .test(
      "is-after-start",
      "Дата окончания не может быть раньше даты начала",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) >= new Date(startDate);
      }
    ),
  status: yup.string().required("Обязательное поле"),
  restrictions: yup.string().nullable(),
  imageUrl: yup.string().nullable(),
});

const AdminPromotionForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formInitialValues, setFormInitialValues] = useState(initialValues);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    const loadPromotion = async () => {
      if (!isEditMode) return;

      try {
        const promotion = await getPromotionById(id);

        setFormInitialValues({
          title: promotion.title || "",
          type: promotion.type || "Скидка",
          value: promotion.value || "",
          promoCode: promotion.promoCode || "",
          startDate: promotion.startDate
            ? promotion.startDate.slice(0, 10)
            : "",
          endDate: promotion.endDate ? promotion.endDate.slice(0, 10) : "",
          status: promotion.status || "Активен",
          restrictions: promotion.restrictions || "",
          imageUrl: promotion.imageUrl || "",
        });
      } catch (error) {
        console.error("Ошибка загрузки акции:", error);
        alert("Не удалось загрузить акцию");
      } finally {
        setLoading(false);
      }
    };

    loadPromotion();
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
    setFieldValue("imageUrl", reader.result);
  };
  reader.readAsDataURL(file);
};

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        title: values.title.trim(),
        type: values.type.trim(),
        value: values.value.trim(),
        promoCode: values.promoCode.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status.trim(),
        restrictions: values.restrictions.trim(),
        imageUrl: values.imageUrl.trim(),
      };

      if (isEditMode) {
        await updatePromotion(id, payload);
      } else {
        await createPromotion(payload);
      }

      navigate("/admin/promotions");
    } catch (error) {
      console.error("Ошибка сохранения акции:", error);
      alert(error.message || "Не удалось сохранить акцию");
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
        title={isEditMode ? "РЕДАКТИРОВАТЬ АКЦИЮ" : "ДОБАВИТЬ АКЦИЮ"}
        subtitle={
          isEditMode
            ? "Форма для редактирования акции"
            : "Форма для добавления новой акции"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formInitialValues}
        validationSchema={promotionSchema}
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
                label="Название акции"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                select
                variant="filled"
                label="Тип акции"
                name="type"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.type && !!errors.type}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: "span 2" }}
              >
                <MenuItem value="Скидка">Скидка</MenuItem>
                <MenuItem value="Подарок">Подарок</MenuItem>
                <MenuItem value="Спецпредложение">Спецпредложение</MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Значение"
                name="value"
                value={values.value}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.value && !!errors.value}
                helperText={touched.value && errors.value}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Промокод (необязательно)"
                name="promoCode"
                value={values.promoCode}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ gridColumn: "span 2" }}
                helperText="Если поле заполнено — акция применяется по промокоду. Если пусто — акция автоматическая."
              />

              <TextField
                fullWidth
                select
                variant="filled"
                label="Статус"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.status && !!errors.status}
                helperText={touched.status && errors.status}
                sx={{ gridColumn: "span 1" }}
              >
                <MenuItem value="Активен">Активен</MenuItem>
                <MenuItem value="Неактивен">Неактивен</MenuItem>
                <MenuItem value="Запланирован">Запланирован</MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Дата начала"
                name="startDate"
                value={values.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2",
                    '& input::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1)',
                    }
                 }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Дата окончания"
                name="endDate"
                value={values.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2",
                    '& input::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1)',
                    }
                 }}
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                variant="filled"
                type="text"
                label="Ограничения"
                name="restrictions"
                value={values.restrictions}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.restrictions && !!errors.restrictions}
                helperText={touched.restrictions && errors.restrictions}
                sx={{ gridColumn: "span 4" }}
              />

              
            </Box>

            <Box display="flex" justifyContent="end" gap="10px" mt="20px">
              <Button
                type="button"
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/admin/promotions")}
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
                  : "Добавить акцию"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminPromotionForm;