
import React, { useState } from 'react';
import { StudioService } from '@/types/services';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';
import { useServicesData } from '@/hooks/useServicesData';

interface ServiceManagementProps {
  studioServices: StudioService[];
  onServiceStatusChange: (serviceIndex: number) => void;
  onSubServiceStatusChange: (serviceIndex: number, subServiceIndex: number, active: boolean) => void;
  onClothingItemStatusChange: (serviceIndex: number, subServiceIndex: number, itemId: string, active: boolean) => void;
  onServiceEdit: (serviceIndex: number) => void;
  onServiceDelete: (serviceIndex: number) => void;
  onSubServiceEdit: (serviceIndex: number, subServiceIndex: number) => void;
  onSubServiceDelete: (serviceIndex: number, subServiceIndex: number) => void;
  onClothingItemEdit: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onClothingItemDelete: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onEditPrices: (serviceIndex: number, subServiceIndex: number) => void;
  onAddItem: (serviceIndex: number, subServiceIndex: number) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  studioServices,
  onServiceStatusChange,
  onSubServiceStatusChange,
  onClothingItemStatusChange,
  onServiceEdit,
  onServiceDelete,
  onSubServiceEdit,
  onSubServiceDelete,
  onClothingItemEdit,
  onClothingItemDelete,
  onEditPrices,
  onAddItem
}) => {
  const { subServices: allSubServices, clothingItems } = useServicesData();
  const [expandedServices, setExpandedServices] = useState<{[key: string]: boolean}>({});
  const [expandedSubServices, setExpandedSubServices] = useState<{[key: string]: boolean}>({});

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const toggleSubServiceExpansion = (subServiceKey: string) => {
    setExpandedSubServices(prev => ({
      ...prev,
      [subServiceKey]: !prev[subServiceKey]
    }));
  };

  const getSubServiceName = (id: string) => {
    const subService = allSubServices.find(s => s.id === id);
    return subService ? subService.name : id;
  };

  const getClothingItemName = (id: string) => {
    const item = clothingItems.find(i => i.id === id);
    return item ? item.name : id;
  };

  const countSubServices = (service: StudioService) => {
    return service.subServices.length;
  };

  const countItems = (service: StudioService, subServiceIndex: number) => {
    const subService = service.subServices[subServiceIndex];
    return subService.selectedItems?.length || 0;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
          <p className="text-gray-600">Manage your services, subservices, and item details</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          onClick={() => onServiceEdit(-1)} // -1 indicates new service
        >
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="space-y-4 mt-6">
        {studioServices.map((service, serviceIndex) => {
          const isServiceExpanded = expandedServices[service.id] || false;
          
          return (
            <div key={service.id} className="border rounded-lg overflow-hidden">
              {/* Service Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors" 
                onClick={() => toggleServiceExpansion(service.id)}
              >
                <div className="flex items-center gap-2">
                  {isServiceExpanded ? 
                    <ChevronDown size={20} className="text-gray-600" /> : 
                    <ChevronUp size={20} className="text-gray-600" />
                  }
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                    <p className="text-sm text-gray-500">{countSubServices(service)} subservices</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Active</span>
                    <Switch 
                      checked={service.active}
                      onCheckedChange={() => onServiceStatusChange(serviceIndex)} 
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceEdit(serviceIndex);
                    }}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceDelete(serviceIndex);
                    }}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>

              {/* Service Content (shown when expanded) */}
              {isServiceExpanded && (
                <div className="p-4 border-t">
                  {/* Subservices Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-gray-800">Subservices</h4>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => onSubServiceEdit(serviceIndex, -1)} // -1 indicates new subservice
                        className="flex items-center gap-1 text-sm"
                      >
                        <Plus size={16} /> Add Subservice
                      </Button>
                    </div>

                    {/* Subservices List */}
                    <div className="space-y-4 pl-4">
                      {service.subServices.map((subService, subServiceIndex) => {
                        const subServiceKey = `${service.id}-${subServiceIndex}`;
                        const isSubServiceExpanded = expandedSubServices[subServiceKey] || false;
                        
                        return (
                          <div key={subServiceKey} className="border rounded-lg overflow-hidden">
                            {/* Subservice Header */}
                            <div 
                              className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                              onClick={() => toggleSubServiceExpansion(subServiceKey)}
                            >
                              <div className="flex items-center gap-2">
                                {isSubServiceExpanded ? 
                                  <ChevronDown size={18} className="text-gray-600" /> : 
                                  <ChevronUp size={18} className="text-gray-600" />
                                }
                                <div>
                                  <h5 className="font-medium text-gray-800">{getSubServiceName(subService.name)}</h5>
                                  <p className="text-xs text-gray-500">{countItems(service, subServiceIndex)} items</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Active</span>
                                  <Switch 
                                    checked={subService.active !== false}
                                    onCheckedChange={(checked) => onSubServiceStatusChange(serviceIndex, subServiceIndex, checked)} 
                                  />
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSubServiceEdit(serviceIndex, subServiceIndex);
                                  }}
                                  className="h-8 w-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSubServiceDelete(serviceIndex, subServiceIndex);
                                  }}
                                  className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>

                            {/* Subservice Content (shown when expanded) */}
                            {isSubServiceExpanded && (
                              <div className="p-4 border-t">
                                {/* Pricing Information */}
                                <div className="mb-6">
                                  <div className="flex justify-between items-center mb-3">
                                    <h6 className="font-medium text-gray-800">Pricing Information</h6>
                                    <Button 
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onEditPrices(serviceIndex, subServiceIndex)}
                                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                                    >
                                      <Edit size={14} /> Edit Prices
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-gray-600 mb-2">Standard Price per KG: 
                                        <span className="font-medium text-gray-800 ml-1">
                                          ₹{subService.standardPricePerKg || '0'}
                                        </span>
                                      </p>
                                      <p className="text-gray-600">Express Price per KG: 
                                        <span className="font-medium text-gray-800 ml-1">
                                          ₹{subService.expressPricePerKg || '0'}
                                        </span>
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 mb-2">Standard Price per Item: 
                                        <span className="font-medium text-gray-800 ml-1">
                                          ₹{subService.standardPricePerItem || '0'}
                                        </span>
                                      </p>
                                      <p className="text-gray-600">Express Price per Item: 
                                        <span className="font-medium text-gray-800 ml-1">
                                          ₹{subService.expressPricePerItem || '0'}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Items Section */}
                                <div>
                                  <div className="flex justify-between items-center mb-3">
                                    <h6 className="font-medium text-gray-800">Items</h6>
                                    <Button 
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onAddItem(serviceIndex, subServiceIndex)}
                                      className="flex items-center gap-1 text-xs"
                                    >
                                      <Plus size={14} /> Add Item
                                    </Button>
                                  </div>
                                  
                                  {/* Items Table */}
                                  {subService.selectedItems && subService.selectedItems.length > 0 ? (
                                    <div className="border rounded-lg overflow-hidden">
                                      {/* Table Header */}
                                      <div className="grid grid-cols-4 bg-gray-50 p-2 text-sm font-medium text-gray-600">
                                        <div className="pl-2">Name</div>
                                        <div className="text-center">Standard Price</div>
                                        <div className="text-center">Express Price</div>
                                        <div className="text-right pr-2">Status</div>
                                      </div>
                                      
                                      {/* Table Body */}
                                      <div>
                                        {subService.selectedItems.map((itemId) => {
                                          const isItemActive = subService.clothingItemsStatus?.[itemId] !== false;
                                          const standardPrice = subService.standardItemPrices?.[itemId] || '0';
                                          const expressPrice = subService.expressItemPrices?.[itemId] || '0';
                                          
                                          return (
                                            <div key={itemId} className="grid grid-cols-4 p-2 border-t items-center text-sm">
                                              <div className="pl-2 flex items-center gap-2">
                                                <span className="font-medium">{getClothingItemName(itemId)}</span>
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon"
                                                  onClick={() => onClothingItemEdit(serviceIndex, subServiceIndex, itemId)}
                                                  className="h-6 w-6 text-gray-500 hover:text-blue-600"
                                                >
                                                  <Edit size={14} />
                                                </Button>
                                              </div>
                                              <div className="text-center">₹{standardPrice}</div>
                                              <div className="text-center">₹{expressPrice}</div>
                                              <div className="flex items-center justify-end gap-2 pr-2">
                                                <span className="text-sm text-gray-600">Active</span>
                                                <Switch 
                                                  checked={isItemActive}
                                                  onCheckedChange={(checked) => 
                                                    onClothingItemStatusChange(serviceIndex, subServiceIndex, itemId, checked)
                                                  } 
                                                  className="scale-90"
                                                />
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon"
                                                  onClick={() => onClothingItemDelete(serviceIndex, subServiceIndex, itemId)}
                                                  className="h-6 w-6 text-gray-500 hover:text-red-600"
                                                >
                                                  <Trash2 size={14} />
                                                </Button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="border rounded-lg p-4 text-center text-gray-500">
                                      No items added yet. Click "Add Item" to add some.
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceManagement;
