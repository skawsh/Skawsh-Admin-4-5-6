
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Pencil, Package, Plus, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface StudioDetails {
  id: number;
  studioId: string;
  studioName: string;
  ownerName: string;
  contact: string;
  email: string;
  secondaryContact?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude?: string;
    longitude?: string;
  };
  business: {
    registrationNumber: string;
    gstVatNumber: string;
    panNumber: string;
    openingTime: string;
    closingTime: string;
    priceAdjustment: string;
  };
  studio: {
    employees: number;
    dailyCapacity: number;
    specialEquipment: string;
    washCategory: string[];
  };
  payment: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    upiId: string;
    paymentSchedule: string;
  };
  services: number;
  rating: number;
  status: boolean;
  studioServices?: StudioService[];
}

interface StudioService {
  id: string;
  name: string;
  active: boolean;
  price?: number;
}

const StudioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studioDetails, setStudioDetails] = useState<StudioDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(0);

  useEffect(() => {
    const fetchStudioDetails = () => {
      setLoading(true);
      try {
        // Get all studios from localStorage
        const savedStudios = localStorage.getItem('laundryStudios');
        
        if (savedStudios) {
          const studios = JSON.parse(savedStudios);
          const studio = studios.find((s: any) => s.id === Number(id));
          
          if (studio) {
            // This is a simplified version - in a real app, this would come from the backend
            // For now, we'll mock the additional details
            const studioFullDetails: StudioDetails = {
              ...studio,
              email: "saitejasamala0808@gmail.com",
              secondaryContact: "9000135876",
              address: {
                street: "1-23/45, Main Street",
                city: "Hyderabad",
                state: "Telangana",
                postalCode: "500081",
                latitude: "17.3850",
                longitude: "78.4867"
              },
              business: {
                registrationNumber: "UADJFDFJ4427287",
                gstVatNumber: "GST9876541",
                panNumber: "ABCDE1234F",
                openingTime: "09:00 AM",
                closingTime: "09:00 PM",
                priceAdjustment: "10%"
              },
              studio: {
                employees: 2,
                dailyCapacity: 100,
                specialEquipment: "Special dry cleaning",
                washCategory: ["Standard Wash", "Express Wash"]
              },
              payment: {
                accountHolderName: studio.ownerName,
                bankName: "HDFC",
                accountNumber: "50107846646453",
                ifscCode: "HDFC00236898",
                branchName: "Gachibowli Phase-2",
                upiId: `${studio.ownerName.toLowerCase().replace(/\s+/g, '')}@upi`,
                paymentSchedule: "Daily Payment"
              },
              // Mock services for the studio
              studioServices: [
                { id: '1', name: 'Dry Cleaning', active: true, price: 150 },
                { id: '2', name: 'Express Wash', active: true, price: 200 },
                { id: '3', name: 'Steam Iron', active: false, price: 100 },
                { id: '4', name: 'Stain Removal', active: true, price: 180 }
              ]
            };
            
            setStudioDetails(studioFullDetails);
          } else {
            toast({
              variant: "destructive",
              title: "Studio not found",
              description: "The requested studio could not be found"
            });
            navigate('/studios');
          }
        } else {
          toast({
            variant: "destructive",
            title: "No studios found",
            description: "No studios are available in the system"
          });
          navigate('/studios');
        }
      } catch (error) {
        console.error('Error fetching studio details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load studio details"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudioDetails();
  }, [id, navigate, toast]);

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name cannot be empty"
      });
      return;
    }

    if (newServicePrice <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Price must be greater than zero"
      });
      return;
    }

    if (studioDetails && studioDetails.studioServices) {
      const newService: StudioService = {
        id: Date.now().toString(),
        name: newServiceName,
        active: true,
        price: newServicePrice
      };

      const updatedStudioDetails = {
        ...studioDetails,
        studioServices: [...studioDetails.studioServices, newService]
      };

      setStudioDetails(updatedStudioDetails);
      
      // In a real application, you would save this to the backend
      // For now, we're just updating the state
      
      toast({
        title: "Service Added",
        description: `${newServiceName} has been added to this studio's services`
      });

      // Reset form
      setNewServiceName('');
      setNewServicePrice(0);
      setShowAddService(false);
    }
  };

  const toggleServiceStatus = (serviceId: string) => {
    if (studioDetails && studioDetails.studioServices) {
      const updatedServices = studioDetails.studioServices.map(service => 
        service.id === serviceId ? { ...service, active: !service.active } : service
      );

      const updatedStudioDetails = {
        ...studioDetails,
        studioServices: updatedServices
      };

      setStudioDetails(updatedStudioDetails);
      
      const service = studioDetails.studioServices.find(s => s.id === serviceId);
      toast({
        title: service?.active ? "Service Disabled" : "Service Enabled",
        description: `${service?.name} has been ${service?.active ? "disabled" : "enabled"}`
      });
    }
  };

  const deleteService = (serviceId: string) => {
    if (studioDetails && studioDetails.studioServices) {
      const service = studioDetails.studioServices.find(s => s.id === serviceId);
      const updatedServices = studioDetails.studioServices.filter(
        service => service.id !== serviceId
      );

      const updatedStudioDetails = {
        ...studioDetails,
        studioServices: updatedServices
      };

      setStudioDetails(updatedStudioDetails);
      
      toast({
        title: "Service Removed",
        description: `${service?.name} has been removed from this studio's services`
      });
    }
  };

  if (loading) {
    return (
      <Layout activeSection="studios">
        <div className="flex items-center justify-center h-screen">
          <p>Loading studio details...</p>
        </div>
      </Layout>
    );
  }

  if (!studioDetails) {
    return (
      <Layout activeSection="studios">
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl">Studio not found</p>
          <Button className="mt-4" onClick={() => navigate('/studios')}>
            Return to Studios
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        {/* Header with back button and edit button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/studios')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{studioDetails.studioName}</h1>
              <p className="text-gray-600">ID: {studioDetails.studioId}</p>
            </div>
          </div>
          <Button 
            className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
            onClick={() => {
              toast({
                title: "Edit mode",
                description: "Edit functionality to be implemented"
              });
            }}
          >
            <Pencil className="h-4 w-4" />
            Edit Details
          </Button>
        </div>

        {/* Basic Information Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Owner Name</p>
                <p className="text-lg font-medium">{studioDetails.ownerName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Studio Name</p>
                <p className="text-lg font-medium">{studioDetails.studioName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email</p>
                <p className="text-lg font-medium">{studioDetails.email}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Primary Number</p>
                <p className="text-lg font-medium">{studioDetails.contact}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Secondary Number</p>
                <p className="text-lg font-medium">{studioDetails.secondaryContact || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Details Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Address Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Street</p>
                <p className="text-lg font-medium">{studioDetails.address.street}</p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 mb-1">City</p>
                    <p className="text-lg font-medium">{studioDetails.address.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">State</p>
                    <p className="text-lg font-medium">{studioDetails.address.state}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Latitude</p>
                <p className="text-lg font-medium">{studioDetails.address.latitude || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Longitude</p>
                <p className="text-lg font-medium">{studioDetails.address.longitude || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Postal Code</p>
                <p className="text-lg font-medium">{studioDetails.address.postalCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Business Registration Number</p>
                <p className="text-lg font-medium">{studioDetails.business.registrationNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">GST/VAT Number</p>
                <p className="text-lg font-medium">{studioDetails.business.gstVatNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">PAN Number</p>
                <p className="text-lg font-medium">{studioDetails.business.panNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Opening Time</p>
                <p className="text-lg font-medium">{studioDetails.business.openingTime}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Closing Time</p>
                <p className="text-lg font-medium">{studioDetails.business.closingTime}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Price Adjustment %</p>
                <p className="text-lg font-medium">{studioDetails.business.priceAdjustment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Studio Setup Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Studio Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Number of Employees</p>
                <p className="text-lg font-medium">{studioDetails.studio.employees}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Daily Capacity (In KG's)</p>
                <p className="text-lg font-medium">{studioDetails.studio.dailyCapacity}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Special Equipment</p>
                <p className="text-lg font-medium">{studioDetails.studio.specialEquipment || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Selected Wash Category</p>
                <div className="space-y-1">
                  {studioDetails.studio.washCategory.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-800"></div>
                      <span>{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Studio Services Card - NEW SECTION */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Studio Services
              </h2>
              <Button 
                onClick={() => setShowAddService(!showAddService)} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </div>

            {showAddService && (
              <div className="mb-6 p-4 border rounded-md bg-gray-50">
                <h3 className="font-semibold mb-3">Add New Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service Name</label>
                    <input
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter service name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(parseFloat(e.target.value))}
                      className="w-full p-2 border rounded"
                      placeholder="Enter price"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddService(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddService}>
                    Save Service
                  </Button>
                </div>
              </div>
            )}

            {studioDetails.studioServices && studioDetails.studioServices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Service Name</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studioDetails.studioServices.map((service) => (
                      <tr key={service.id} className="border-b">
                        <td className="p-3">{service.name}</td>
                        <td className="p-3">₹{service.price}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={service.active}
                              onCheckedChange={() => toggleServiceStatus(service.id)}
                            />
                            <Badge variant={service.active ? "default" : "outline"}>
                              {service.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => deleteService(service.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No services have been added to this studio yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Account Holder Name</p>
                <p className="text-lg font-medium">{studioDetails.payment.accountHolderName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Bank Name</p>
                <p className="text-lg font-medium">{studioDetails.payment.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Account Number</p>
                <p className="text-lg font-medium">{studioDetails.payment.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">IFSC Code</p>
                <p className="text-lg font-medium">{studioDetails.payment.ifscCode}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Branch Name</p>
                <p className="text-lg font-medium">{studioDetails.payment.branchName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">UPI ID</p>
                <p className="text-lg font-medium">{studioDetails.payment.upiId}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Selected Payment Schedule</p>
                <p className="text-lg font-medium">{studioDetails.payment.paymentSchedule}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudioDetails;
