export default function TestimonialCard({ testimonial }) {
  return <article className="testimonial-card"><p>« {testimonial.message} »</p><strong>{testimonial.name}</strong><span>{testimonial.role}</span></article>
}
