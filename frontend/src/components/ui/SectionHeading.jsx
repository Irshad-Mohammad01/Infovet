import React from 'react';

/**
 * The heading block that opens each section: a small eyebrow label, the title,
 * and an optional supporting line. Shared so section spacing and type scale
 * stay identical across all three pages.
 */
const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
};

export default SectionHeading;
