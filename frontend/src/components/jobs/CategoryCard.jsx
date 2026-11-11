import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  Code,
  Cpu,
  Layers,
  Megaphone,
  Palette,
  Users,
} from 'lucide-react';

const ICON_MAP = {
  Code,
  Palette,
  Cpu,
  Megaphone,
  BarChart3,
  Users,
  Layers,
  Briefcase,
};

const CategoryCard = ({ category }) => {
  const IconComponent = ICON_MAP[category.icon] || Briefcase;

  return (
    <Link to={`/jobs?category=${category.slug}`} className="category-card">
      <div className="category-icon-wrapper">
        <IconComponent size={24} />
      </div>
      <h3 className="category-title">{category.name}</h3>
      <p className="category-jobs-count">
        {category.jobs_count !== undefined ? `${category.jobs_count} open jobs` : 'Explore roles'}
      </p>
    </Link>
  );
};

export default CategoryCard;

