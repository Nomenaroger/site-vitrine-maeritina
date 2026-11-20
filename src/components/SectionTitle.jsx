export default function SectionTitle({ eyebrow, title, description, centered = false, action = null }) {
  if (action) {
    return (
      <div className="section-heading section-heading-split">
        <div>
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </span>
          <h2>{title}</h2>
        </div>
        <div className="section-heading-aside">
          {description && <p>{description}</p>}
          {action}
        </div>
      </div>
    )
  }

  return (
    <div className={`section-heading ${centered ? 'section-centered' : ''}`}>
      <span className="eyebrow">
        <span className="eyebrow-dot" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
