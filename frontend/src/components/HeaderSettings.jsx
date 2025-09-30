import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Settings as SettingsIcon,
  Fuel,
  Plus,
  Minus,
  Trash2,
  Save,
  RotateCcw,
  Gauge
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const HeaderSettings = ({ isDarkMode, fuelSettings, setFuelSettings }) => {
  const [newFuelType, setNewFuelType] = useState('');
  const { toast } = useToast();

  const updateNozzleCount = (fuelType, delta) => {
    setFuelSettings(prev => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        nozzleCount: Math.max(1, Math.min(10, prev[fuelType].nozzleCount + delta))
      }
    }));
  };

  const addFuelType = () => {
    if (!newFuelType.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a fuel type name",
        variant: "destructive",
      });
      return;
    }

    if (fuelSettings[newFuelType]) {
      toast({
        title: "Duplicate Fuel Type",
        description: "This fuel type already exists",
        variant: "destructive",
      });
      return;
    }

    // Use a default price of 100 when adding new fuel type
    // Price will be set in the Price Configuration tab
    setFuelSettings(prev => ({
      ...prev,
      [newFuelType]: {
        price: 100.00, // Default price, will be configured in Price tab
        nozzleCount: 2
      }
    }));

    setNewFuelType('');
    
    toast({
      title: "Fuel Type Added",
      description: `${newFuelType} has been added successfully. Set the price in the Price Configuration tab.`,
    });
  };

  const removeFuelType = (fuelType) => {
    const newSettings = { ...fuelSettings };
    delete newSettings[fuelType];
    setFuelSettings(newSettings);
    
    toast({
      title: "Fuel Type Removed",
      description: `${fuelType} has been removed`,
    });
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      'Petrol': { price: 102.50, nozzleCount: 3 },
      'Diesel': { price: 89.75, nozzleCount: 2 },
      'CNG': { price: 75.20, nozzleCount: 2 },
      'Premium': { price: 108.90, nozzleCount: 1 }
    };
    setFuelSettings(defaultSettings);
    
    toast({
      title: "Settings Reset",
      description: "Fuel settings have been reset to defaults",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-96 p-0" 
        align="start"
        sideOffset={5}
      >
        <Card className={`border-0 shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SettingsIcon className="w-5 h-5" />
              Fuel Type Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {/* Add New Fuel Type */}
            <div className="space-y-3 mb-4">
              <Label className="text-sm font-medium">Add New Fuel Type</Label>
              <div className="flex gap-2">
                <Input
                  value={newFuelType}
                  onChange={(e) => setNewFuelType(e.target.value)}
                  placeholder="Enter fuel type name"
                  className="flex-1"
                />
                <Button onClick={addFuelType} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Existing Fuel Types */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Configure Fuel Types</Label>
              {Object.entries(fuelSettings).map(([fuelType, config]) => (
                <div key={fuelType} className={`border rounded-lg p-3 ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-100 text-blue-800 border-0">
                      {fuelType}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFuelType(fuelType)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Nozzles:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateNozzleCount(fuelType, -1)}
                          disabled={config.nozzleCount <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">
                          {config.nozzleCount}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateNozzleCount(fuelType, 1)}
                          disabled={config.nozzleCount >= 10}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      Price: ₹{config.price}/L (Set in Price Configuration)
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="w-full flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderSettings;