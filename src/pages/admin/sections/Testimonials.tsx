import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { testimonialsApi, Testimonial } from '@/store/testimonials';

const Testimonials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const testimonials = useSelector((state: RootState) => state.testimonials.list) as Testimonial[];
  const testimonialsLoading = useSelector((state: RootState) => state.testimonials.isLoading);
  const [expandedQuotes, setExpandedQuotes] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    dispatch(testimonialsApi.get());
  }, [dispatch]);

  const handleExpandQuote = (id: number) => {
    setExpandedQuotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApprove = (testimonial: Testimonial) => {
    dispatch(testimonialsApi.put({ ...testimonial, status: 'approved' } as Testimonial));
  };
  const handleReject = (testimonial: Testimonial) => {
    dispatch(testimonialsApi.put({ ...testimonial, status: 'rejected' } as Testimonial));
  };
  const handleDeleteTestimonial = (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      dispatch(testimonialsApi.delete(id));
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded shadow p-6 w-[90%] min-w-[900px]">
        <div className="mb-4 text-lg font-semibold text-green-700">Testimonial Moderation</div>
        {testimonialsLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No testimonials available.</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Quote</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border text-sm">
                    <div className="flex items-center gap-2">
                      {t.avatar && <img src={t.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                      <div>
                        <div className="font-medium">{t.name}</div>
                        {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 border align-top max-w-xs">
                    <span className="italic text-gray-700">"
                      {expandedQuotes[t.id] || t.quote.length <= 100
                        ? t.quote
                        : t.quote.slice(0, 100) + '...'}
                      "</span>
                    {t.quote.length > 100 && (
                      <button
                        className="ml-2 text-xs text-blue-600 underline focus:outline-none"
                        onClick={() => handleExpandQuote(t.id)}
                      >
                        {expandedQuotes[t.id] ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </td>
                  <td className="p-2 border text-center capitalize">{t.status || 'pending'}</td>
                  <td className="p-2 border text-center text-xs">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    <div className="flex gap-2 justify-center">
                      {t.status !== 'approved' && (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => handleApprove(t)}
                        >Approve</button>
                      )}
                      {t.status !== 'rejected' && (
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                          onClick={() => handleReject(t)}
                        >Reject</button>
                      )}
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        onClick={() => handleDeleteTestimonial(t.id)}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Testimonials; 