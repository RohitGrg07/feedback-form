import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Rating,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { apiPost } from '../lib/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  rating: number;
  feedback: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  rating?: string;
  feedback?: string;
}

export const FeedbackForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    feedback: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Rating is required';
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = 'Feedback must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await apiPost<{ data: unknown }>('/feedback', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        rating: formData.rating,
        feedback: formData.feedback.trim(),
      });

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your feedback! Your submission has been received.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        rating: 0,
        feedback: '',
      });
      setErrors({});
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit feedback. Please try again.',
      });
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRatingChange = (_: React.SyntheticEvent, value: number | null) => {
    setFormData((prev) => ({ ...prev, rating: value || 0 }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Share Your Feedback
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph align="center">
          We value your opinion. Please let us know how we can improve.
        </Typography>

        {submitStatus && (
          <Alert severity={submitStatus.type} sx={{ mb: 3 }}>
            {submitStatus.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            required
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography component="legend" gutterBottom>
              Rating *
            </Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" />}
            />
            {errors.rating && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                {errors.rating}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            label="Feedback"
            multiline
            rows={4}
            value={formData.feedback}
            onChange={handleChange('feedback')}
            error={!!errors.feedback}
            helperText={errors.feedback}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
