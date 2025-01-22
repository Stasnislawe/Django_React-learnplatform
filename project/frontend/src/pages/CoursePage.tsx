import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';

export function CoursePage() {
  const { id, theoryID } = useParams();
  const navigate = useNavigate();
  const { course, loading, error } = useCourse(Number(id));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
      <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${course.image_title})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      <div className="relative min-h-screen">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-white hover:text-gray-300 flex items-center gap-2 p-2"
        >
          <ArrowLeft size={24} />
          Назад
        </button>

        <div className="pt-20 px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-white text-center mb-12">
            {course.title_theory}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={course.image_title_1}
                      alt={course.theory_1}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mt-4 text-gray-800 text-center">
                    {course.theory_1}
                  </h3>
                  <div className="w-full mt-3">
                    <button
                      onClick={() => navigate(`/course/${id}/learn`)}
                      className="w-full place-content-center inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Начать обучение
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={course.image_title_2}
                      alt={course.theory_2}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mt-4 text-gray-800 text-center">
                    {course.theory_2}
                  </h3>
                  <div className="w-full mt-3">
                    <button
                        onClick={() => navigate(`/course/${id}/learn`)}
                        className="w-full place-content-center inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                        Пройди сначала первую часть
                      </button>
                  </div>
                </div>
              </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden p-3 mt-5">{course.about}</div>
        </div>
      </div>
    </div>
  );
}

//     <div>
//       <Header />
//       <div
//         className="relative h-96 bg-cover bg-center"
//         style={{ backgroundImage: `url(${course.image_title})` }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-60">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
//             <div className="text-white">
//               <h1 className="text-4xl font-bold mb-4">{course.title_theory}</h1>
//               <p className="text-xl">{course.about}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <button
//           onClick={() => navigate(`/course/${id}/learn`)}
//           className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//         >
//           Начать обучение
//           <ArrowRight className="ml-2 h-5 w-5" />
//         </button>
//       </main>
//     </div>
//   );
// }

