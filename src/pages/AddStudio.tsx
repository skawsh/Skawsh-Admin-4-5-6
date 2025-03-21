
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Save, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MultiSelectServiceDialog from "@/components/studio/MultiSelectServiceDialog";
import { useServicesData } from '@/hooks/useServicesData';

interface StudioService {
  serviceId: string;
  subServices: any[];
}

type WashCategory = 'standard' | 'express' | 'both';

const AddStudio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { services, subServices, clothingItems } = useServicesData();
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [studioServices, setStudioServices] = useState<StudioService[]>([]);
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [editingService, setEditingService] = useState<StudioService | null>(null);
  const [isGstRegistered, setIsGstRegistered] = useState('no');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    ownerFirstName: '',
    ownerLastName: '',
    studioName: '',
    email: '',
    primaryNumber: '',
    secondaryNumber: '',
    password: '',
    confirmPassword: '',
    
    street: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    
    businessRegNumber: '',
    gstNumber: '',
    panNumber: '',
    openingTime: '09:00 AM',
    closingTime: '09:00 PM',
    priceAdjustment: '0',
    
    employeeCount: '0',
    dailyCapacity: '0',
    specialEquipment: '',
    washCategory: 'both' as WashCategory,
    
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    reEnterAccountNumber: '',
    ifscCode: '',
    branchName: '',
    upiId: '',
    paymentSchedule: 'daily',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    if (name === 'washCategory') {
      const washValue = (value === 'standard' || value === 'express' || value === 'both') 
        ? value as WashCategory
        : 'both' as WashCategory;
      
      setFormData(prev => ({ ...prev, [name]: washValue }));
    } else if (name === 'gstRegistered') {
      setIsGstRegistered(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for passwords
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Password and confirm password do not match",
        variant: "destructive"
      });
      return;
    }

    // Validation for account numbers
    if (formData.accountNumber && formData.reEnterAccountNumber && 
        formData.accountNumber !== formData.reEnterAccountNumber) {
      toast({
        title: "Account number mismatch",
        description: "Account number and re-entered account number do not match",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Studio data to submit:', formData);
    console.log('Studio services to submit:', studioServices);
    
    
    const formattedStudioServices = studioServices.map(service => {
      const serviceName = getServiceNameById(service.serviceId);
      return {
        id: service.serviceId,
        name: serviceName,
        active: true,
        serviceId: service.serviceId,
        subServices: service.subServices
      };
    });
    
    const randomRating = Math.floor(Math.random() * 10) / 10 + 4.0;
    
    const newStudio = {
      id: generateNewStudioId(),
      studioId: generateStudioIdString(),
      studioName: formData.studioName,
      ownerName: `${formData.ownerFirstName} ${formData.ownerLastName}`.trim(),
      contact: formData.primaryNumber,
      services: formattedStudioServices.length,
      rating: randomRating,
      status: true,
      studioServices: formattedStudioServices
    };
    
    const savedStudios = localStorage.getItem('laundryStudios');
    let studios = savedStudios ? JSON.parse(savedStudios) : [];
    
    studios.push(newStudio);
    localStorage.setItem('laundryStudios', JSON.stringify(studios));
    
    toast({
      title: "Studio saved",
      description: "The studio has been successfully created.",
    });
    
    navigate('/studios');
  };

  
  const generateNewStudioId = (): number => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (!savedStudios) return 1;
    
    const studios = JSON.parse(savedStudios);
    const highestId = studios.reduce((max: number, studio: any) => 
      studio.id > max ? studio.id : max, 0);
    
    return highestId + 1;
  };

  const generateStudioIdString = (): string => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (!savedStudios) return 'STU10001';
    
    const studios = JSON.parse(savedStudios);
    const highestIdNum = studios.reduce((max: number, studio: any) => {
      const idNum = parseInt(studio.studioId.replace('STU', ''), 10);
      return idNum > max ? idNum : max;
    }, 10000);
    
    return `STU${highestIdNum + 1}`;
  };

  const handleServiceAdded = (data: any) => {
    
    if (editingService) {
      const updatedServices = studioServices.map(service => 
        service.serviceId === editingService.serviceId ? {
          serviceId: data.serviceId,
          subServices: data.subServices
        } : service
      );
      
      setStudioServices(updatedServices);
      setEditingService(null);
      
      toast({
        title: "Service updated",
        description: "The service has been updated successfully.",
      });
    } else {
      const existingServiceIndex = studioServices.findIndex(
        service => service.serviceId === data.serviceId
      );
      
      if (existingServiceIndex >= 0) {
        const updatedServices = [...studioServices];
        const existingService = updatedServices[existingServiceIndex];
        
        const mergedSubServices = [...existingService.subServices];
        
        data.subServices.forEach((newSubService: any) => {
          const existingSubServiceIndex = mergedSubServices.findIndex(
            (subSrv: any) => subSrv.name === newSubService.name
          );
          
          if (existingSubServiceIndex >= 0) {
            mergedSubServices[existingSubServiceIndex] = {
              ...mergedSubServices[existingSubServiceIndex],
              ...newSubService
            };
          } else {
            mergedSubServices.push(newSubService);
          }
        });
        
        existingService.subServices = mergedSubServices;
        setStudioServices(updatedServices);
        
        toast({
          title: "Service updated",
          description: "The service has been updated with new information.",
        });
      } else {
        const newService = {
          serviceId: data.serviceId,
          subServices: data.subServices
        };
        
        setStudioServices([...studioServices, newService]);
        
        toast({
          title: "Service added",
          description: "The service has been added to the studio.",
        });
      }
    }
    
    setExpandedServices(prev => ({
      ...prev,
      [data.serviceId]: true
    }));
    
    setIsAddServiceDialogOpen(false);
  };

  
  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleEditService = (serviceIndex: number) => {
    const serviceToEdit = studioServices[serviceIndex];
    setEditingService(serviceToEdit);
    
    setIsAddServiceDialogOpen(true);
    
    toast({
      title: "Edit Service",
      description: "You can now edit the selected service.",
    });
  };

  const handleDeleteService = (serviceIndex: number) => {
    const updatedServices = [...studioServices];
    updatedServices.splice(serviceIndex, 1);
    setStudioServices(updatedServices);
    
    toast({
      title: "Service Deleted",
      description: "The service has been removed from the studio.",
    });
  };

  const getServiceNameById = (id: string) => {
    const service = services.find(s => s.id === id);
    return service ? service.name : 'Unknown Service';
  };

  const getSubServiceNameById = (id: string) => {
    const subService = subServices.find(s => s.id === id);
    return subService ? subService.name : 'Unknown Sub-service';
  };

  const getClothingItemNameById = (id: string) => {
    const item = clothingItems.find(i => i.id === id);
    return item ? item.name : 'Unknown Item';
  };

  return (
    <Layout activeSection="studios">
      <form onSubmit={handleSubmit} className="scrollable-form">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 sticky top-0 z-10 bg-white pb-4 border-b">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/studios')}
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add New Studio</h1>
              <p className="text-gray-600">Create a new laundry studio</p>
            </div>
          </div>
          <Button 
            type="submit"
            className="bg-blue-700 hover:bg-blue-800"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Studio
          </Button>
        </div>

        <Card className="form-card">
          <h2 className="section-title">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner First Name */}
            <div className="space-y-2">
              <Label htmlFor="ownerFirstName" className="text-base font-medium">
                Owner First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ownerFirstName"
                name="ownerFirstName"
                placeholder="First Name"
                value={formData.ownerFirstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Owner Last Name */}
            <div className="space-y-2">
              <Label htmlFor="ownerLastName" className="text-base font-medium">
                Owner Last Name
              </Label>
              <Input
                id="ownerLastName"
                name="ownerLastName"
                placeholder="Last Name"
                value={formData.ownerLastName}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Studio Name */}
            <div className="space-y-2">
              <Label htmlFor="studioName" className="text-base font-medium">
                Studio Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studioName"
                name="studioName"
                placeholder="Studio Name"
                value={formData.studioName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Primary Number */}
            <div className="space-y-2">
              <Label htmlFor="primaryNumber" className="text-base font-medium">
                Primary Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="primaryNumber"
                name="primaryNumber"
                placeholder="Primary Contact Number"
                value={formData.primaryNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Secondary Number */}
            <div className="space-y-2">
              <Label htmlFor="secondaryNumber" className="text-base font-medium">
                Secondary Number
              </Label>
              <Input
                id="secondaryNumber"
                name="secondaryNumber"
                placeholder="Secondary Contact Number"
                value={formData.secondaryNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Address Details */}
        <Card className="form-card">
          <h2 className="section-title">Address Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street" className="text-base font-medium">
                Street
              </Label>
              <Input
                id="street"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleInputChange}
              />
            </div>
            
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base font-medium">
                City
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            
            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-base font-medium">
                State
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Latitude */}
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-base font-medium">
                Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Longitude */}
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-base font-medium">
                Longitude
              </Label>
              <Input
                id="longitude"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-base font-medium">
                Postal Code
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Card>

        {/* Business Details */}
        <Card className="form-card">
          <h2 className="section-title">Business Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GST Registered */}
            <div className="space-y-4 md:col-span-2">
              <Label className="text-base font-medium">
                GST Registered
              </Label>
              <RadioGroup 
                value={isGstRegistered} 
                onValueChange={(value) => handleRadioChange('gstRegistered', value)}
                className="flex flex-row gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="gst-yes" />
                  <Label htmlFor="gst-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="gst-no" />
                  <Label htmlFor="gst-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Business Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="businessRegNumber" className="text-base font-medium">
                Business Registration Number
              </Label>
              <Input
                id="businessRegNumber"
                name="businessRegNumber"
                placeholder="Business Registration Number"
                value={formData.businessRegNumber}
                onChange={handleInputChange}
                disabled={isGstRegistered !== 'yes'}
                className={isGstRegistered !== 'yes' ? "bg-gray-100" : ""}
              />
            </div>
            
            {/* GST/VAT Number */}
            <div className="space-y-2">
              <Label htmlFor="gstNumber" className="text-base font-medium">
                GST/VAT Number
              </Label>
              <Input
                id="gstNumber"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleInputChange}
                disabled={isGstRegistered !== 'yes'}
                className={isGstRegistered !== 'yes' ? "bg-gray-100" : ""}
              />
            </div>
            
            {/* PAN Number */}
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-base font-medium">
                PAN Number
              </Label>
              <Input
                id="panNumber"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Opening Time */}
            <div className="space-y-2">
              <Label htmlFor="openingTime" className="text-base font-medium">
                Opening Time
              </Label>
              <Input
                id="openingTime"
                name="openingTime"
                placeholder="09:00 AM"
                value={formData.openingTime}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Closing Time */}
            <div className="space-y-2">
              <Label htmlFor="closingTime" className="text-base font-medium">
                Closing Time
              </Label>
              <Input
                id="closingTime"
                name="closingTime"
                placeholder="09:00 PM"
                value={formData.closingTime}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Price Adjustment */}
            <div className="space-y-2">
              <Label htmlFor="priceAdjustment" className="text-base font-medium">
                Price Adjustment %
              </Label>
              <Input
                id="priceAdjustment"
                name="priceAdjustment"
                placeholder="0"
                value={formData.priceAdjustment}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Card>

        {/* Studio Setup */}
        <Card className="form-card">
          <h2 className="section-title">Studio Setup</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number of Employees */}
            <div className="space-y-2">
              <Label htmlFor="employeeCount" className="text-base font-medium">
                Number of Employees
              </Label>
              <Input
                id="employeeCount"
                name="employeeCount"
                placeholder="0"
                value={formData.employeeCount}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Daily Capacity */}
            <div className="space-y-2">
              <Label htmlFor="dailyCapacity" className="text-base font-medium">
                Daily Capacity (In KG's)
              </Label>
              <Input
                id="dailyCapacity"
                name="dailyCapacity"
                placeholder="0"
                value={formData.dailyCapacity}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Special Equipment */}
            <div className="space-y-2">
              <Label htmlFor="specialEquipment" className="text-base font-medium">
                Special Equipment
              </Label>
              <Input
                id="specialEquipment"
                name="specialEquipment"
                placeholder="Special Equipment"
                value={formData.specialEquipment}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Wash Category */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Select Wash Category
              </Label>
              <RadioGroup 
                value={formData.washCategory} 
                onValueChange={(value) => handleRadioChange('washCategory', value)}
                className="flex flex-row gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard Wash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express">Express Wash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Payment Details */}
        <Card className="form-card">
          <h2 className="section-title">Payment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="accountHolderName" className="text-base font-medium">
                Account Holder Name
              </Label>
              <Input
                id="accountHolderName"
                name="accountHolderName"
                placeholder="Account Holder Name"
                value={formData.accountHolderName}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-base font-medium">
                Bank Name
              </Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-base font-medium">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Re-enter Account Number */}
            <div className="space-y-2">
              <Label htmlFor="reEnterAccountNumber" className="text-base font-medium">
                Re-enter Account Number
              </Label>
              <Input
                id="reEnterAccountNumber"
                name="reEnterAccountNumber"
                placeholder="Re-enter Account Number"
                value={formData.reEnterAccountNumber}
                onChange={handleInputChange}
              />
            </div>
            
            {/* IFSC Code */}
            <div className="space-y-2">
              <Label htmlFor="ifscCode" className="text-base font-medium">
                IFSC Code
              </Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="branchName" className="text-base font-medium">
                Branch Name
              </Label>
              <Input
                id="branchName"
                name="branchName"
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={handleInputChange}
              />
            </div>
            
            {/* UPI ID */}
            <div className="space-y-2">
              <Label htmlFor="upiId" className="text-base font-medium">
                UPI ID
              </Label>
              <Input
                id="upiId"
                name="upiId"
                placeholder="UPI ID"
                value={formData.upiId}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Payment Schedule */}
            <div className="space-y-4 md:col-span-2">
              <Label className="text-base font-medium">
                Select Payment Schedule
              </Label>
              <RadioGroup 
                value={formData.paymentSchedule} 
                onValueChange={(value) => handleRadioChange('paymentSchedule', value)}
                className="flex flex-row gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily Payment</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Services */}
        <Card className="form-card">
          <h2 className="section-title">Services</h2>
          
          <Button 
            type="button"
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-800 transition mb-6"
            onClick={() => {
              setEditingService(null);
              setIsAddServiceDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Services
          </Button>

          {studioServices.length > 0 ? (
            <div className="space-y-4">
              {studioServices.map((studioService, index) => {
                const serviceName = getServiceNameById(studioService.serviceId);
                const isExpanded = expandedServices[studioService.serviceId] || false;
                
                return (
                  <Card key={`${studioService.serviceId}-${index}`} className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="bg-gray-50 rounded-t-lg flex flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => toggleServiceExpansion(studioService.serviceId)}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                        <CardTitle className="text-lg font-bold text-gray-800">{serviceName}</CardTitle>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditService(index)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteService(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="p-4">
                        <div className="space-y-6">
                          {studioService.subServices.map((subService, subIndex) => {
                            const subServiceName = getSubServiceNameById(subService.name);
                            
                            return (
                              <div key={`${subService.id || subIndex}`} className="border rounded-lg p-4 shadow-sm">
                                <h4 className="text-base font-semibold text-gray-700 mb-3">{subServiceName}</h4>
                                
                                <div className="space-y-4 mb-4">
                                  {formData.washCategory === 'standard' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-sm text-gray-500">Standard Price per KG:</span>
                                        <span className="ml-2 font-medium">₹{subService.standardPricePerKg || subService.pricePerKg || '0'}</span>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-500">Standard Price per Item:</span>
                                        <span className="ml-2 font-medium">₹{subService.standardPricePerItem || subService.pricePerItem || '0'}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {formData.washCategory === 'express' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-sm text-gray-500">Express Price per KG:</span>
                                        <span className="ml-2 font-medium">₹{subService.expressPricePerKg || subService.pricePerKg || '0'}</span>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-500">Express Price per Item:</span>
                                        <span className="ml-2 font-medium">₹{subService.expressPricePerItem || subService.pricePerItem || '0'}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {formData.washCategory === 'both' && (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-sm text-gray-500">Standard Price per KG:</span>
                                          <span className="ml-2 font-medium">₹{subService.standardPricePerKg || subService.pricePerKg || '0'}</span>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Standard Price per Item:</span>
                                          <span className="ml-2 font-medium">₹{subService.standardPricePerItem || subService.pricePerItem || '0'}</span>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-sm text-gray-500">Express Price per KG:</span>
                                          <span className="ml-2 font-medium">₹{subService.expressPricePerKg || '0'}</span>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Express Price per Item:</span>
                                          <span className="ml-2 font-medium">₹{subService.expressPricePerItem || '0'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {subService.selectedItems && subService.selectedItems.length > 0 && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Items:</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {subService.selectedItems.map((itemId: string, itemIndex: number) => (
                                        <span 
                                          key={`${itemId}-${itemIndex}`} 
                                          className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                                        >
                                          {getClothingItemNameById(itemId)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
              <p className="text-gray-500">No services added yet. Click the "Add Services" button to add services.</p>
            </div>
          )}
        </Card>

        {/* Service Dialog */}
        {isAddServiceDialogOpen && (
          <MultiSelectServiceDialog
            isOpen={isAddServiceDialogOpen}
            onOpenChange={setIsAddServiceDialogOpen}
            services={services}
            subServices={subServices}
            clothingItems={clothingItems}
            washCategory={formData.washCategory}
            onSave={handleServiceAdded}
            editingService={editingService}
          />
        )}
      </form>
    </Layout>
  );
};

export default AddStudio;
