import React, { useState, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings as SettingsIcon,
  Fuel,
  Plus,
  Minus,
  Trash2,
  Save,
  RotateCcw,
  Gauge,
  User,
  Phone,
  Mail,
  MapPin,
  LogOut
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const HeaderSettings = ({ isDarkMode, fuelSettings, setFuelSettings }) => {
  const [newFuelType, setNewFuelType] = useState('');
  const [currentView, setCurrentView] = useState('dropdown'); // Only 'dropdown' needed now
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, login, logout, syncData } = useAuth();

  // Employee management removed

  // Owner details state removed

  // Contact information state (static display)
  const [contactInfo, setContactInfo] = useState({
    pumpName: 'Vishnu Parvati Petroleum',
    dealerName: 'Rohan.R.Khandve',
    address: 'Station Road, Near City Mall, Mumbai - 400001',
    phone: '+91 9822026207',
    email: 'vishnuparvatipetroleum@gmail.com'
  });

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
      description: `${newFuelType} has been added successfully. Set the rate in the Rate tab.`,
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

  // Employee management functions removed

  // Owner details functions removed

  // Employee form handlers removed

  const handleNewFuelTypeChange = useCallback((e) => {
    setNewFuelType(e.target.value);
  }, []);

  // saveOwnerDetails function removed

  // Contact information functions
  const updateContactInfo = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const saveContactInfo = () => {
    toast({
      title: "Contact Information Saved",
      description: "Contact information has been updated successfully",
    });
  };

  // Owner Details component removed

  // Fuel Types component removed - now inline

  // Employees component removed

  // Contact component removed - now inline

  // No separate views needed - everything in dropdown

  // Inline dropdown view with tabs
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
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="fuel" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <TabsTrigger value="fuel" className="flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  Fuel Types
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="fuel" className="p-4 max-h-80 overflow-y-auto">
                {/* Add New Fuel Type */}
                <div className="space-y-3 mb-4">
                  <Label className="text-sm font-medium">Add New Fuel Type</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFuelType}
                      onChange={handleNewFuelTypeChange}
                      placeholder="Enter fuel type name"
                      className="flex-1"
                      autoComplete="off"
                      inputMode="text"
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
              </TabsContent>
              
              <TabsContent value="contact" className="p-4">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Contact Information
                    </h3>
                  </div>
                  
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Owner
                          </div>
                          <div className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {contactInfo.dealerName}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-slate-600'
                          }`}>
                            {contactInfo.pumpName}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className={isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} />
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                          <div className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Mobile
                          </div>
                          <div className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {contactInfo.phone}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className={isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} />
                      
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <div className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Email
                          </div>
                          <div className={`font-medium break-all ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {contactInfo.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
            </Tabs>
            </Tabs>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderSettings;