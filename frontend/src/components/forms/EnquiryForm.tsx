import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../api/client'
import type { ApiResponse, EnquiryResponse } from '../../types/api.types'
import './EnquiryForm.scss'

interface EnquiryFormProps {
  productId: number
}

interface FormValues {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }
  if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  }
  return errors
}

export function EnquiryForm({ productId }: EnquiryFormProps) {
  const navigate = useNavigate()
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError(null)

    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await apiClient.post<ApiResponse<EnquiryResponse>>('/api/enquiries', {
        productId,
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })
      navigate('/thank-you')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="enquiry-form">
      {serverError && (
        <div className="enquiry-form__server-error" role="alert">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          className={`form-control${errors.name ? ' form-control--error' : ''}`}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          className={`form-control${errors.email ? ' form-control--error' : ''}`}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      {/* Message */}
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          className={`form-control${errors.message ? ' form-control--error' : ''}`}
        />
        {errors.message && <p className="form-error">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn--primary"
      >
        {submitting ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  )
}
