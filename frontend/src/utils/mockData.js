export const mockData = {
  fuelTypes: [
    { type: 'Petrol', price: 102.50 },
    { type: 'Diesel', price: 89.75 },
    { type: 'CNG', price: 75.20 },
    { type: 'Premium', price: 108.90 }
  ],
  
  transactions: [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:22',
      fuelType: 'Petrol',
      quantity: 20.5,
      pricePerLiter: 102.50,
      totalCost: 2101.25,
      amountReceived: 2200,
      changeAmount: 98.75,
      calculationMode: 'meter',
      initialReading: 1250.5,
      finalReading: 1271.0
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:15:10',
      fuelType: 'Diesel',
      quantity: 15.0,
      pricePerLiter: 89.75,
      totalCost: 1346.25,
      amountReceived: 1350,
      changeAmount: 3.75,
      calculationMode: 'manual'
    },
    {
      id: 3,
      timestamp: '2024-01-15 13:45:33',
      fuelType: 'CNG',
      quantity: 8.2,
      pricePerLiter: 75.20,
      totalCost: 616.64,
      amountReceived: 620,
      changeAmount: 3.36,
      calculationMode: 'meter',
      initialReading: 892.3,
      finalReading: 900.5
    },
    {
      id: 4,
      timestamp: '2024-01-15 13:20:15',
      fuelType: 'Premium',
      quantity: 12.3,
      pricePerLiter: 108.90,
      totalCost: 1339.47,
      amountReceived: 1340,
      changeAmount: 0.53,
      calculationMode: 'manual'
    },
    {
      id: 5,
      timestamp: '2024-01-15 12:55:42',
      fuelType: 'Petrol',
      quantity: 25.0,
      pricePerLiter: 102.50,
      totalCost: 2562.50,
      amountReceived: 2600,
      changeAmount: 37.50,
      calculationMode: 'meter',
      initialReading: 1200.0,
      finalReading: 1225.0
    }
  ]
};