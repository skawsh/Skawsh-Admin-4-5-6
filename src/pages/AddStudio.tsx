import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AddServiceDialog from "@/components/studio/AddServiceDialog";
import { useServicesData } from '@/hooks/useServicesData';

const AddStudio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { services, subServices, clothingItems } = useServicesData();
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [studioServices, setStudioServices] = useState<any[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    ownerFirstName: '',
    ownerLastName: '',
    studioName: '',
    email: '',
    primaryNumber: '',
    secondaryNumber: '',
    
    // Address Details
    street: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    
    // Business Details
    businessRegNumber: '',
    gstNumber: '',
    panNumber: '',
    openingTime: '09:00 AM',
    closingTime: '09:00 PM',
    priceAdjustment: '0',
    
    // Studio Setup
    employeeCount: '0',
    dailyCapacity: '0',
    specialEquipment: '',
    washCategory: 'both',
    
    // Payment Details
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to an API
    console.log('Studio data to submit:', formData);
    
    // Show success toast
    toast({
      title: "Studio saved",
      description: "The studio has been successfully created.",
    });
    
    // Navigate back to studios page
    navigate('/studios');
  };

  const handleServiceAdded = (data: any) => {
    setStudioServices([...studioServices, data]);
    toast({
      title: "Service added",
      description: "The service has been added to the studio.",
    });
  };

  return (
    <Layout activeSection="studios">
      <form onSubmit={handleSubmit}>
        {/* Header with back button and save button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
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

        {/* Basic Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </Card>

        {/* Address Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Address Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Business Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />
            </div>
            
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
              />
            </div>
            
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
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Studio Setup</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Services Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Services</h2>
          
          <Button 
            type="button"
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-800 transition"
            onClick={() => setIsAddServiceDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Services
          </Button>

          {studioServices.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">{studioServices.length} service(s) added</p>
            </div>
          )}
        </Card>

        <AddServiceDialog
          isOpen={isAddServiceDialogOpen}
          onOpenChange={setIsAddServiceDialogOpen}
          services={services}
          subServices={subServices}
          clothingItems={clothingItems}
          onServiceAdded={handleServiceAdded}
        />
      </form>
    </Layout>
  );
};

export default AddStudio;
