import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Search, MapPin, TrendingUp, Users } from 'lucide-react';

const DATA = {
  voter_turnout: [
    { year: '2004', turnout: 58.07 },
    { year: '2009', turnout: 58.19 },
    { year: '2014', turnout: 66.44 },
    { year: '2019', turnout: 67.40 },
    { year: '2024 (Est)', turnout: 69.10 },
  ],
  demographics: [
    { name: '18-25', value: 22 },
    { name: '26-40', value: 35 },
    { name: '41-60', value: 28 },
    { name: '60+', value: 15 },
  ],
  gender: [
    { name: 'Male', value: 52 },
    { name: 'Female', value: 48 },
  ]
};

const COLORS = ['#1B2F5E', '#FF6B00', '#1A6B3A', '#8B5CF6', '#EC4899'];

export default function ConstituencyInsights() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('Delhi');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-[#1B2F5E] dark:text-white mb-4">Constituency Insights</h1>
        <p className="text-slate-600 dark:text-slate-400">Explore historical voting trends and demographic data.</p>
      </div>

      <div className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search constituency..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2F5E]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <MapPin size={20} className="text-[#FF6B00] ml-2" />
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-transparent font-medium py-1 px-2 focus:outline-none"
          >
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Voter Turnout Trend */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[#1A6B3A]" />
            <h3 className="text-xl font-bold">Voter Turnout Trend (%)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA.voter_turnout}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="turnout" fill="#1B2F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-slate-500 italic text-center">
            * Data represents average turnout for general elections.
          </p>
        </div>

        {/* Age Demographics */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-[#FF6B00]" />
            <h3 className="text-xl font-bold">Electorate Demographics</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA.demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA.demographics.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Electors', value: '1.2M', icon: '👥' },
          { label: 'Polling Stations', value: '1,450', icon: '🗳️' },
          { label: 'Male-Female Ratio', value: '1000:942', icon: '⚖️' },
          { label: 'First-time Voters', value: '85,000+', icon: '✨' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-[#1B2F5E] dark:text-white">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
