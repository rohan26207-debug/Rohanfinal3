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
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const HeaderSettings = ({ isDarkMode, fuelSettings, setFuelSettings }) => {
  const [newFuelType, setNewFuelType] = useState('');
  const [currentView, setCurrentView] = useState('dropdown'); // Only 'dropdown' needed now
  const { toast } = useToast();

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

  // Full-screen Contact component (read-only display)
  const ContactFullScreen = () => (
    <div className={`fixed inset-0 z-50 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header with back button */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setCurrentView('dropdown')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Contact Information
          </h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Contact Information
              </h2>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Get in touch with us
              </p>
            </div>
            
            <div className="space-y-6">
              <div className={`border rounded-xl p-6 ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-start gap-4">
                  <User className="w-8 h-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Owner & Manager
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {contactInfo.dealerName}
                    </div>
                    <div className={`text-lg ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {contactInfo.pumpName}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`border rounded-xl p-6 ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-start gap-4">
                  <MapPin className="w-8 h-8 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Address
                    </div>
                    <div className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {contactInfo.address}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`border rounded-xl p-6 ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center gap-4">
                  <Phone className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Mobile Number
                    </div>
                    <div className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {contactInfo.phone}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`border rounded-xl p-6 ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 text-red-600 mt-1" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Email Address
                    </div>
                    <div className={`text-xl font-bold break-all ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {contactInfo.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render based on current view
  if (currentView === 'fuel') {
    return <FuelTypesFullScreen />;
  }
  
  if (currentView === 'contact') {
    return <ContactFullScreen />;
  }

  // Default dropdown view
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
        className="w-72 p-0" 
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
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('fuel')}
                className="w-full justify-start flex items-center gap-3 h-12"
              >
                <Fuel className="w-5 h-5" />
                <span className="text-base">Fuel Types</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setCurrentView('contact')}
                className="w-full justify-start flex items-center gap-3 h-12"
              >
                <Phone className="w-5 h-5" />
                <span className="text-base">Contact</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderSettings;