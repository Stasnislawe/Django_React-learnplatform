import React from 'react';
import { Clock, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Theory } from '../types';

interface TheoryCardProps {
  theory: Theory;
}

export function TheoryCard({ theory }: TheoryCardProps) {
  return (
    <Link to={`/course/${course.id}/theory/${theory.theory_id}`}>
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative z-10 p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">{theory.title_theory}</h3>
          <p className="text-gray-200 mb-4 line-clamp-2">{theory.about_theory}</p>
          <img src={theory.image_theory}>
        </div>
      </div>
    </Link>
  );
}