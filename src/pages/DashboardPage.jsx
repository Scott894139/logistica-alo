import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { determineStatus } from '../utils/dateUtils';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Package, AlertTriangle, CheckCircle, Clock, TrendingDown } from 'lucide-react';

const STATUS_COLORS = {
  'EN_BODEGA': '#3b82f6', // blue-500
  'ASIGNADO': '#14b8a6', // teal-500
  'SIN_STOCK': '#ef4444', // red-500
  'POR_VENCER': '#f97316', // orange-500
  'VENCIDO': '#64748b'  // slate-500
};

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalStock: 0,
    lowStock: 0,
    expiringSoon: 0,
    statusData: [],
    centerData: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, centersRes] = await Promise.all([
        supabase.from('productos').select('*'),
        supabase.from('centros_medicos').select('*')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (centersRes.error) throw centersRes.error;

      const products = productsRes.data.map(p => ({
        ...p,
        estado: determineStatus(p)
      }));
      const centers = centersRes.data;

      // Calculate Stats
      let totalStock = 0;
      let lowStockCount = 0;
      let expiringCount = 0;
      const statusCount = {
        'EN_BODEGA': 0, 'ASIGNADO': 0, 'SIN_STOCK': 0, 'POR_VENCER': 0, 'VENCIDO': 0
      };
      const centerCount = {};

      products.forEach(p => {
        totalStock += p.stock;
        if (p.stock > 0 && p.stock <= 5) lowStockCount++;
        if (p.estado === 'POR_VENCER') expiringCount++;
        
        statusCount[p.estado] = (statusCount[p.estado] || 0) + 1;

        if (p.centro_medico_id) {
          centerCount[p.centro_medico_id] = (centerCount[p.centro_medico_id] || 0) + p.stock;
        }
      });

      const statusData = Object.keys(statusCount).map(key => ({
        name: key.replace('_', ' '),
        value: statusCount[key],
        color: STATUS_COLORS[key]
      })).filter(d => d.value > 0);

      const centerData = Object.keys(centerCount).map(id => {
        const center = centers.find(c => c.id === id);
        return {
          name: center ? center.nombre.replace('Hospital ', 'H. ').replace('Clínica ', 'C. ') : 'Desconocido',
          stock: centerCount[id]
        };
      }).sort((a, b) => b.stock - a.stock).slice(0, 5); // Top 5

      setStats({
        totalItems: products.length,
        totalStock,
        lowStock: lowStockCount,
        expiringSoon: expiringCount,
        statusData,
        centerData
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Productos</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalItems}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Unidades en Stock</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalStock}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stock Bajo (≤ 5)</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.lowStock}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Por Vencer / Vencidos</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.expiringSoon}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribución por Estado</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} productos`, 'Cantidad']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Top 5 Centros Médicos (Volumen Asignado)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.centerData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="stock" fill="#0ea5e9" radius={[0, 4, 4, 0]} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
};
