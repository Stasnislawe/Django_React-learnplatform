import React from 'react';
import { Clock, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Practice } from '../types';

interface PracticeCardProps {
  practice: Practice;
}

export function PracticeCard({ practice }: PracticeCardProps) {
  return (
    <Link to={`/course/${course.id}/practice/${practice.id}`}>
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">

        <div className="relative z-10 p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">{practice.theory_url}</h3>
          <p className="text-gray-200 mb-4 line-clamp-2">{practice.id}</p>
        </div>
      </div>
    </Link>
  );
}