/**
 * FuelAnalysis Component
 * Owner portal for fuel consumption analysis and theft detection
 */
export function FuelAnalysis() {
  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">Fuel Analysis</h1>
        <p className="text-gray-600 mb-6">Monitor fuel consumption patterns and detect anomalies</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Fuel Consumed</p>
            <p className="text-3xl font-bold text-gray-900">1,245 L</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Avg. Efficiency</p>
            <p className="text-3xl font-bold text-emerald-600">6.2 km/L</p>
            <p className="text-xs text-gray-500 mt-2">Fleet average</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Theft Alerts</p>
            <p className="text-3xl font-bold text-red-600">3</p>
            <p className="text-xs text-gray-500 mt-2">Pending review</p>
          </div>
        </div>

        {/* Detailed Analysis Section */}
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Vehicle Fuel Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold">Consumption</th>
                  <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">HR55AN2175</td>
                  <td className="py-3 px-4">245 L</td>
                  <td className="py-3 px-4">6.1 km/L</td>
                  <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Normal</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">HR47E2573</td>
                  <td className="py-3 px-4">198 L</td>
                  <td className="py-3 px-4">6.4 km/L</td>
                  <td className="py-3 px-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Optimal</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">UP32BN9021</td>
                  <td className="py-3 px-4">312 L</td>
                  <td className="py-3 px-4">5.8 km/L</td>
                  <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Alert</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuelAnalysis;
