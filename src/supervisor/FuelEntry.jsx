import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Loader2, AlertCircle, CheckCircle2, Droplet, Calendar, Truck } from 'lucide-react';
import api from '../../services/api';

/**
 * FuelEntry Component
 * Supervisor interface for recording fuel entries and triggering analysis
 */
export function FuelEntry() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [fuelQty, setFuelQty] = useState('');
  const [fuelDate, setFuelDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await api.getVehicles?.();
        setVehicles(data || []);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      }
    }
    loadVehicles();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Create fuel entry
      await api.createFuelEntry?.({
        vehicle_id: vehicleId,
        fuel_quantity: Number(fuelQty),
        fuel_date: fuelDate,
      });

      // Trigger analysis
      await api.runFuelAnalysis?.({
        vehicle_id: vehicleId,
        route_id: null,
        date: fuelDate,
      });

      setMessageType('success');
      setMessage('✓ Fuel entry saved & analyzed successfully');
      setFuelQty('');
      setVehicleId('');
    } catch (err) {
      setMessageType('error');
      setMessage(err?.message || 'Failed to save fuel entry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Fuel Entry</h1>
      <p className="text-gray-600 mb-6">Record fuel consumption and trigger analysis</p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-600" />
            New Fuel Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Truck className="inline h-4 w-4 mr-2" />
                Select Vehicle
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.vehicle_id || v.id} value={v.vehicle_id || v.id}>
                    {v.vehicle_number || v.number || 'Vehicle'}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Droplet className="inline h-4 w-4 mr-2" />
                Fuel Quantity (Liters)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter fuel quantity"
                value={fuelQty}
                onChange={(e) => setFuelQty(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Fuel Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Date
              </label>
              <Input
                type="date"
                value={fuelDate}
                onChange={(e) => setFuelDate(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-gap-3 ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Fuel Entry'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center py-8">No recent entries</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FuelEntry;
