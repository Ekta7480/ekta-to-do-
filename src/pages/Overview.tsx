import { motion } from 'framer-motion';
import { Users, GraduationCap, TrendingUp, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalStudents: number;
  averageGpa: number;
  topMajor: string;
  graduatingCount: number;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    averageGpa: 0,
    topMajor: '',
    graduatingCount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const { data: students } = await supabase
        .from('students')
        .select('*');

      if (students) {
        const totalStudents = students.length;
        const averageGpa = students.reduce((acc, student) => acc + (student.gpa || 0), 0) / totalStudents;
        const majors = students.reduce((acc, student) => {
          acc[student.major] = (acc[student.major] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const topMajor = Object.entries(majors).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
        const currentYear = new Date().getFullYear();
        const graduatingCount = students.filter(s => s.graduation_year === currentYear).length;

        setStats({
          totalStudents,
          averageGpa: Number(averageGpa.toFixed(2)),
          topMajor,
          graduatingCount,
        });
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'blue' },
    { title: 'Average GPA', value: stats.averageGpa, icon: TrendingUp, color: 'green' },
    { title: 'Top Major', value: stats.topMajor, icon: GraduationCap, color: 'purple' },
    { title: 'Graduating This Year', value: stats.graduatingCount, icon: Award, color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900"
      >
        Dashboard Overview
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 border-${card.color}-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {typeof card.value === 'number' && card.title === 'Average GPA' 
                    ? card.value.toFixed(2) 
                    : card.value}
                </p>
              </div>
              <card.icon className={`w-12 h-12 text-${card.color}-500 opacity-20`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Student record updated</p>
                  <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Add Student', 'Export Data', 'Generate Report', 'Send Notifications'].map((action) => (
              <motion.button
                key={action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}