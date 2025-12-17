/**
 * SLAReports Component
 * Owner portal for Service Level Agreement monitoring and compliance
 */
export function SLAReports() {
  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">SLA Reports</h1>
        <p className="text-gray-600 mb-6">Track compliance with service level agreements</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Compliance Cards */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">On-Time Delivery</p>
            <p className="text-3xl font-bold text-emerald-600">98.5%</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Route Adherence</p>
            <p className="text-3xl font-bold text-emerald-600">99.2%</p>
            <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">SLA Breaches</p>
            <p className="text-3xl font-bold text-red-600">2</p>
            <p className="text-xs text-gray-500 mt-2">Pending resolution</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Avg Response Time</p>
            <p className="text-3xl font-bold text-blue-600">2.1 hrs</p>
            <p className="text-xs text-gray-500 mt-2">To SLA issues</p>
          </div>
        </div>

        {/* Detailed SLA Tracking */}
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Compliance Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold">Route</th>
                  <th className="text-left py-3 px-4 font-semibold">Compliance</th>
                  <th className="text-left py-3 px-4 font-semibold">Incidents</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">HR55AN2175</td>
                  <td className="py-3 px-4">Route A</td>
                  <td className="py-3 px-4">98%</td>
                  <td className="py-3 px-4">1 delay</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">HR47E2573</td>
                  <td className="py-3 px-4">Route B</td>
                  <td className="py-3 px-4">100%</td>
                  <td className="py-3 px-4">None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SLAReports;
