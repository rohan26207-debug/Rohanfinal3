export const mockData = {
  fuelTypes: [
    { 
      type: 'Petrol', 
      price: 102.50,
      nozzles: [
        { id: 'P1', name: 'Nozzle P1', currentReading: 1250.75 },
        { id: 'P2', name: 'Nozzle P2', currentReading: 2340.20 },
        { id: 'P3', name: 'Nozzle P3', currentReading: 890.50 }
      ]
    },
    { 
      type: 'Diesel', 
      price: 89.75,
      nozzles: [
        { id: 'D1', name: 'Nozzle D1', currentReading: 1850.30 },
        { id: 'D2', name: 'Nozzle D2', currentReading: 3420.80 }
      ]
    },
    { 
      type: 'CNG', 
      price: 75.20,
      nozzles: [
        { id: 'C1', name: 'Nozzle C1', currentReading: 560.25 },
        { id: 'C2', name: 'Nozzle C2', currentReading: 1120.90 }
      ]
    },
    { 
      type: 'Premium', 
      price: 108.90,
      nozzles: [
        { id: 'PR1', name: 'Nozzle PR1', currentReading: 740.15 }
      ]
    }
  ],
  
  cashInHand: 15500.00,
  
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
      paymentMethod: 'cash',
      nozzleId: 'P1',
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
      calculationMode: 'manual',
      paymentMethod: 'card',
      nozzleId: 'D1'
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
      paymentMethod: 'cash',
      nozzleId: 'C1',
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
      calculationMode: 'manual',
      paymentMethod: 'cash',
      nozzleId: 'PR1'
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
      paymentMethod: 'card',
      nozzleId: 'P2',
      initialReading: 1200.0,
      finalReading: 1225.0
    }
  ]
};